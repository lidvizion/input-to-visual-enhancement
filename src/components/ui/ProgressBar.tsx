import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
  animated?: boolean
  className?: string
  label?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  variant = 'default',
  showPercentage = true,
  animated = true,
  className,
  label,
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const variants = {
    default: 'bg-blue-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-slate-600">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-slate-200 rounded-full overflow-hidden shadow-inner',
        sizes[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            variants[variant],
            animated && 'animate-pulse'
          )}
          style={{
            width: `${clampedProgress}%`,
          }}
        />
      </div>
      
      {!label && showPercentage && (
        <div className="text-right mt-1">
          <span className="text-xs text-slate-500">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}
