import { fal } from '@fal-ai/client';
import { smartTranslatePrompt } from './translateService';

// Configure fal.ai client
fal.config({
  credentials: process.env.REACT_APP_FAL_KEY || 'your-api-key-here'
});

// Mock mode for development/demo
const MOCK_MODE = !process.env.REACT_APP_FAL_KEY || process.env.REACT_APP_FAL_KEY === 'your-api-key-here';

// Mock response generator
const generateMockResponse = async (delay = 2000) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return {
    images: [{
      url: 'https://picsum.photos/512/512?random=' + Math.random(),
      width: 512,
      height: 512
    }]
  };
};

// Constants for file validation and compression
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 2048;
const COMPRESSION_QUALITY_LEVELS = [0.9, 0.8, 0.7, 0.6, 0.5];
const TARGET_SIZE_THRESHOLD = 5 * 1024 * 1024; // 5MB target for data URI fallback

/**
 * Validate image file size and format
 * @param {File} file - The image file to validate
 * @throws {Error} If file is invalid
 */
const validateImageFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

/**
 * Progressive image compression with multiple quality levels
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} targetSize - Target file size in bytes
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<File>} Compressed image file
 */
const compressImageProgressive = (file, maxWidth = MAX_DIMENSION, maxHeight = MAX_DIMENSION, targetSize = TARGET_SIZE_THRESHOLD, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = async () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels progressively
        for (let i = 0; i < COMPRESSION_QUALITY_LEVELS.length; i++) {
          const quality = COMPRESSION_QUALITY_LEVELS[i];
          
          if (onProgress) {
            onProgress({
              stage: 'compressing',
              attempt: i + 1,
              totalAttempts: COMPRESSION_QUALITY_LEVELS.length,
              quality: quality
            });
          }
          
          const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', quality);
          });
          
          if (blob && (blob.size <= targetSize || i === COMPRESSION_QUALITY_LEVELS.length - 1)) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            if (onProgress) {
              onProgress({
                stage: 'completed',
                originalSize: file.size,
                compressedSize: compressedFile.size,
                compressionRatio: ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
              });
            }
            
            resolve(compressedFile);
            return;
          }
        }
        
        reject(new Error('Unable to compress image to target size'));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload image to fal.ai storage with progress tracking
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} The uploaded file URL
 */
const uploadImageToStorage = async (file, onProgress = null) => {
  try {
    if (onProgress) {
      onProgress({ stage: 'uploading', message: 'Uploading to fal.ai storage...' });
    }
    
    const url = await fal.storage.upload(file);
    
    if (onProgress) {
      onProgress({ stage: 'upload_completed', url });
    }
    
    return url;
  } catch (error) {
    console.error('Error uploading to fal.ai storage:', error);
    throw new Error('Failed to upload image to storage');
  }
};

/**
 * Convert file to base64 data URI for API submission
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} Base64 data URI
 */
const fileToDataUri = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Process dual images using fal.ai FLUX.1 Kontext Multi API
 * @param {Array<File>} imageFiles - Array of two image files to process
 * @param {string} prompt - The prompt describing what to create
 * @param {Object} parameters - Processing parameters
 * @param {Function} onProgress - Progress callback for user feedback
 * @returns {Promise<Object>} - The processed image result
 */
