import { NextRequest } from 'next/server'
import { trackError } from './monitoring'

// Security utilities for API routes

export interface SecurityContext {
  userId?: string
  workspaceId?: string
  isAuthenticated: boolean
  permissions: string[]
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  skipSuccessfulRequests: false
}

// Validate file upload security
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }
  }

  // Check file name for malicious patterns
  const maliciousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"|?*]/, // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
    /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|php|asp|aspx|jsp)$/i // Executable extensions
  ]

  for (const pattern of maliciousPatterns) {
    if (pattern.test(file.name)) {
      return { valid: false, error: 'Invalid file name detected' }
    }
  }

  return { valid: true }
}

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000) // Limit length
}

// Validate region data
export const validateRegionData = (region: any): { valid: boolean; error?: string } => {
  if (!region || typeof region !== 'object') {
    return { valid: false, error: 'Invalid region data' }
  }

  if (!region.name || typeof region.name !== 'string') {
    return { valid: false, error: 'Region name is required' }
  }

  if (region.name.length > 50) {
    return { valid: false, error: 'Region name too long' }
  }

  const validTypes = ['posture', 'cosmetic', 'repair', 'enhancement']
  if (!validTypes.includes(region.type)) {
    return { valid: false, error: 'Invalid region type' }
  }

  return { valid: true }
}

// Validate effect data
export const validateEffectData = (effect: any): { valid: boolean; error?: string } => {
  if (!effect || typeof effect !== 'object') {
    return { valid: false, error: 'Invalid effect data' }
  }

  if (typeof effect.intensity !== 'number' || effect.intensity < -1 || effect.intensity > 1) {
    return { valid: false, error: 'Invalid intensity value' }
  }

  const validTypes = ['straighten', 'align', 'position', 'brightness', 'smoothness', 'color']
  if (!validTypes.includes(effect.type)) {
    return { valid: false, error: 'Invalid effect type' }
  }

  return { valid: true }
}

// Rate limiting middleware
export const rateLimit = (identifier: string): { allowed: boolean; remaining?: number } => {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs

  // Clean up expired entries
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  })

  const current = rateLimitStore.get(identifier) || { count: 0, resetTime: now + RATE_LIMIT_CONFIG.windowMs }

  if (current.resetTime < now) {
    // Reset window
    current.count = 0
    current.resetTime = now + RATE_LIMIT_CONFIG.windowMs
  }

  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  current.count++
  rateLimitStore.set(identifier, current)

  return { 
    allowed: true, 
    remaining: RATE_LIMIT_CONFIG.maxRequests - current.count 
  }
}

// Extract client IP for rate limiting
export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Security headers middleware
export const addSecurityHeaders = (response: Response): Response => {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'"
  )

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )

  return response
}

// Validate request body size
export const validateRequestBodySize = (request: NextRequest, maxSize: number = 1024 * 1024): boolean => {
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > maxSize) {
    return false
  }
  return true
}

// Security audit logging
export const logSecurityEvent = (event: string, details: Record<string, any>, request: NextRequest) => {
  const securityEvent = {
    event,
    details,
    timestamp: new Date().toISOString(),
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent'),
    url: request.url
  }

  // In production, send to security monitoring system
  console.warn('🚨 Security Event:', securityEvent)
  
  trackError(new Error(`Security Event: ${event}`), {
    component: 'security',
    action: event,
    metadata: securityEvent
  })
}

// Validate workspace access (placeholder for real auth)
export const validateWorkspaceAccess = async (workspaceId: string, userId?: string): Promise<boolean> => {
  // In a real implementation, this would:
  // 1. Verify JWT token
  // 2. Check user permissions for workspace
  // 3. Validate workspace exists and is active
  
  if (!workspaceId) return false
  if (!userId) return false // In demo mode, allow if no auth required
  
  // For demo purposes, allow access
  return true
}

// Input validation middleware
export const validateRequest = (request: NextRequest, schema: any) => {
  try {
    // This would integrate with your validation library (Zod, Joi, etc.)
    // For now, basic validation
    return { valid: true }
  } catch (error) {
    logSecurityEvent('validation_failed', { error: error instanceof Error ? error.message : 'Unknown error' }, request)
    return { valid: false, error: 'Invalid request data' }
  }
}

// CORS configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
}

// Handle CORS preflight
export const handleCORS = (request: NextRequest) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  return null
}
