'use client'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {title}
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            {message}
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Excluindo...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