export const processImage = async (imageFiles, prompt, parameters, onProgress = null) => {
  try {
    if (!Array.isArray(imageFiles) || imageFiles.length !== 2) {
      throw new Error('Exactly two images are required');
    }

    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt is required');
    }

    // Extract the actual files from the uploaded image objects
    const actualFiles = imageFiles.map(imageFile => imageFile.file || imageFile);
    
    // Validate all files
    if (onProgress) onProgress({ stage: 'validating', message: 'Validating image files...' });
    actualFiles.forEach((file, index) => {
      try {
        validateImageFile(file);
      } catch (error) {
        throw new Error(`Image ${index + 1}: ${error.message}`);
      }
    });

    // Translate Persian prompt to English if needed
    if (onProgress) onProgress({ stage: 'translating', message: 'Processing prompt...' });
    console.log('Original prompt:', prompt);
    const translationResult = await smartTranslatePrompt(prompt);
    const finalPrompt = translationResult.translatedPrompt;
    
    if (translationResult.wasTranslated) {
      console.log('Translated prompt from Persian to English:', finalPrompt);
    }

    // Process images with progressive compression and upload to storage
    const imageUrls = [];
    
    for (let i = 0; i < actualFiles.length; i++) {
      const file = actualFiles[i];
      
      if (onProgress) {
        onProgress({ 
          stage: 'processing_image', 
          message: `Processing image ${i + 1} of ${actualFiles.length}...`,
          currentImage: i + 1,
          totalImages: actualFiles.length
        });
      }
      
      try {
        // Compress image progressively
        const compressedFile = await compressImageProgressive(
          file, 
          MAX_DIMENSION, 
          MAX_DIMENSION, 
          TARGET_SIZE_THRESHOLD,
          (progress) => {
            if (onProgress) {
              onProgress({
                stage: 'compressing',
                message: `Compressing image ${i + 1}...`,
                ...progress
              });
            }
          }
        );
        
        // Upload to fal.ai storage
        const imageUrl = await uploadImageToStorage(compressedFile, (progress) => {
          if (onProgress) {
            onProgress({
              stage: 'uploading',
              message: `Uploading image ${i + 1}...`,
              ...progress
            });
          }
        });
        
        imageUrls.push(imageUrl);
        console.log(`Image ${i + 1} uploaded successfully: ${imageUrl}`);
        
      } catch (error) {
        console.warn(`Failed to upload image ${i + 1} to storage, falling back to data URI:`, error);
        
        // Fallback to data URI for smaller files
        const compressedFile = await compressImageProgressive(file, 1024, 1024, 2 * 1024 * 1024); // 2MB limit for data URI
        const dataUri = await fileToDataUri(compressedFile);
        imageUrls.push(dataUri);
      }
    }
    
    // Prepare the input for the API
    const input = {
      prompt: finalPrompt,
      image_urls: imageUrls,
      guidance_scale: parameters.guidance_scale || 3.5,
      num_inference_steps: parameters.num_inference_steps || 28,
      output_format: parameters.output_format || 'jpeg',
      safety_tolerance: parameters.safety_tolerance || '2',
      ...(parameters.seed && { seed: parameters.seed })
    };

    if (onProgress) onProgress({ stage: 'generating', message: 'Generating image...' });

    // Call the fal.ai API
    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max/multi', {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS' && onProgress) {
          onProgress({ stage: 'generating', message: 'Processing...', ...update });
        }
        console.log('Processing update:', update);
      },
    });

    if (onProgress) onProgress({ stage: 'completed', message: 'Image generation completed!' });
    return result.data;
    
  } catch (error) {
    console.error('Error processing images:', error);
    if (onProgress) onProgress({ stage: 'error', message: error.message });
    throw new Error(error.message || 'Failed to process images');
  }
};

/**
 * Process single image using fal.ai FLUX.1 Kontext Max API
 * @param {File} imageFile - The image file to process
 * @param {string} prompt - The prompt describing how to edit the image
 * @param {Object} parameters - Processing parameters
 * @param {Function} onProgress - Progress callback for user feedback
 * @returns {Promise<Object>} - The processed image result
 */
