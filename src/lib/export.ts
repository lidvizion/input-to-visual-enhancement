import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ProcessingResult, ExportOptions } from '@/types'

export class ExportManager {
  static async exportImage(
    canvas: HTMLCanvasElement,
    format: 'jpg' | 'png',
    quality: number = 0.9
  ): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
        },
        `image/${format}`,
        quality
      )
    })
  }

  static async exportPDF(
    result: ProcessingResult,
    options: Partial<ExportOptions> = {}
  ): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20

    // Title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Visual Enhancement Report', margin, 30)

    // Processing info
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Processing Time: ${result.metadata.processing_time}`, margin, 50)
    pdf.text(`Confidence Score: ${Math.round(result.metadata.confidence_score * 100)}%`, margin, 60)
    pdf.text(`Enhancement Type: ${result.metadata.enhancement_type}`, margin, 70)
    pdf.text(`Generated: ${new Date(result.metadata.timestamp).toLocaleString()}`, margin, 80)

    // Edits summary
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Applied Edits:', margin, 100)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    result.edits.forEach((edit, index) => {
      const y = 110 + (index * 10)
      pdf.text(
        `• ${edit.region}: ${edit.effect} (${Math.round(edit.intensity * 100)}%)`,
        margin,
        y
      )
    })

    // Add images if available
    if (result.before_after.before && result.before_after.after) {
      try {
        // Create a temporary canvas for before/after comparison
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 400
          canvas.height = 300

          // Draw before image
          const beforeImg = new Image()
          beforeImg.onload = () => {
            ctx.drawImage(beforeImg, 0, 0, 200, 300)
            
            // Draw after image
            const afterImg = new Image()
            afterImg.onload = () => {
              ctx.drawImage(afterImg, 200, 0, 200, 300)
              
              // Add to PDF
              const imgData = canvas.toDataURL('image/jpeg', 0.8)
              pdf.addImage(imgData, 'JPEG', margin, 150, pageWidth - 2 * margin, 60)
              
              // Add labels
              pdf.setFontSize(10)
              pdf.text('Before', margin + 10, 220)
              pdf.text('After', margin + 210, 220)
            }
            afterImg.src = result.before_after.after
          }
          beforeImg.src = result.before_after.before
        }
      } catch (error) {
        console.error('Error adding images to PDF:', error)
      }
    }

    return pdf.output('blob')
  }

  static async exportGLB(url: string): Promise<Blob> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch GLB file')
    }
    return response.blob()
  }

  static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static async captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
    return html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })
  }
}
