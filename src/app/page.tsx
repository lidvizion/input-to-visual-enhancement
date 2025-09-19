'use client'

import React, { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { BeforeAfterViewer } from '@/components/BeforeAfterViewer'
import { RegionSelector } from '@/components/RegionSelector'
import { EffectSlider } from '@/components/EffectSlider'
import { ModelViewer } from '@/components/ModelViewer'
import { Button } from '@/components/ui/Button'
import { Download, Settings, Eye, EyeOff, RotateCcw, Box, History, Clock } from 'lucide-react'
import { UploadedFile, EditRegion, EditEffect, ProcessingResult } from '@/types'
import { api } from '@/lib/api'
import { generateId } from '@/lib/utils'

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [regions, setRegions] = useState<EditRegion[]>([])
  const [effects, setEffects] = useState<EditEffect[]>([])
  const [showControls, setShowControls] = useState(true)
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [processingHistory, setProcessingHistory] = useState<ProcessingResult[]>([])

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file)
    setProcessingResult(null)
    setSliderPosition(50)
    
    // Initialize default regions and effects
    const defaultRegions: EditRegion[] = [
      { id: generateId(), name: 'Spine (Upper)', type: 'posture' },
      { id: generateId(), name: 'Shoulders', type: 'posture' },
      { id: generateId(), name: 'Head Position', type: 'posture' },
    ]
    
    const defaultEffects: EditEffect[] = [
      { id: generateId(), name: 'Straighten', type: 'straighten', intensity: 0, min: -1, max: 1, step: 0.1 },
      { id: generateId(), name: 'Align', type: 'align', intensity: 0, min: -1, max: 1, step: 0.1 },
      { id: generateId(), name: 'Brightness', type: 'brightness', intensity: 0, min: -1, max: 1, step: 0.1 },
      { id: generateId(), name: 'Smoothness', type: 'smoothness', intensity: 0, min: 0, max: 1, step: 0.1 },
    ]
    
    setRegions(defaultRegions)
    setEffects(defaultEffects)
    setSelectedRegion(defaultRegions[0]?.id || null)
  }

  const handleProcessImage = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    try {
      const result = await api.mockProcessImage(uploadedFile)
      setProcessingResult(result)
      setProcessingHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
    } catch (error) {
      console.error('Processing failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRegionAdd = (regionData: Omit<EditRegion, 'id'>) => {
    const newRegion: EditRegion = {
      ...regionData,
      id: generateId(),
    }
    setRegions(prev => [...prev, newRegion])
    setSelectedRegion(newRegion.id)
  }

  const handleRegionRemove = (regionId: string) => {
    setRegions(prev => prev.filter(region => region.id !== regionId))
    // If the removed region was selected, clear the selection
    if (selectedRegion === regionId) {
      setSelectedRegion(null)
    }
  }

  const handleEffectChange = (effectId: string, value: number) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId ? { ...effect, intensity: value } : effect
    ))
  }

  const handleExport = async (format: 'jpg' | 'png' | 'glb' | 'pdf') => {
    if (!processingResult) return
    
    try {
      if (format === 'jpg' || format === 'png') {
        // Create a download link for the after image
        const link = document.createElement('a')
        link.href = processingResult.before_after.after
        link.download = `enhanced_image.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (format === 'glb') {
        // For 3D model, show a message since we don't have the actual file
        alert('3D model export would be available with a real 3D model file.')
      } else if (format === 'pdf') {
        // For PDF report, show a message since we don't have the actual report
        alert('PDF report export would be available with a real report generation system.')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg floating-animation">
                <span className="text-white font-bold text-lg">VE</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-blue">
                  Visual Enhancement
                </h1>
                <p className="text-sm text-slate-600">Transform your images with AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                icon={<History className="h-4 w-4" />}
              >
                History ({processingHistory.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadedFile(null)
                  setProcessingResult(null)
                  setRegions([])
                  setEffects([])
                  setSliderPosition(50)
                }}
                icon={<RotateCcw className="h-4 w-4" />}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {!uploadedFile ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 fade-in-up">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Transform Your Images with
                <span className="text-gradient-blue block">AI-Powered Enhancement</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload photos or scans to simulate visual enhancements like posture correction, 
                cosmetic improvements, or product repairs.
              </p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Demo Mode:</span> This application uses demonstration images to showcase the before/after comparison feature.
                </p>
              </div>
            </div>
            
            <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

            {/* Features Preview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="premium-card p-5 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Enhancement</h3>
                <p className="text-sm text-slate-600">AI-powered algorithms analyze and enhance your images</p>
              </div>
              
              <div className="premium-card p-5 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Box className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">3D Visualization</h3>
                <p className="text-sm text-slate-600">Generate 3D models and immersive visualizations</p>
              </div>
              
              <div className="premium-card p-5 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Multiple Formats</h3>
                <p className="text-sm text-slate-600">Export in various formats and detailed reports</p>
              </div>
            </div>
          </div>
        ) : (
          /* Main Editor */
          <div className="space-y-4">
            {/* Top Controls Bar */}
            <div className="premium-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Before & After Comparison
                  </h2>
                  <p className="text-sm text-slate-600">Drag the slider to compare original and enhanced images</p>
                  <p className="text-xs text-blue-600 mt-1">📋 Using demo images for demonstration</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="gradient"
                    size="md"
                    onClick={handleProcessImage}
                    loading={isProcessing}
                    disabled={!uploadedFile}
                    icon={<Settings className="h-4 w-4" />}
                  >
                    {isProcessing ? 'Processing...' : 'Process Image'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Image Viewer */}
              <div className="lg:col-span-2">
                <div className="premium-card p-6">

                  {processingResult ? (
                    <BeforeAfterViewer
                      beforeImage={processingResult.before_after.before}
                      afterImage={processingResult.before_after.after}
                      sliderPosition={sliderPosition}
                      onSliderChange={setSliderPosition}
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 pulse-glow">
                          <Settings className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          Ready to Process
                        </h3>
                        <p className="text-sm text-slate-500">
                          Click "Process Image" to see the before/after comparison
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3D Model Viewer */}
                  {processingResult && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            3D Model Viewer
                          </h3>
                          <p className="text-sm text-slate-600">Interactive 3D visualization</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!processingResult.artifact && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                // Generate 3D model with options
                                try {
                                  const edits = effects.map(effect => ({
                                    region: selectedRegion || 'default',
                                    effect: effect.type,
                                    intensity: effect.intensity
                                  }))
                                  
                                  const result = await api.processImage(uploadedFile!.id, edits)
                                  setProcessingResult(result)
                                  setProcessingHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
                                  setShow3DViewer(true)
                                } catch (error) {
                                  console.error('3D generation failed:', error)
                                  // Fallback to mock if real API fails
                                  const result = await api.mockProcessImage(uploadedFile!)
                                  setProcessingResult(result)
                                  setProcessingHistory(prev => [result, ...prev.slice(0, 9)])
                                  setShow3DViewer(true)
                                }
                              }}
                              icon={<Box className="h-4 w-4" />}
                            >
                              Generate 3D
                            </Button>
                          )}
                          {processingResult.artifact && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShow3DViewer(!show3DViewer)}
                              icon={<Box className="h-4 w-4" />}
                            >
                              {show3DViewer ? 'Hide' : 'Show'} 3D
                            </Button>
                          )}
                        </div>
                      </div>
                      {show3DViewer && processingResult.artifact && (
                        <div className="rounded-xl overflow-hidden shadow-lg">
                          <ModelViewer
                            modelUrl={processingResult.artifact}
                            className="h-64"
                          />
                        </div>
                      )}
                      {show3DViewer && !processingResult.artifact && (
                        <div className="rounded-xl bg-slate-100 h-64 flex items-center justify-center">
                          <div className="text-center">
                            <Box className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600">Click "Generate 3D" to create a 3D model</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Export Options */}
                  {processingResult && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                          Export Results
                        </h3>
                        <p className="text-sm text-slate-600">Download in various formats</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleExport('jpg')}
                          icon={<Download className="h-4 w-4" />}
                          className="flex-col h-16 gap-1"
                        >
                          <span className="text-sm font-medium">JPG</span>
                          <span className="text-xs text-slate-500">High Quality</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleExport('png')}
                          icon={<Download className="h-4 w-4" />}
                          className="flex-col h-16 gap-1"
                        >
                          <span className="text-sm font-medium">PNG</span>
                          <span className="text-xs text-slate-500">Lossless</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleExport('glb')}
                          icon={<Box className="h-4 w-4" />}
                          className="flex-col h-16 gap-1"
                        >
                          <span className="text-sm font-medium">3D Model</span>
                          <span className="text-xs text-slate-500">GLB Format</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleExport('pdf')}
                          icon={<Download className="h-4 w-4" />}
                          className="flex-col h-16 gap-1"
                        >
                          <span className="text-sm font-medium">Report</span>
                          <span className="text-xs text-slate-500">PDF Document</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Effect Controls - Moved here for better accessibility */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        Effect Controls
                      </h3>
                      <p className="text-sm text-slate-600">Fine-tune parameters</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {effects.map((effect) => (
                        <EffectSlider
                          key={effect.id}
                          effect={effect}
                          value={effect.intensity}
                          onChange={(value) => handleEffectChange(effect.id, value)}
                          disabled={false}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* History Panel */}
              {showHistory && (
                <div className="lg:col-span-1 space-y-3">
                  <div className="premium-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Processing History
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(false)}
                        icon={<EyeOff className="h-4 w-4" />}
                      >
                        Close
                      </Button>
                    </div>
                    
                    {processingHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No processing history yet</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Process images to see them here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {processingHistory.map((result, index) => (
                          <div
                            key={index}
                            className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => setProcessingResult(result)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">
                                Processing #{processingHistory.length - index}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(result.metadata.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600">
                              <div className="flex items-center justify-between">
                                <span>Confidence: {(result.metadata.confidence_score * 100).toFixed(0)}%</span>
                                <span>{result.metadata.processing_time}</span>
                              </div>
                              <div className="mt-1">
                                {result.edits.length} edit{result.edits.length !== 1 ? 's' : ''} applied
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Edit Regions - Show below history when history is open */}
                  <div className="premium-card p-4">
                    <RegionSelector
                      regions={regions}
                      selectedRegion={selectedRegion}
                      onRegionSelect={setSelectedRegion}
                      onRegionAdd={handleRegionAdd}
                      onRegionRemove={handleRegionRemove}
                    />
                  </div>
                </div>
              )}

              {/* Controls Panel - Only show when history is closed */}
              {showControls && !showHistory && (
                <div className="lg:col-span-1 space-y-3">
                  {/* Region Selector */}
                  <div className="premium-card p-4">
                    <RegionSelector
                      regions={regions}
                      selectedRegion={selectedRegion}
                      onRegionSelect={setSelectedRegion}
                      onRegionAdd={handleRegionAdd}
                      onRegionRemove={handleRegionRemove}
                    />
                  </div>

                  {/* Processing Info */}
                  {processingResult && (
                    <div className="premium-card p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                          Processing Analytics
                        </h3>
                        <p className="text-sm text-slate-600">Processing information</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Settings className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">Processing Time</p>
                              <p className="text-xs text-slate-600">Duration</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            {processingResult.metadata.processing_time}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">Confidence</p>
                              <p className="text-xs text-slate-600">AI accuracy</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            {Math.round(processingResult.metadata.confidence_score * 100)}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Box className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">Type</p>
                              <p className="text-xs text-slate-600">Technique</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-purple-600 capitalize">
                            {processingResult.metadata.enhancement_type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
