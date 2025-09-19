import { ProcessingResult, UploadedFile } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_LV_API_URL || 'http://localhost:3000/api'

export class VisualEnhancementAPI {
  private apiKey: string
  private storageBucket: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_LV_API_KEY || ''
    this.storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || ''
  }

  async uploadFile(file: File): Promise<{ id: string; url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', this.storageBucket)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  }

  async processImage(
    fileId: string,
    edits: Array<{ region: string; effect: string; intensity: number }>
  ): Promise<ProcessingResult> {
    const response = await fetch(`${API_BASE_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        fileId,
        edits,
        options: {
          generate3D: true,
          includeReport: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Processing failed')
    }

    return response.json()
  }

  async downloadResult(url: string): Promise<Blob> {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Download failed')
    }

    return response.blob()
  }

  // Mock implementation for development
  async mockProcessImage(file: UploadedFile): Promise<ProcessingResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      before_after: {
        before: '/sample/before.png', // Hardcoded before image
        after: '/sample/after.png', // Hardcoded after image
      },
      edits: [
        { region: 'spine_upper', effect: 'straighten', intensity: 0.7, timestamp: new Date().toISOString() },
        { region: 'shoulders', effect: 'align', intensity: 0.5, timestamp: new Date().toISOString() },
      ],
      report: 'report_stub.pdf',
      artifact: 'enhanced_model.glb',
      metadata: {
        processing_time: '2.3s',
        confidence_score: 0.89,
        enhancement_type: 'posture_correction',
        timestamp: new Date().toISOString(),
      },
    }
  }
}

export const api = new VisualEnhancementAPI()
