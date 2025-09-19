import React, { useState } from 'react'
import { Plus, Target, Trash2 } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import { EditRegion, RegionSelectorProps } from '@/types'

const PRESET_REGIONS: Omit<EditRegion, 'id'>[] = [
  { name: 'Spine (Upper)', type: 'posture' },
  { name: 'Spine (Lower)', type: 'posture' },
  { name: 'Shoulders', type: 'posture' },
  { name: 'Head Position', type: 'posture' },
  { name: 'Mouth/Smile', type: 'cosmetic' },
  { name: 'Eyes', type: 'cosmetic' },
  { name: 'Skin Texture', type: 'cosmetic' },
  { name: 'Device Body', type: 'repair' },
  { name: 'Device Screen', type: 'repair' },
  { name: 'Overall Brightness', type: 'enhancement' },
]

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  selectedRegion,
  onRegionSelect,
  onRegionAdd,
  onRegionRemove,
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRegionName, setNewRegionName] = useState('')
  const [newRegionType, setNewRegionType] = useState<EditRegion['type']>('posture')
  const [pulseRegion, setPulseRegion] = useState<string | null>(null)

  const handleAddRegion = () => {
    if (newRegionName.trim()) {
      const regionName = newRegionName.trim()
      // Check if region with same name already exists
      const isDuplicate = regions.some(region => 
        region.name.toLowerCase() === regionName.toLowerCase()
      )
      
      if (isDuplicate) {
        alert(`Region "${regionName}" already exists!`)
        return
      }
      
      onRegionAdd({
        name: regionName,
        type: newRegionType,
      })
      setNewRegionName('')
      setShowAddForm(false)
    }
  }

  const handleRegionClick = (regionId: string) => {
    onRegionSelect(regionId)
    // Add visual feedback for re-selection
    setPulseRegion(regionId)
    setTimeout(() => setPulseRegion(null), 300)
  }

  const handlePresetRegionAdd = (preset: Omit<EditRegion, 'id'>) => {
    // Check if region with same name already exists
    const isDuplicate = regions.some(region => 
      region.name.toLowerCase() === preset.name.toLowerCase()
    )
    
    if (isDuplicate) {
      alert(`Region "${preset.name}" already exists!`)
      return
    }
    
    onRegionAdd(preset)
  }

  const getRegionIcon = (type: EditRegion['type']) => {
    switch (type) {
      case 'posture':
        return '🧍'
      case 'cosmetic':
        return '✨'
      case 'repair':
        return '🔧'
      case 'enhancement':
        return '🎨'
      default:
        return '📍'
    }
  }

  const getRegionColor = (type: EditRegion['type']) => {
    switch (type) {
      case 'posture':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cosmetic':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'repair':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'enhancement':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Edit Regions</h3>
          <p className="text-sm text-slate-600">Select areas to enhance</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          icon={<Plus className="h-3 w-3" />}
        >
          Add
        </Button>
      </div>

      {/* Add Region Form */}
      {showAddForm && (
        <div className="premium-card p-4 border-2 border-dashed border-blue-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Region Name
              </label>
              <input
                type="text"
                value={newRegionName}
                onChange={(e) => setNewRegionName(e.target.value)}
                placeholder="e.g., Left Shoulder"
                className="premium-input w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Region Type
              </label>
              <select
                value={newRegionType}
                onChange={(e) => setNewRegionType(e.target.value as EditRegion['type'])}
                className="premium-input w-full text-sm"
              >
                <option value="posture">Posture</option>
                <option value="cosmetic">Cosmetic</option>
                <option value="repair">Repair</option>
                <option value="enhancement">Enhancement</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddRegion} variant="gradient">
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Regions */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Quick Add</h4>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_REGIONS.map((preset, index) => {
            const isAlreadyAdded = regions.some(region => 
              region.name.toLowerCase() === preset.name.toLowerCase()
            )
            
            return (
              <button
                key={index}
                onClick={() => handlePresetRegionAdd(preset)}
                disabled={isAlreadyAdded}
                className={cn(
                  "text-left p-2 text-xs border rounded-lg transition-all duration-200 group",
                  isAlreadyAdded 
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                    : "bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                    {getRegionIcon(preset.type)}
                  </span>
                  <span className={cn(
                    "font-medium truncate",
                    isAlreadyAdded ? "text-slate-400" : "text-slate-700"
                  )}>
                    {preset.name}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Regions */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Selected ({regions.length})
          <span className="text-xs text-slate-500 font-normal ml-auto">Click to re-select</span>
        </h4>
        {regions.length === 0 ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              No regions selected
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add regions to start editing
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {regions.map((region) => (
              <div
                key={region.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group',
                  selectedRegion === region.id
                    ? 'border-blue-400 bg-blue-50 shadow-sm scale-[1.01]'
                    : 'border-slate-200 bg-white/50 hover:bg-white hover:border-blue-300 hover:shadow-sm',
                  pulseRegion === region.id && 'animate-pulse ring-2 ring-blue-300 ring-opacity-50',
                  getRegionColor(region.type)
                )}
                onClick={() => handleRegionClick(region.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'p-1.5 rounded-lg transition-all duration-200',
                    selectedRegion === region.id ? 'scale-110' : 'group-hover:scale-105'
                  )}>
                    <span className="text-lg">{getRegionIcon(region.type)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{region.name}</p>
                    <p className="text-xs text-slate-500 capitalize">
                      {region.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {selectedRegion === region.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Target className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRegionRemove(region.id)
                    }}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
