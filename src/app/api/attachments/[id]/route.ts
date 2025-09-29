import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, getQuery, runQuery } from '@/database/db'
import { readFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await initializeDatabase()
    
    const attachment = await getQuery(`
      SELECT * FROM attachments WHERE id = ?
    `, [parseInt(params.id)])

    if (!attachment) {
      return NextResponse.json(
        { error: 'Anexo não encontrado' },
        { status: 404 }
      )
    }

    if (!existsSync(attachment.path)) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado no sistema' },
        { status: 404 }
      )
    }

    const fileBuffer = await readFile(attachment.path)
    
    const headers = new Headers()
    headers.set('Content-Type', attachment.mimeType)
    headers.set('Content-Disposition', `attachment; filename="${attachment.originalName}"`)
    headers.set('Content-Length', attachment.size.toString())

    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error downloading file:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await initializeDatabase()

    const attachment = await getQuery(`
      SELECT * FROM attachments WHERE id = ?
    `, [parseInt(params.id)])

    if (!attachment) {
      return NextResponse.json(
        { error: 'Anexo não encontrado' },
        { status: 404 }
      )
    }

    try {
      if (existsSync(attachment.path)) {
        await unlink(attachment.path)
      }
    } catch (fileError) {
      console.warn('Warning: Could not delete file from filesystem:', fileError)
    }

    await runQuery(`DELETE FROM attachments WHERE id = ?`, [parseInt(params.id)])
    
    return NextResponse.json({ message: 'Anexo excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting attachment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
