'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Patient } from '@/types'

interface PatientFormProps {
  patient?: Patient
  onSuccess?: () => void
}

export default function PatientForm({ patient, onSuccess }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    dateOfBirth: patient?.dateOfBirth 
      ? new Date(patient.dateOfBirth).toISOString().split('T')[0] 
      : '',
    phone: patient?.phone || ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const isEditing = !!patient

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])

    if (!formData.name.trim()) {
      setErrors(['Nome é obrigatório'])
      setIsSubmitting(false)
      return
    }

    try {
      const url = isEditing ? `/api/patients/${patient.id}` : '/api/patients'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          dateOfBirth: formData.dateOfBirth || null,
          phone: formData.phone.trim() || null,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else {
            router.push('/')
            setTimeout(() => router.refresh(), 100)
          }
        }, 800)
      } else {
        if (result.details) {
          setErrors(result.details)
        } else {
          setErrors([result.error || 'Erro ao salvar paciente'])
        }
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors(['Erro de conexão. Tente novamente.'])
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center animate-fade-in">
          <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="text-sm text-green-700 font-medium">
            {isEditing ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!'}
          </div>
        </div>
      )}
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-red-600">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="form-input mt-1"
          placeholder="Digite o nome completo"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          className="form-input mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="form-input mt-1"
          placeholder="(11) 99999-9999"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {success && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span>
            {success 
              ? 'Salvo!' 
              : isSubmitting 
                ? (isEditing ? 'Atualizando...' : 'Salvando...') 
                : (isEditing ? 'Atualizar Paciente' : 'Salvar Paciente')
            }
          </span>
        </button>
      </div>
    </form>
  )
}
