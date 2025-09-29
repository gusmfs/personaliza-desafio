'use client'

import { useState, ChangeEvent } from 'react'

interface AttachmentUploadProps {
  patientId: number
  onUploadSuccess: () => void
}

export default function AttachmentUpload({ patientId, onUploadSuccess }: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Apenas JPG, PNG e PDF são aceitos.')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Arquivo muito grande. Tamanho máximo: 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/patients/${patientId}/attachments`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        onUploadSuccess()
      } else {
        const result = await response.json()
        alert(result.error || 'Erro ao fazer upload do arquivo')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload de Anexos</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="text-sm text-gray-600">Fazendo upload...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">
                Arraste e solte um arquivo aqui, ou
              </p>
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-800 font-medium">
                  clique para selecionar
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            
            <p className="text-xs text-gray-500">
              Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
