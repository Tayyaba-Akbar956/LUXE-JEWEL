'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function AISearchPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (file && file.type.match('image.*')) {
      setSelectedImage(URL.createObjectURL(file));
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Please drop an image file');
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Convert image to base64 if it's from a file
      let base64Image = selectedImage;

      // If it's a blob/object URL, we need to fetch and convert
      if (selectedImage.startsWith('blob:')) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      // 2. Call the AI Search API
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process AI search');
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to process image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-luxury-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl text-champagne-200 mb-2">Visual Search</h1>
          <p className="text-silver-500 mb-8">Find similar jewelry by uploading an image</p>

          <div className="card-luxury p-8 mb-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${previewUrl
                ? 'border-gold-500/30 bg-gold-500/5'
                : 'border-gold-500/30 hover:border-gold-500/50'
                }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-64 max-w-md mx-auto">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-lg text-champagne-200 mb-2">Upload an Image</h3>
                  <p className="text-silver-500 text-sm max-w-md">
                    Drag & drop an image here, or click to browse. Supported formats: JPG, PNG, WEBP.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSearch}
                disabled={isLoading || !selectedImage}
                className={`px-6 py-3 rounded-lg font-heading text-sm uppercase tracking-wider ${isLoading || !selectedImage
                  ? 'bg-silver-800 text-silver-500 cursor-not-allowed'
                  : 'bg-gold-500 text-luxury-black hover:bg-gold-400'
                  }`}
              >
                {isLoading ? 'Searching...' : 'Find Similar Items'}
              </button>

              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gold-500/30 text-silver-400 rounded-lg font-heading text-sm uppercase tracking-wider hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl text-champagne-200">Search Results</h2>
                <p className="text-silver-500">{results.length} items found</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {!results.length && selectedImage && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-gold-500/10 mb-4">
                <svg className="w-12 h-12 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-champagne-200 mb-2">No Results Yet</h3>
              <p className="text-silver-500 max-w-md mx-auto">
                Click "Find Similar Items" to search for jewelry similar to the image you uploaded.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}