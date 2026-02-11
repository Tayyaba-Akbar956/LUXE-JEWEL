'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  featuredImage: string;
}

export default function ImageGallery({ images, featuredImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(featuredImage);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div 
        className="relative aspect-square rounded-lg overflow-hidden border border-gold-500/20 cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={selectedImage}
          alt="Product image"
          fill
          className="object-cover"
          priority
        />
        
        {/* Zoom Overlay */}
        {isZoomed && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl h-96">
              <Image
                src={selectedImage}
                alt="Product image zoomed"
                fill
                className="object-contain"
                style={{
                  transform: `scale(2) translate(${-(zoomPosition.x - 50)}%, ${-(zoomPosition.y - 50)}%)`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div 
              key={i}
              className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                selectedImage === img 
                  ? 'border-gold-500 ring-2 ring-gold-500/30' 
                  : 'border-gold-500/20 hover:border-gold-500/50'
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <Image 
                src={img} 
                alt={`Product image ${i + 1}`} 
                fill 
                className="object-cover" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}