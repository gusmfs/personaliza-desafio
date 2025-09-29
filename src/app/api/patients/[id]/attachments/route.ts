import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, getQuery, runQuery } from '@/database/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Apenas JPG, PNG e PDF são aceitos.' },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'patients', params.id)
    await mkdir(uploadDir, { recursive: true })

    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    const result = await runQuery(`
      INSERT INTO attachments (filename, originalName, mimeType, size, path, patientId)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      fileName,
      file.name,
      file.type,
      file.size,
      filePath,
      parseInt(params.id)
    ])

    const savedAttachment = await getQuery(`
      SELECT * FROM attachments WHERE id = ?
    `, [result.id])

    return NextResponse.json(savedAttachment, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
