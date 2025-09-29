export interface Patient {
  id: number
  name: string
  dateOfBirth: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: number
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  patientId: number
  createdAt: string
}
