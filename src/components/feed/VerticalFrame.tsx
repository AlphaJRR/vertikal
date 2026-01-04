import { ReactNode } from 'react';

interface VerticalFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * VerticalFrame - Enforces 9:16 aspect ratio for vertical video content
 * This is the standard container for all vertical video content in VERTIKAL
 */
export const VerticalFrame = ({ children, className = '' }: VerticalFrameProps) => {
  return (
    <div
      className={`relative w-full h-screen bg-black ${className}`}
      style={{ aspectRatio: '9/16', minHeight: '100vh' }}
    >
      {children}
    </div>
  );
};

