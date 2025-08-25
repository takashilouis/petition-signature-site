'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import SignaturePadLib from 'signature_pad';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export interface SignaturePadRef {
  getPngData: () => string | null;
  clear: () => void;
  isEmpty: () => boolean;
}

interface SignaturePadProps {
  onSignatureChange?: (hasSignature: boolean) => void;
  className?: string;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onSignatureChange, className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePadLib | null>(null);

    useImperativeHandle(ref, () => ({
      getPngData: () => {
        if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
          return null;
        }
        return signaturePadRef.current.toDataURL('image/png');
      },
      clear: () => {
        signaturePadRef.current?.clear();
        onSignatureChange?.(false);
      },
      isEmpty: () => {
        return signaturePadRef.current?.isEmpty() ?? true;
      },
    }));

    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const signaturePad = new SignaturePadLib(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
        minWidth: 1,
        maxWidth: 2.5,
      });

      signaturePadRef.current = signaturePad;

      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        
        canvas.width = containerRect.width * ratio;
        canvas.height = containerRect.height * ratio;
        canvas.style.width = `${containerRect.width}px`;
        canvas.style.height = `${containerRect.height}px`;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(ratio, ratio);
        }
        
        signaturePad.clear();
      };

      resizeCanvas();

      const handleSignatureChange = () => {
        onSignatureChange?.(!signaturePad.isEmpty());
      };

      signaturePad.addEventListener('endStroke', handleSignatureChange);

      const resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(canvas.parentElement!);

      return () => {
        resizeObserver.disconnect();
        signaturePad.removeEventListener('endStroke', handleSignatureChange);
      };
    }, [onSignatureChange]);

    const handleClear = () => {
      signaturePadRef.current?.clear();
      onSignatureChange?.(false);
    };

    return (
      <div className={`relative ${className}`}>
        <div className="relative h-48 border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair touch-none"
            style={{ touchAction: 'none' }}
          />
          <div className="absolute bottom-2 right-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="bg-white/90 hover:bg-white"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Sign above using your mouse, finger, or stylus
        </p>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';