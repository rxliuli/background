import { useState } from 'react'
import { getBackgroundImage, setBackgroundImage, removeBackgroundImage } from '@/lib/storage'
import { renderBackgroundStyle, removeBackgroundStyle } from '@/lib/bg'
import { toast } from 'sonner'
import { Upload, X, ImageIcon } from 'lucide-react'
import { useMount } from '@/lib/hooks/useMount'

export function OptionsForm() {
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useMount(() => {
    getBackgroundImage().then((image) => {
      if (image) {
        setBackgroundImageState(image)
        renderBackgroundStyle(image)
      }
      setIsLoading(false)
    })
  })

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      await setBackgroundImage(dataUrl)
      setBackgroundImageState(dataUrl)
      renderBackgroundStyle(dataUrl)
      toast.success('Background image saved')
    }
    reader.onerror = () => {
      toast.error('Failed to read file')
    }
    reader.readAsDataURL(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      await handleFile(file)
    }
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
    e.target.value = ''
  }

  async function handleRemove() {
    await removeBackgroundImage()
    setBackgroundImageState(null)
    removeBackgroundStyle()
    toast.success('Background image removed')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Background Image</h1>
          <p className="text-sm text-muted-foreground">
            Set a background image for all websites
          </p>
        </div>

        {backgroundImage ? (
          <div className="relative">
            <img
              src={backgroundImage}
              alt="Background preview"
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '300px' }}
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white hover:bg-destructive/90"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              Drag and drop an image here, or click to select
            </p>
          </label>
        )}

        {backgroundImage && (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm hover:bg-accent">
            <ImageIcon className="h-4 w-4" />
            Change Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        )}
      </div>
    </div>
  )
}
