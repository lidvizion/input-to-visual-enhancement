import React from 'react'
import { cn } from '@/lib/utils'
import { BeforeAfterViewerProps } from '@/types'

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeImage,
  afterImage,
  sliderPosition = 50, // Default to 50% for fixed split
  onSliderChange,
  showOverlay = true,
}) => {

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="relative aspect-[4/3] group">
          {/* Before Image - Left Half */}
          <div className="absolute top-0 left-0 w-1/2 h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-full object-contain bg-slate-50"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlZm9yZSBJbWFnZTwvdGV4dD48L3N2Zz4=';
              }}
            />
            {showOverlay && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-sm">
                Before
              </div>
            )}
          </div>

          {/* After Image - Right Half */}
          <div className="absolute top-0 right-0 w-1/2 h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterImage}
              alt="After"
              className="w-full h-full object-contain bg-slate-50"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWZmNmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzA1NjNjYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFmdGVyIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
            {showOverlay && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-sm">
                After
              </div>
            )}
          </div>

          {/* Divider Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-white to-slate-200 shadow-2xl z-10 transform -translate-x-1/2">
          </div>
        </div>
      </div>

    </div>
  )
}