export const processSingleImage = async (imageFile, prompt, parameters, onProgress = null) => {
  try {
    if (!imageFile) {
      throw new Error('Image file is required');
    }

    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt is required');
    }

    // Extract the actual file from the uploaded image object
    const actualFile = imageFile.file || imageFile;
    
    // Validate file
    if (onProgress) onProgress({ stage: 'validating', message: 'Validating image file...' });
    validateImageFile(actualFile);

    // Translate Persian prompt to English if needed
    if (onProgress) onProgress({ stage: 'translating', message: 'Processing prompt...' });
    console.log('Original prompt:', prompt);
    const translationResult = await smartTranslatePrompt(prompt);
    const finalPrompt = translationResult.translatedPrompt;
    
    if (translationResult.wasTranslated) {
      console.log('Translated prompt from Persian to English:', finalPrompt);
    }

    let imageUrl;
    
    try {
      // Compress image progressively
      if (onProgress) onProgress({ stage: 'processing_image', message: 'Processing image...' });
      
      const compressedFile = await compressImageProgressive(
        actualFile, 
        MAX_DIMENSION, 
        MAX_DIMENSION, 
        TARGET_SIZE_THRESHOLD,
        (progress) => {
          if (onProgress) {
            onProgress({
              stage: 'compressing',
              message: 'Compressing image...',
              ...progress
            });
          }
        }
      );
      
      // Upload to fal.ai storage
      imageUrl = await uploadImageToStorage(compressedFile, (progress) => {
        if (onProgress) {
          onProgress({
            stage: 'uploading',
            message: 'Uploading image...',
            ...progress
          });
        }
      });
      
      console.log('Image uploaded successfully:', imageUrl);
      
    } catch (error) {
      console.warn('Failed to upload image to storage, falling back to data URI:', error);
      
      // Fallback to data URI for smaller files
      const compressedFile = await compressImageProgressive(actualFile, 1024, 1024, 2 * 1024 * 1024); // 2MB limit for data URI
      imageUrl = await fileToDataUri(compressedFile);
    }
    
    // Prepare the input for the API
    const input = {
      prompt: finalPrompt,
      image_url: imageUrl,
      guidance_scale: parameters.guidance_scale || 3.5,
      num_inference_steps: parameters.num_inference_steps || 28,
      output_format: parameters.output_format || 'jpeg',
      safety_tolerance: parameters.safety_tolerance || '2',
      aspect_ratio: parameters.aspect_ratio || '1:1',
      ...(parameters.seed && { seed: parameters.seed })
    };

    if (onProgress) onProgress({ stage: 'generating', message: 'Generating image...' });

    let result;
    if (MOCK_MODE) {
      console.log('Running in mock mode - generating mock response');
      // Simulate progress updates
      if (onProgress) {
        setTimeout(() => onProgress({ stage: 'generating', message: 'Processing...', status: 'IN_PROGRESS' }), 500);
        setTimeout(() => onProgress({ stage: 'generating', message: 'Almost done...', status: 'IN_PROGRESS' }), 1500);
      }
      const mockData = await generateMockResponse();
      result = { data: mockData };
    } else {
      // Call the fal.ai API
      result = await fal.subscribe('fal-ai/flux-pro/kontext/max', {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && onProgress) {
            onProgress({ stage: 'generating', message: 'Processing...', ...update });
          }
          console.log('Processing update:', update);
        },
      });
    }

    if (onProgress) onProgress({ stage: 'completed', message: 'Image generation completed!' });
    return result.data;
    
  } catch (error) {
    console.error('Error processing image:', error);
    if (onProgress) onProgress({ stage: 'error', message: error.message });
    throw new Error(error.message || 'Failed to process image');
  }
};

/**
 * Process single image using fal.ai FLUX.1 Kontext Pro API (cheaper/faster version)
 * @param {File} imageFile - The image file to process
 * @param {string} prompt - The prompt describing how to edit the image
 * @param {Object} parameters - Processing parameters
 * @param {Function} onProgress - Progress callback for user feedback
 * @returns {Promise<Object>} - The processed image result
 */
