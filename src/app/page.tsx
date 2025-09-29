import Link from 'next/link'
import PatientList from '@/components/PatientList'
import { initializeDatabase, allQuery } from '@/database/db'

async function getPatients() {
  try {
    await initializeDatabase()
    
    const patients = await allQuery(`
      SELECT * FROM patients ORDER BY createdAt DESC
    `    )

    const processedPatients = []
    for (const patient of patients) {
      const attachments = await allQuery(`
        SELECT * FROM attachments WHERE patientId = ? ORDER BY createdAt DESC
      `, [patient.id])
      
      processedPatients.push({
        ...patient,
        attachments
      })
    }

    return processedPatients
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

export default async function Home() {
  const patients = await getPatients()
  
  const totalPatients = patients.length
  const totalAttachments = patients.reduce((sum, p) => sum + (p.attachments?.length || 0), 0)
  const recentPatients = patients.filter(p => {
    const createdDate = new Date(p.createdAt)
    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
               <span className="text-blue-600">DesafioPersonaliza</span>
            </h1>
            <p className="text-gray-600">
            </p>
          </div>
          <Link
            href="/patients/new"
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Paciente</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total de Pacientes</p>
              <p className="text-3xl font-bold">{totalPatients}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Novos esta Semana</p>
              <p className="text-3xl font-bold">{recentPatients}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total de Anexos</p>
              <p className="text-3xl font-bold">{totalAttachments}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lista de Pacientes
          </h2>
          {totalPatients > 0 && (
            <span className="badge-primary">
              {totalPatients} {totalPatients === 1 ? 'paciente' : 'pacientes'}
            </span>
          )}
        </div>
        <PatientList patients={patients} />
      </div>
    </div>
  )
}
