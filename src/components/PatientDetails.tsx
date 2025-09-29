'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Patient } from '@/types'
import PatientForm from './PatientForm'
import AttachmentUpload from './AttachmentUpload'
import AttachmentList from './AttachmentList'
import ConfirmModal from './ConfirmModal'

interface PatientDetailsProps {
  patient: Patient
}

export default function PatientDetails({ patient }: PatientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/')
      } else {
        alert('Erro ao excluir paciente')
      }
    } catch (error) {
      console.error('Error deleting patient:', error)
      alert('Erro ao excluir paciente')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    router.refresh()
  }

  if (isEditing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar Paciente</h1>
          <button
            onClick={() => setIsEditing(false)}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
        
        <div className="card p-6">
          <PatientForm 
            patient={patient} 
            onSuccess={handleEditSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">
                {patient.name.charAt(0).toUpperCase()}
              </span>
            </div>
            Detalhes do Paciente
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="btn-secondary flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Voltar</span>
            </Link>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editar</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Excluir</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600">Informações completas sobre o paciente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informações Pessoais
          </h2>
          
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4 border-blue-500">
              <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Nome</label>
              <p className="text-base font-semibold text-gray-900">{patient.name}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-transparent p-4 rounded-lg border-l-4 border-purple-500">
              <label className="block text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Data de Nascimento</label>
              <p className="text-base font-semibold text-gray-900">
                {patient.dateOfBirth 
                  ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')
                  : <span className="text-gray-400 italic font-normal">Não informado</span>
                }
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-transparent p-4 rounded-lg border-l-4 border-green-500">
              <label className="block text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Telefone</label>
              <p className="text-base font-semibold text-gray-900">
                {patient.phone || <span className="text-gray-400 italic font-normal">Não informado</span>}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium mr-1">Cadastrado em:</span>
                {new Date(patient.createdAt).toLocaleString('pt-BR')}
              </div>

              {patient.updatedAt && patient.updatedAt !== patient.createdAt && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium mr-1">Atualizado em:</span>
                  {new Date(patient.updatedAt).toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Anexos
            {patient.attachments && patient.attachments.length > 0 && (
              <span className="badge-primary ml-2">{patient.attachments.length}</span>
            )}
          </h2>
          
          <AttachmentUpload 
            patientId={patient.id} 
            onUploadSuccess={() => router.refresh()}
          />
          
          <div className="mt-6">
            <AttachmentList 
              attachments={patient.attachments} 
              onDeleteSuccess={() => router.refresh()}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o paciente "${patient.name}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
      />
    </div>
  )
}
