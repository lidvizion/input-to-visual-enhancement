import { z } from 'zod'

// File validation schema
export const fileValidationSchema = z.object({
  name: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid file name characters'),
  size: z.number()
    .min(1, 'File cannot be empty')
    .max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Only JPEG, PNG, and WebP images are allowed'
  })
})

// Region validation schema
export const regionSchema = z.object({
  name: z.string()
    .min(1, 'Region name is required')
    .max(50, 'Region name too long')
    .regex(/^[a-zA-Z0-9\s-()]+$/, 'Invalid characters in region name'),
  type: z.enum(['posture', 'cosmetic', 'repair', 'enhancement'], {
    message: 'Invalid region type'
  })
})

// Effect validation schema
export const effectSchema = z.object({
  name: z.string()
    .min(1, 'Effect name is required')
    .max(50, 'Effect name too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid characters in effect name'),
  type: z.enum(['straighten', 'align', 'position', 'brightness', 'smoothness', 'color'], {
    message: 'Invalid effect type'
  }),
  intensity: z.number()
    .min(-1, 'Intensity must be at least -1')
    .max(1, 'Intensity must be at most 1'),
  min: z.number().default(-1),
  max: z.number().default(1),
  step: z.number().positive().default(0.1)
})

// Processing request validation
export const processingRequestSchema = z.object({
  fileId: z.string().min(1, 'File ID is required'),
  edits: z.array(z.object({
    region: z.string().min(1, 'Region is required'),
    effect: z.string().min(1, 'Effect is required'),
    intensity: z.number().min(-1).max(1)
  })).min(1, 'At least one edit is required'),
  options: z.object({
    generate3D: z.boolean().optional(),
    includeReport: z.boolean().optional()
  }).optional()
})

// Export options validation
export const exportOptionsSchema = z.object({
  format: z.enum(['jpg', 'png', 'glb', 'pdf'], {
    message: 'Invalid export format'
  }),
  quality: z.number().min(0.1).max(1).optional().default(0.9),
  includeMetadata: z.boolean().optional().default(true),
  includeReport: z.boolean().optional().default(false)
})

// Utility functions for validation
export const validateFile = (file: File): { success: boolean; error?: string } => {
  try {
    fileValidationSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    })
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError && error.issues.length > 0) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Invalid file' }
  }
}

export const validateRegion = (region: { name: string; type: string }): { success: boolean; error?: string } => {
  try {
    regionSchema.parse(region)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError && error.issues.length > 0) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Invalid region data' }
  }
}

export const validateEffect = (effect: any): { success: boolean; error?: string } => {
  try {
    effectSchema.parse(effect)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError && error.issues.length > 0) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Invalid effect data' }
  }
}

// Sanitization functions
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}

export const sanitizeRegionName = (name: string): string => {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s-()]/g, '')
    .replace(/\s{2,}/g, ' ')
    .substring(0, 50)
}

export const sanitizeEffectName = (name: string): string => {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s{2,}/g, ' ')
    .substring(0, 50)
}
