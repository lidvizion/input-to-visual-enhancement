// Monitoring and error tracking utilities
// In a real application, you would integrate with Sentry, LogRocket, or similar

interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  workspaceId?: string
  metadata?: Record<string, any>
}

interface EventProperties {
  [key: string]: any
}

class MonitoringService {
  private isDevelopment = process.env.NODE_ENV === 'development'

  // Track errors with context
  trackError(error: Error, context: ErrorContext = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    }

    if (this.isDevelopment) {
      console.error('🚨 Error Tracked:', errorInfo)
    } else {
      // In production, send to monitoring service
      this.sendToMonitoringService('error', errorInfo)
    }
  }

  // Track user events
  trackEvent(event: string, properties: EventProperties = {}) {
    const eventInfo = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    }

    if (this.isDevelopment) {
      console.log('📊 Event Tracked:', eventInfo)
    } else {
      // In production, send to analytics service
      this.sendToAnalyticsService(eventInfo)
    }
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, context: Record<string, any> = {}) {
    const performanceInfo = {
      metric,
      value,
      context,
      timestamp: new Date().toISOString()
    }

    if (this.isDevelopment) {
      console.log('⚡ Performance Tracked:', performanceInfo)
    } else {
      // In production, send to performance monitoring
      this.sendToPerformanceService(performanceInfo)
    }
  }

  // Track user interactions
  trackUserAction(action: string, component: string, properties: EventProperties = {}) {
    this.trackEvent('user_action', {
      action,
      component,
      ...properties
    })
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, status: number, duration: number) {
    this.trackEvent('api_call', {
      endpoint,
      method,
      status,
      duration,
      success: status >= 200 && status < 400
    })
  }

  // Track file operations
  trackFileOperation(operation: string, fileType: string, fileSize: number, success: boolean) {
    this.trackEvent('file_operation', {
      operation,
      fileType,
      fileSize,
      success
    })
  }

  // Track 3D rendering performance
  track3DRendering(modelUrl: string, loadTime: number, renderTime: number, success: boolean) {
    this.trackPerformance('3d_rendering', renderTime, {
      modelUrl,
      loadTime,
      success
    })
  }

  // Private methods for production integrations
  private sendToMonitoringService(type: string, data: any) {
    // Integration with Sentry, LogRocket, etc.
    // Example:
    // Sentry.captureException(data)
    console.log(`[PROD] Sending ${type} to monitoring service:`, data)
  }

  private sendToAnalyticsService(data: any) {
    // Integration with Google Analytics, Mixpanel, etc.
    // Example:
    // gtag('event', data.event, data.properties)
    console.log('[PROD] Sending to analytics service:', data)
  }

  private sendToPerformanceService(data: any) {
    // Integration with performance monitoring
    console.log('[PROD] Sending to performance service:', data)
  }

  private getUserId(): string | undefined {
    // Get user ID from auth context
    return typeof window !== 'undefined' ? 
      localStorage.getItem('userId') || undefined : 
      undefined
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('sessionId', sessionId)
    }
    return sessionId
  }
}

// Create singleton instance
export const monitoring = new MonitoringService()

// Convenience functions
export const trackError = (error: Error, context?: ErrorContext) => {
  monitoring.trackError(error, context)
}

export const trackEvent = (event: string, properties?: EventProperties) => {
  monitoring.trackEvent(event, properties)
}

export const trackUserAction = (action: string, component: string, properties?: EventProperties) => {
  monitoring.trackUserAction(action, component, properties)
}

export const trackApiCall = (endpoint: string, method: string, status: number, duration: number) => {
  monitoring.trackApiCall(endpoint, method, status, duration)
}

export const trackFileOperation = (operation: string, fileType: string, fileSize: number, success: boolean) => {
  monitoring.trackFileOperation(operation, fileType, fileSize, success)
}

export const track3DRendering = (modelUrl: string, loadTime: number, renderTime: number, success: boolean) => {
  monitoring.track3DRendering(modelUrl, loadTime, renderTime, success)
}

// Error boundary helper
export const withErrorTracking = (component: string) => {
  return (error: Error, errorInfo: any) => {
    trackError(error, {
      component,
      action: 'error_boundary',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    })
  }
}

// Performance monitoring helpers
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start
      monitoring.trackPerformance(name, duration)
    })
  } else {
    const duration = performance.now() - start
    monitoring.trackPerformance(name, duration)
    return result
  }
}

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return

  // Track Core Web Vitals
  const trackCLS = (metric: any) => {
    monitoring.trackPerformance('web_vitals_cls', metric.value)
  }

  const trackFID = (metric: any) => {
    monitoring.trackPerformance('web_vitals_fid', metric.value)
  }

  const trackFCP = (metric: any) => {
    monitoring.trackPerformance('web_vitals_fcp', metric.value)
  }

  const trackLCP = (metric: any) => {
    monitoring.trackPerformance('web_vitals_lcp', metric.value)
  }

  const trackTTFB = (metric: any) => {
    monitoring.trackPerformance('web_vitals_ttfb', metric.value)
  }

  // In a real app, you would use web-vitals library
  // getCLS(trackCLS)
  // getFID(trackFID)
  // getFCP(trackFCP)
  // getLCP(trackLCP)
  // getTTFB(trackTTFB)
}
