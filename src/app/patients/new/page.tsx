import Link from 'next/link'
import PatientForm from '@/components/PatientForm'

export default function NewPatientPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Novo Paciente
          </h1>
          <Link href="/" className="btn-secondary flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar</span>
          </Link>
        </div>
        <p className="text-gray-600">Preencha os dados do paciente abaixo</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Informações do Paciente</h2>
            <p className="text-sm text-gray-500">Os campos marcados com * são obrigatórios</p>
          </div>
          <PatientForm />
        </div>
      </div>
    </div>
  )
}
