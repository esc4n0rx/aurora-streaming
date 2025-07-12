"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles,
} from "lucide-react"

interface VideoPlayerProps {
  onClose: () => void
  title: string
}

export default function VideoPlayer({ onClose, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showSettings, setShowSettings] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Sample video URL - using a public domain video
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Number.parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime += seconds
  }

  const toggleFullscreen = () => {
    const player = playerRef.current
    if (!player) return

    if (!isFullscreen) {
      player.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div
      ref={playerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 p-2 rounded-full">
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-white text-xl font-semibold">{title}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <Subtitles className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-6 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Play className="w-12 h-12" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-white text-sm mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => skip(-10)}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button onClick={togglePlay} variant="ghost" className="text-white hover:bg-white/20 p-3 rounded-full">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <Button
                onClick={() => skip(10)}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button onClick={toggleMute} variant="ghost" className="text-white hover:bg-white/20 p-2 rounded-full">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">4K</div>
              <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">HDR</div>
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute bottom-20 right-6 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 min-w-48">
            <h3 className="text-white font-semibold mb-3">Configurações</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm">Qualidade</label>
                <select className="w-full bg-gray-800 text-white rounded p-2 mt-1">
                  <option>4K (2160p)</option>
                  <option>HD (1080p)</option>
                  <option>HD (720p)</option>
                  <option>SD (480p)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Legendas</label>
                <select className="w-full bg-gray-800 text-white rounded p-2 mt-1">
                  <option>Desativado</option>
                  <option>Português</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Velocidade</label>
                <select className="w-full bg-gray-800 text-white rounded p-2 mt-1">
                  <option>0.5x</option>
                  <option>0.75x</option>
                  <option selected>1x</option>
                  <option>1.25x</option>
                  <option>1.5x</option>
                  <option>2x</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #007AFF;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #007AFF;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
