"use client"

import { useState } from "react"
import VideoPlayer from "@/components/video-player"
import { Button } from "@/components/ui/button"

export default function TestPlayerPage() {
  const [showPlayer, setShowPlayer] = useState(false)
  const [testUrl, setTestUrl] = useState("")

  const handleTestPlayer = () => {
    setShowPlayer(true)
  }

  const handleClosePlayer = () => {
    setShowPlayer(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Teste do Video Player</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configurações de Teste</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">URL do Vídeo:</label>
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600"
              />
            </div>
            
            <Button 
              onClick={handleTestPlayer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
            >
              Testar Player
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">URLs de Teste</h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setTestUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")}
              className="w-full justify-start text-left"
            >
              Big Buck Bunny (MP4)
            </Button>
            <Button
              variant="outline"
              onClick={() => setTestUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4")}
              className="w-full justify-start text-left"
            >
              Elephants Dream (MP4)
            </Button>
            <Button
              variant="outline"
              onClick={() => setTestUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4")}
              className="w-full justify-start text-left"
            >
              For Bigger Blazes (MP4)
            </Button>
          </div>
        </div>
      </div>

      {showPlayer && (
        <VideoPlayer
          onClose={handleClosePlayer}
          title="Vídeo de Teste"
          videoUrl={testUrl || undefined}
        />
      )}
    </div>
  )
} 