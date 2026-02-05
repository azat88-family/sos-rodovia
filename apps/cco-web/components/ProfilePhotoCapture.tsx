'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProfilePhotoCaptureProps {
  userId: string;
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
}

export default function ProfilePhotoCapture({ 
  userId, 
  currentPhotoUrl, 
  onPhotoUploaded 
}: ProfilePhotoCaptureProps) {
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Para a câmera quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Aguarda o vídeo carregar
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      
      setStream(mediaStream);
      setCapturing(true);
    } catch (error) {
      alert('❌ Erro ao acessar câmera!\n\nVerifique se:\n1. Você permitiu o acesso à câmera\n2. Nenhum outro programa está usando a câmera\n3. Está usando HTTPS ou localhost');
      console.error('Erro na câmera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCapturing(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      alert('Erro ao capturar foto!');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Proporção 3x4 (largura x altura)
    const aspectRatio = 3 / 4;
    const width = 300;
    const height = width / aspectRatio; // 400px

    canvas.width = width;
    canvas.height = height;

    // Calcula crop centralizado
    const videoRatio = video.videoWidth / video.videoHeight;
    let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

    if (videoRatio > aspectRatio) {
      // Vídeo mais largo, corta laterais
      sWidth = video.videoHeight * aspectRatio;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      // Vídeo mais alto, corta topo/base
      sHeight = video.videoWidth / aspectRatio;
      sy = (video.videoHeight - sHeight) / 2;
    }

    context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Erro ao processar imagem!');
        return;
      }

      setUploading(true);
      stopCamera();

      try {
        const fileName = `${userId}/${Date.now()}.jpg`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        onPhotoUploaded(data.publicUrl);
        alert('✅ Foto atualizada com sucesso!');
      } catch (error) {
        console.error('Erro no upload:', error);
        alert('❌ Erro ao fazer upload da foto!');
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="space-y-4">
      {/* Foto atual ou placeholder (proporção 3x4) */}
      {!capturing && (
        <div className="flex flex-col items-center">
          <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-200 border-4 border-gray-300 shadow-md">
            {currentPhotoUrl ? (
              <img 
                src={currentPhotoUrl} 
                alt="Foto do perfil" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                👤
              </div>
            )}
          </div>
          <button
            onClick={startCamera}
            disabled={uploading}
            className="mt-4 rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 shadow-md"
          >
            {uploading ? '⏳ Enviando...' : '📷 Atualizar Foto'}
          </button>
        </div>
      )}

      {/* Visualização da câmera (proporção 3x4) */}
      {capturing && (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-48 h-64 rounded-lg overflow-hidden border-4 border-blue-500 shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={capturePhoto}
              className="rounded bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition-colors shadow-md"
            >
              ✓ Capturar
            </button>
            <button
              onClick={stopCamera}
              className="rounded bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 transition-colors shadow-md"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
