'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadPaymentScreenshot } from '@/lib/api'

interface ScreenshotUploaderProps {
  batchDetailId: string
  onUploadComplete: (screenshotUrl: string) => void
}

export function ScreenshotUploader({ batchDetailId, onUploadComplete }: ScreenshotUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const screenshotUrl = await uploadPaymentScreenshot(batchDetailId, file)
      onUploadComplete(screenshotUrl)
    } catch (error) {
      console.error('Failed to upload screenshot:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
}

