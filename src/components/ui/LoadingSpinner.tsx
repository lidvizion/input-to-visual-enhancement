import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'gradient'
  className?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const DefaultSpinner = () => (
    <svg
      className={cn('animate-spin', sizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const DotsSpinner = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-current rounded-full animate-pulse',
            size === 'sm' ? 'w-1 h-1' :
            size === 'md' ? 'w-2 h-2' :
            size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  )

  const PulseSpinner = () => (
    <div
      className={cn(
        'bg-current rounded-full animate-pulse',
        sizes[size]
      )}
    />
  )

  const GradientSpinner = () => (
    <div className={cn('relative', sizes[size])}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-spin">
        <div className="absolute inset-1 bg-white rounded-full"></div>
      </div>
    </div>
  )

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />
      case 'pulse':
        return <PulseSpinner />
      case 'gradient':
        return <GradientSpinner />
      default:
        return <DefaultSpinner />
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="text-blue-600">
        {renderSpinner()}
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}
