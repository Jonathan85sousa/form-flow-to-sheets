
import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
  signature: string;
  onSignatureChange: (signature: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  signature,
  onSignatureChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Restaurar assinatura se existir
    if (signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      };
      img.src = signature;
    }
  }, [signature]);

  const getPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPosition(event);
    setLastPos(pos);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastPos(pos);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Salvar assinatura
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      onSignatureChange(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    onSignatureChange('');
  };

  return (
    <div className="space-y-3">
      <Card className="p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          className="w-full h-48 border-2 border-dashed border-gray-300 bg-white rounded cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDrawing();
          }}
        />
        
        <div className="flex justify-center mt-3">
          <Button
            type="button"
            onClick={clearSignature}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar Assinatura
          </Button>
        </div>
      </Card>
      
      <p className="text-sm text-gray-600 text-center">
        Use o mouse ou toque na tela para assinar
      </p>
    </div>
  );
};

export default SignatureCanvas;
