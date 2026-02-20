'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ProfilePhotoCaptureProps {
  userId: string;
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
}

export default function ProfilePhotoCapture({
  userId,
  currentPhotoUrl,
  onPhotoUploaded,
}: ProfilePhotoCaptureProps) {
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Listeners de readiness do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setReady(true);

    video.addEventListener('canplay', onReady);
    video.addEventListener('play', onReady);

    return () => {
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('play', onReady);
    };
  }, [capturing]); // roda quando a câmera abre/fecha

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
    setReady(false);
    setCapturing(false);
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    setSuccess(false);
    setReady(false);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
          } catch {
            // autoplay bloqueado pelo browser — ignorado, canplay vai disparar
          }
          setReady(true);
        };
      }

      setStream(mediaStream);
      setCapturing(true);
    } catch {
      setError(
        'Não foi possível acessar a câmera. Verifique as permissões e tente novamente.'
      );
    }
  };

  const capturePhoto = async () => {
    setError(null);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('A câmera ainda não terminou de carregar. Tente novamente.');
      return;
    }

    // Proporção 3x4
    const aspectRatio = 3 / 4;
    const width = 300;
    const height = width / aspectRatio; // 400px

    canvas.width = width;
    canvas.height = height;

    const videoRatio = video.videoWidth / video.videoHeight;
    let sx = 0, sy = 0;
    let sWidth = video.videoWidth;
    let sHeight = video.videoHeight;

    if (videoRatio > aspectRatio) {
      sWidth = video.videoHeight * aspectRatio;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      sHeight = video.videoWidth / aspectRatio;
      sy = (video.videoHeight - sHeight) / 2;
    }

    context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError('Erro ao processar a imagem capturada.');
        return;
      }

      // Preview local imediato
      const objectUrl = URL.createObjectURL(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(objectUrl);

      setUploading(true);
      stopCamera();

      try {
        const fileName = `${userId}/${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        if (data?.publicUrl) {
          onPhotoUploaded(data.publicUrl);
          setSuccess(true);
        }
      } catch {
        setError('Erro ao fazer upload da foto. A pré-visualização foi mantida.');
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  const photoToShow = previewUrl ?? currentPhotoUrl;

  return (
    <div className="space-y-4">

      {error && (
        <div className="rounded bg-red-50 p-3 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-50 p-3 text-green-600 text-sm">
          ✅ Foto atualizada com sucesso!
        </div>
      )}

      {/* Foto atual / preview */}
      {!capturing && (
        <div className="flex flex-col items-center">
          <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-200 border-4 border-gray-300 shadow-md">
            {photoToShow ? (
              <img
                src={photoToShow}
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

      {/* Câmera */}
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
              disabled={!ready || uploading}
              className="rounded bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
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
