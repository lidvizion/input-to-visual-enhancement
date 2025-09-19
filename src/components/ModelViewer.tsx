'use client'

import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Group } from 'three'

interface ModelViewerProps {
  modelUrl?: string
  className?: string
}

function Model({ url }: { url: string }) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const { scene } = useGLTF(url)
  
  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-secondary-500">Loading 3D model...</p>
      </div>
    </div>
  )
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false)

  // Check if this is a demo URL or invalid URL
  const isDemoUrl = !modelUrl || hasError || 
    modelUrl.includes('demo_3d_model') || 
    modelUrl.includes('_enhanced.glb') ||
    !modelUrl.startsWith('/') ||
    modelUrl.endsWith('.glb') && !modelUrl.includes('/sample/')

  if (isDemoUrl) {
    return (
      <div className={`bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-slate-700 font-medium">3D Model Generated</p>
          <p className="text-sm text-slate-500 mt-1">
            Demo mode - 3D visualization would be available with real model files
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-secondary-100 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        onError={(error) => {
          console.error('Canvas error:', error)
          setHasError(true)
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model url={modelUrl} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
