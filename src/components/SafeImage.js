import React, { useState } from 'react';
import { Image as ImageIcon, User, FileImage } from 'lucide-react';

const SafeImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  fallbackType = 'general', // 'general', 'avatar', 'thumbnail'
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const getPlaceholderUrl = () => {
    switch (fallbackType) {
      case 'avatar':
        return 'https://picsum.photos/seed/avatar-placeholder/200/200';
      case 'thumbnail':
        return 'https://picsum.photos/seed/thumbnail-placeholder/400/300';
      case 'general':
      default:
        return 'https://picsum.photos/seed/image-placeholder/600/400';
    }
  };

  const getPlaceholderIcon = () => {
    switch (fallbackType) {
      case 'avatar':
        return <User size={24} />;
      case 'thumbnail':
        return <FileImage size={24} />;
      case 'general':
      default:
        return <ImageIcon size={24} />;
    }
  };

  if (hasError) {
    return (
      <div 
        className={`safe-image-placeholder ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#9ca3af',
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          minHeight: '100px',
          ...style
        }}
        {...props}
      >
        <div style={{ textAlign: 'center' }}>
          {getPlaceholderIcon()}
          <div style={{ fontSize: '12px', marginTop: '4px' }}>تصویر یافت نشد</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`safe-image-loading ${className}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            borderRadius: '8px',
            minHeight: '100px',
            ...style
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 8px'
            }}></div>
            <div style={{ fontSize: '12px' }}>در حال بارگذاری...</div>
          </div>
        </div>
      )}
      <img
        src={src || getPlaceholderUrl()}
        alt={alt}
        className={`safe-image ${className} ${isLoading ? 'loading' : ''}`}
        style={{
          ...style,
          display: isLoading ? 'none' : 'block'
        }}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
};

export default SafeImage;