export const processSingleImageFast = async (imageFile, prompt, parameters, onProgress = null) => {
  try {
    if (!imageFile) {
      throw new Error('Image file is required');
    }

    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt is required');
    }

    // Extract the actual file from the uploaded image object
    const actualFile = imageFile.file || imageFile;
    
    // Validate file
    if (onProgress) onProgress({ stage: 'validating', message: 'Validating image file...' });
    validateImageFile(actualFile);

    // Translate Persian prompt to English if needed
    if (onProgress) onProgress({ stage: 'translating', message: 'Processing prompt...' });
    console.log('Original prompt:', prompt);
    const translationResult = await smartTranslatePrompt(prompt);
    const finalPrompt = translationResult.translatedPrompt;
    
    if (translationResult.wasTranslated) {
      console.log('Translated prompt from Persian to English:', finalPrompt);
    }

    let imageUrl;
    
    try {
      // Compress image progressively
      if (onProgress) onProgress({ stage: 'processing_image', message: 'Processing image...' });
      
      const compressedFile = await compressImageProgressive(
        actualFile, 
        MAX_DIMENSION, 
        MAX_DIMENSION, 
        TARGET_SIZE_THRESHOLD,
        (progress) => {
          if (onProgress) {
            onProgress({
              stage: 'compressing',
              message: 'Compressing image...',
              ...progress
            });
          }
        }
      );
      
      // Upload to fal.ai storage
      imageUrl = await uploadImageToStorage(compressedFile, (progress) => {
        if (onProgress) {
          onProgress({
            stage: 'uploading',
            message: 'Uploading image...',
            ...progress
          });
        }
      });
      
      console.log('Image uploaded successfully:', imageUrl);
      
    } catch (error) {
      console.warn('Failed to upload image to storage, falling back to data URI:', error);
      
      // Fallback to data URI for smaller files
      const compressedFile = await compressImageProgressive(actualFile, 1024, 1024, 2 * 1024 * 1024); // 2MB limit for data URI
      imageUrl = await fileToDataUri(compressedFile);
    }
    
    // Prepare the input for the API
    const input = {
      prompt: finalPrompt,
      image_url: imageUrl,
      guidance_scale: parameters.guidance_scale || 3.5,
      output_format: parameters.output_format || 'jpeg',
      safety_tolerance: parameters.safety_tolerance || '2',
      aspect_ratio: parameters.aspect_ratio || '1:1',
      ...(parameters.seed && { seed: parameters.seed })
    };

    if (onProgress) onProgress({ stage: 'generating', message: 'Generating image...' });

    let result;
    if (MOCK_MODE) {
      console.log('Running in mock mode (fast) - generating mock response');
      // Simulate progress updates
      if (onProgress) {
        setTimeout(() => onProgress({ stage: 'generating', message: 'Processing...', status: 'IN_PROGRESS' }), 300);
        setTimeout(() => onProgress({ stage: 'generating', message: 'Almost done...', status: 'IN_PROGRESS' }), 800);
      }
      const mockData = await generateMockResponse(1000); // Faster mock response
      result = { data: mockData };
    } else {
      // Call the fal.ai API (cheaper/faster version)
      result = await fal.subscribe('fal-ai/flux-pro/kontext', {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && onProgress) {
            onProgress({ stage: 'generating', message: 'Processing...', ...update });
          }
          console.log('Processing update:', update);
        },
      });
    }

    if (onProgress) onProgress({ stage: 'completed', message: 'Image generation completed!' });
    return result.data;
    
  } catch (error) {
    console.error('Error processing image:', error);
    if (onProgress) onProgress({ stage: 'error', message: error.message });
    throw new Error(error.message || 'Failed to process image');
  }
};

/**
 * Upload a file to fal.ai storage (optional, for large files)
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The uploaded file URL
 */
export const uploadFile = async (file) => {
  try {
    const url = await fal.storage.upload(file);
    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to storage');
  }
};

/**
 * Get the status of a processing request (for async processing)
 * @param {string} requestId - The request ID
 * @returns {Promise<Object>} The request status
 */
export const getProcessingStatus = async (requestId) => {
  try {
    const status = await fal.queue.status('fal-ai/image-editing/retouch', {
      requestId,
      logs: true,
    });
    return status;
  } catch (error) {
    console.error('Error getting processing status:', error);
    throw new Error('Failed to get processing status');
  }
};

/**
 * Get the result of a completed processing request
 * @param {string} requestId - The request ID
 * @returns {Promise<Object>} The processing result
 */
export const getProcessingResult = async (requestId) => {
  try {
    const result = await fal.queue.result('fal-ai/image-editing/retouch', {
      requestId
    });
    return result.data;
  } catch (error) {
    console.error('Error getting processing result:', error);
    throw new Error('Failed to get processing result');
  }
};