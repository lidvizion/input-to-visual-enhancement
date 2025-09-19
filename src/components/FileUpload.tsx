import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, FileText, X, AlertTriangle } from 'lucide-react'
import { Button } from './ui/Button'
import { cn, formatFileSize } from '@/lib/utils'
import { UploadedFile } from '@/types'
import { validateFile, sanitizeFileName } from '@/lib/validations'
import { trackFileOperation, trackError } from '@/lib/monitoring'

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxFiles = 1,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Clear previous errors
    setError(null)

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      const errorMessage = rejection.errors[0]?.message || 'File rejected'
      setError(errorMessage)
      trackFileOperation('upload_rejected', rejection.file.type, rejection.file.size, false)
      return
    }

    acceptedFiles.forEach((file) => {
      // Validate file
      const validation = validateFile(file)
      if (!validation.success) {
        setError(validation.error || 'Invalid file')
        trackFileOperation('upload_validation_failed', file.type, file.size, false)
        return
      }

      try {
        // Sanitize filename
        const sanitizedName = sanitizeFileName(file.name)
        
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file: new File([file], sanitizedName, { type: file.type }),
          preview: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'photo' : 'scan',
          uploadedAt: new Date(),
        }
        
        setUploadedFiles(prev => [...prev, uploadedFile])
        onFileUpload(uploadedFile)
        trackFileOperation('upload_success', file.type, file.size, true)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        setError(errorMessage)
        trackError(error instanceof Error ? error : new Error(errorMessage), {
          component: 'FileUpload',
          action: 'onDrop',
          metadata: { fileName: file.name, fileSize: file.size, fileType: file.type }
        })
        trackFileOperation('upload_error', file.type, file.size, false)
      }
    })
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'premium-card border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 group',
          isDragActive
            ? 'border-blue-400 bg-blue-50/50 scale-105'
            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 hover:scale-[1.02]'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-6">
          <div className={cn(
            'p-4 rounded-2xl transition-all duration-300',
            isDragActive 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110' 
              : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 group-hover:scale-105'
          )}>
            <Upload className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-800">
              {isDragActive ? 'Drop files here' : 'Upload photos or scans'}
            </h3>
            <p className="text-slate-600 text-lg">
              Drag and drop files here, or click to select
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                JPG, PNG, WebP
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Max {maxFiles} file{maxFiles > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Up to 10MB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Upload Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="premium-card p-4 flex items-center justify-between group hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className={cn(
                      'p-3 rounded-xl transition-all duration-200',
                      file.type === 'photo' 
                        ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600' 
                        : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600'
                    )}
                    role="img"
                    aria-label={file.type === 'photo' ? 'Photo file icon' : 'Document file icon'}
                  >
                    {file.type === 'photo' ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <Image className="h-5 w-5" />
                    ) : (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <FileText className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {file.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{formatFileSize(file.file.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{file.type}</span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">Ready</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
