'use client'

import { useState } from 'react'
import { Attachment } from '@/types'
import ConfirmModal from './ConfirmModal'

interface AttachmentListProps {
  attachments: Attachment[]
  onDeleteSuccess: () => void
}

export default function AttachmentList({ attachments, onDeleteSuccess }: AttachmentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null)

  const handleDeleteClick = (attachment: Attachment) => {
    setSelectedAttachment(attachment)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedAttachment) return

    setDeletingId(selectedAttachment.id)

    try {
      const response = await fetch(`/api/attachments/${selectedAttachment.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDeleteSuccess()
      } else {
        alert('Erro ao excluir anexo')
      }
    } catch (error) {
      console.error('Error deleting attachment:', error)
      alert('Erro ao excluir anexo')
    } finally {
      setDeletingId(null)
      setShowDeleteModal(false)
      setSelectedAttachment(null)
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return (
        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    } else if (mimeType === 'application/pdf') {
      return (
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
    
    return (
      <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>Nenhum anexo adicionado ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Anexos ({attachments.length})</h3>
      
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(attachment.mimeType)}
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)} • {new Date(attachment.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <a
                href={`/api/attachments/${attachment.id}`}
                download
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Baixar
              </a>
              
              {attachment.mimeType.startsWith('image/') && (
                <button
                  onClick={() => window.open(`/api/attachments/${attachment.id}`, '_blank')}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Visualizar
                </button>
              )}
              
              <button
                onClick={() => handleDeleteClick(attachment)}
                disabled={deletingId === attachment.id}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {deletingId === attachment.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedAttachment(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o anexo "${selectedAttachment?.originalName}"? Esta ação não pode ser desfeita.`}
        isLoading={deletingId === selectedAttachment?.id}
      />
    </div>
  )
}
