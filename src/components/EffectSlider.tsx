import React from 'react'
import { Slider } from './ui/Slider'
import { cn } from '@/lib/utils'
import { EditEffect, EffectSliderProps } from '@/types'

const EFFECT_ICONS: Record<string, string> = {
  straighten: '📏',
  align: '↔️',
  position: '📍',
  brightness: '☀️',
  smoothness: '✨',
  color: '🎨',
}

const EFFECT_DESCRIPTIONS: Record<string, string> = {
  straighten: 'Adjust alignment and straightness',
  align: 'Align elements horizontally or vertically',
  position: 'Reposition elements in the image',
  brightness: 'Adjust overall brightness and contrast',
  smoothness: 'Smooth out textures and surfaces',
  color: 'Adjust color saturation and hue',
}

export const EffectSlider: React.FC<EffectSliderProps> = ({
  effect,
  value,
  onChange,
  disabled = false,
}) => {
  const icon = EFFECT_ICONS[effect.type] || '🎛️'
  const description = EFFECT_DESCRIPTIONS[effect.type] || 'Adjust effect intensity'

  const getValueLabel = (val: number) => {
    if (effect.type === 'brightness') {
      return val > 0 ? `+${Math.round(val * 100)}%` : `${Math.round(val * 100)}%`
    }
    if (effect.type === 'smoothness') {
      return `${Math.round(val * 100)}%`
    }
    return Math.round(val * 100) / 100
  }

  const getIntensityColor = (val: number) => {
    const normalized = (val - effect.min) / (effect.max - effect.min)
    if (normalized < 0.3) return 'text-green-600'
    if (normalized < 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={cn(
      'premium-card p-4 transition-all duration-300 group',
      disabled && 'opacity-50 pointer-events-none',
      !disabled && 'hover:shadow-md hover:scale-[1.01]'
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className={cn(
            'p-2 rounded-lg transition-all duration-200 flex-shrink-0',
            disabled ? 'bg-slate-100' : 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:scale-105'
          )}>
            <span className="text-base">{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-slate-800 mb-1">{effect.name}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <div className={cn(
            'text-lg font-bold',
            getIntensityColor(value)
          )}>
            {getValueLabel(value)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Slider
              value={value}
              onChange={onChange}
              min={effect.min}
              max={effect.max}
              step={effect.step}
              disabled={disabled}
              className="w-full"
            />
          </div>
          
          {/* Preset Values */}
          <div className="flex space-x-2 flex-shrink-0">
            {[-0.5, 0, 0.5].map((preset) => (
              <button
                key={preset}
                onClick={() => onChange(preset)}
                disabled={disabled}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-md border transition-all duration-200',
                  Math.abs(value - preset) < 0.01
                    ? 'bg-blue-500 border-blue-500 text-white shadow-md scale-105'
                    : 'bg-white/50 border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-105'
                )}
              >
                {preset === 0 ? 'Reset' : preset > 0 ? `+${preset}` : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={cn(
                'h-full transition-all duration-300 rounded-full',
                value < 0 ? 'bg-gradient-to-r from-red-500 to-yellow-500' :
                value === 0 ? 'bg-slate-400' :
                'bg-gradient-to-r from-yellow-500 to-green-500'
              )}
              style={{
                width: `${Math.abs(value) * 100}%`,
                marginLeft: value < 0 ? `${(1 - Math.abs(value)) * 100}%` : '0%',
              }}
            />
          </div>
          <div className="w-10 text-center">
            <span className="text-sm font-bold text-slate-700">
              {Math.round(Math.abs(value) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
