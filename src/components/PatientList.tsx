'use client'

import Link from 'next/link'
import { Patient } from '@/types'

interface PatientListProps {
  patients: Patient[]
}

export default function PatientList({ patients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum paciente cadastrado</h3>
        <p className="text-gray-500 mb-6">Comece adicionando seu primeiro paciente ao sistema.</p>
        <Link href="/patients/new" className="btn-primary inline-flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Cadastrar Primeiro Paciente</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Data de Nascimento
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Anexos
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {patient.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {patient.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {patient.dateOfBirth 
                      ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')
                      : <span className="text-gray-400 italic">Não informado</span>
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {patient.phone || <span className="text-gray-400 italic">Não informado</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="badge-primary flex items-center space-x-1 w-fit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{patient.attachments?.length || 0}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    <span>Ver Detalhes</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="card p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{patient.name}</h3>
                  <span className="badge-primary text-xs">
                    {patient.attachments?.length || 0} anexo(s)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {patient.dateOfBirth 
                  ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')
                  : 'Não informado'
                }
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {patient.phone || 'Não informado'}
              </div>
            </div>
            
            <Link
              href={`/patients/${patient.id}`}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Ver Detalhes</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
