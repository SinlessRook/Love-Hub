"use client"

import type React from "react"
import { usePollinationsImage } from "@pollinations/react"
import { Heart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SoulmateImageProps {
  prompt: string
  seed: number
  onRegenerateImage?: () => void
}

const SoulmateImage: React.FC<SoulmateImageProps> = ({ prompt, seed, onRegenerateImage }) => {
  const imageUrl = usePollinationsImage(prompt, {
    width: 512,
    height: 512,
    seed: seed,
    model: "flux",
  })

  if (!prompt) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-16 h-16 text-white" />
          </div>
          <p className="text-white/60">Awaiting neural analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Your AI-generated soulmate"
            className="w-full h-full object-cover rounded-lg"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="text-sm font-medium">Neural Nectar Generated</p>
                <p className="text-xs text-white/80">Hyper-realistic AI portrait</p>
              </div>
              {onRegenerateImage && (
                <Button
                  size="sm"
                  onClick={onRegenerateImage}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/60">Generating your soulmate...</p>
            <p className="text-white/40 text-sm mt-1">Neural nectar processing</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SoulmateImage
