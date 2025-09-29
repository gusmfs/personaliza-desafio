import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, allQuery, runQuery } from '@/database/db'

export async function GET() {
  try {
    await initializeDatabase()
    
    const patients = await allQuery(`
      SELECT * FROM patients ORDER BY createdAt DESC
    `)

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

    return NextResponse.json(processedPatients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await initializeDatabase()

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const result = await runQuery(`
      INSERT INTO patients (name, dateOfBirth, phone, updatedAt) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      body.name.trim(),
      body.dateOfBirth || null,
      body.phone || null
    ])

    const newPatient = await allQuery(`
      SELECT * FROM patients WHERE id = ?
    `, [result.id])
    
    return NextResponse.json(newPatient[0], { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
