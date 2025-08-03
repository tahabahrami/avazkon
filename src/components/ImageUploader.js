import React, { useCallback, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import SafeImage from './SafeImage';

const ImageUploader = forwardRef(({ onImageUpload, uploadedImage, onImageRemove }, ref) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      onImageUpload({ file, previewUrl });
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.bmp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleChangeImage = (e) => {
    e.stopPropagation();
    // Reset the input and trigger file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        onImageUpload({ file, previewUrl });
      }
    };
    input.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (onImageRemove) {
      onImageRemove();
    }
  };

  if (uploadedImage) {
    return (
      <motion.div 
        ref={ref}
        className="uploaded-image"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SafeImage 
          src={uploadedImage.previewUrl} 
          alt="Uploaded" 
          style={{ maxHeight: '300px', objectFit: 'contain' }}
          fallbackType="general"
        />
        <div className="image-overlay">
          <button 
            className="change-image-btn"
            onClick={handleChangeImage}
          >
            <ImageIcon size={16} />
            تغییر تصویر
          </button>
          <button 
            className="remove-image-btn"
            onClick={handleRemoveImage}
            title="حذف تصویر"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      {...getRootProps()}
      className={`image-uploader ${isDragActive ? 'drag-active' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input {...getInputProps()} />
      <motion.div
        className="upload-icon"
        animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Upload className="upload-icon-svg" />
      </motion.div>
      <div className="upload-text">
        {isDragActive ? 'تصویر خود را اینجا رها کنید' : 'تصویر خود را بارگذاری کنید'}
      </div>
      <div className="upload-hint">
        کشیده و رها کنید یا کلیک کنید • JPG, PNG, WebP تا ۱۰ مگابایت
      </div>
    </motion.div>
  );
});

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;