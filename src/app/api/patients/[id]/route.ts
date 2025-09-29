import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, getQuery, allQuery, runQuery } from '@/database/db'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await initializeDatabase()
    
    const patient = await getQuery(`
      SELECT * FROM patients WHERE id = ?
    `, [parseInt(params.id)])

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    const attachments = await allQuery(`
      SELECT * FROM attachments WHERE patientId = ? ORDER BY createdAt DESC
    `, [parseInt(params.id)])

    const patientWithAttachments = {
      ...patient,
      attachments
    }

    return NextResponse.json(patientWithAttachments)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    await initializeDatabase()

    const patient = await getQuery(`
      SELECT * FROM patients WHERE id = ?
    `, [parseInt(params.id)])

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    await runQuery(`
      UPDATE patients 
      SET name = ?, dateOfBirth = ?, phone = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.name.trim(),
      body.dateOfBirth || null,
      body.phone || null,
      parseInt(params.id)
    ])

    const updatedPatient = await getQuery(`
      SELECT * FROM patients WHERE id = ?
    `, [parseInt(params.id)])
    
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await initializeDatabase()

    const patient = await getQuery(`
      SELECT * FROM patients WHERE id = ?
    `, [parseInt(params.id)])

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    await runQuery(`DELETE FROM attachments WHERE patientId = ?`, [parseInt(params.id)])
    await runQuery(`DELETE FROM patients WHERE id = ?`, [parseInt(params.id)])
    
    return NextResponse.json({ message: 'Paciente excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
