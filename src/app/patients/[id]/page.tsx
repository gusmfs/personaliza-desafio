import { notFound } from 'next/navigation'
import PatientDetails from '@/components/PatientDetails'

interface PatientPageProps {
  params: { id: string }
}

async function getPatient(id: number) {
  try {
    // Use direct database query instead of fetch to avoid URL issues
    const { initializeDatabase, getQuery, allQuery } = await import('@/database/db')
    
    await initializeDatabase()
    
    const patient = await getQuery(`
      SELECT * FROM patients WHERE id = ?
    `, [id])

    if (!patient) {
      return null
    }

    const attachments = await allQuery(`
      SELECT * FROM attachments WHERE patientId = ? ORDER BY createdAt DESC
    `, [id])

    return {
      ...patient,
      attachments
    }
  } catch (error) {
    console.error('Error fetching patient:', error)
    return null
  }
}

export default async function PatientPage({ params }: PatientPageProps) {
  const patientId = parseInt(params.id)
  
  if (isNaN(patientId)) {
    notFound()
  }

  const patient = await getPatient(patientId)

  if (!patient) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientDetails patient={patient} />
    </div>
  )
}
