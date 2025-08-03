import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Image as ImageIcon, Type, Wand2, Info, Shuffle, X, Plus, Minus } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import ProcessingStatus from '../../components/ProcessingStatus';
import ResultDisplay from '../../components/ResultDisplay';
import Notification from '../../components/Notification';
import Tooltip from '../../components/UI/Tooltip';
import LoadingStates from '../../components/LoadingStates/LoadingStates';
import PromptInput from '../../components/PromptTagSystem/PromptInput';
import { processImage, processSingleImage, processSingleImageFast } from '../../services/falAI';
import './EditImage.css';

const EditImage = () => {
  const location = useLocation();
  const [firstImage, setFirstImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parameters, setParameters] = useState({
    guidance_scale: 3.5,
    num_inference_steps: 28,
    output_format: 'jpeg',
    safety_tolerance: '3',
    aspect_ratio: '1:1',
    seed: '',
    creativity: 5,
    aspectRatio: '1:1',
    outputFormat: 'PNG'
  });
  const [selectedModel, setSelectedModel] = useState('max'); // 'max', 'fast'
  const [, setError] = useState(null);
  const [notification, setNotification] = useState({ type: 'info', message: '', isVisible: false });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(null);
  const [processingStep, setProcessingStep] = useState('');
  const [showSecondUpload, setShowSecondUpload] = useState(false);

  // Determine if we're in single or dual image mode
  const isDualImageMode = useMemo(() => {
    return firstImage && secondImage;
  }, [firstImage, secondImage]);

  const isSingleImageMode = useMemo(() => {
    return firstImage && !secondImage;
  }, [firstImage, secondImage]);

  // Enhanced notification system
  const showNotification = useCallback((type, message, duration = 5000) => {
    setNotification({ type, message, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  // Enhanced loading state management
  const setEnhancedLoadingState = useCallback((state, step = '') => {
    setLoadingState(state);
    setProcessingStep(step);
  }, []);

  // Handle pre-populated data from social feed
  useEffect(() => {
    if (location.state?.postData) {
      const { postData } = location.state;
      
      if (postData.promptId && !postData.isLocked) {
        // Set prompt with the tag format for automatic tag creation
        setPrompt(`##${postData.promptId} `);
      } else if (postData.prompt && !postData.isLocked) {
        setPrompt(postData.prompt);
      }
      
      if (postData.parameters) {
        setParameters(prev => ({ ...prev, ...postData.parameters }));
      }
      
      if (postData.originalImage) {
        setFirstImage(postData.originalImage);
      }
      
      if (postData.editedImage) {
        setSecondImage(postData.editedImage);
      }
      
      showNotification('info', 'تنظیمات از پست انتخاب شده بارگذاری شد');
    }
  }, [location.state, showNotification]);

  const handleFirstImageUpload = useCallback((file) => {
    setFirstImage(file);
    setProcessedImage(null);
    setError(null);
    showNotification('success', 'تصویر اول با موفقیت آپلود شد!');
  }, [showNotification]);

  const handleSecondImageUpload = useCallback((file) => {
    setSecondImage(file);
    setProcessedImage(null);
    setError(null);
    showNotification('success', 'تصویر دوم با موفقیت آپلود شد!');
  }, [showNotification]);

  const handlePromptChange = useCallback((e) => {
    setPrompt(e.target.value);
    setProcessedImage(null);
    setError(null);
  }, []);

  const handleProcessImage = async () => {
    // Validation based on mode
    if (isDualImageMode) {
      if (!firstImage || !secondImage) {
        const errorMsg = 'لطفاً ابتدا هر دو تصویر را بارگذاری کنید';
        setError(errorMsg);
        showNotification('error', errorMsg);
        return;
      }
      if (!prompt.trim()) {
        const errorMsg = 'لطفاً دستوری وارد کنید که توضیح دهد چه چیزی می‌خواهید بسازید';
        setError(errorMsg);
        showNotification('error', errorMsg);
        return;
      }
    } else if (isSingleImageMode) {
      if (!firstImage) {
        const errorMsg = 'لطفاً ابتدا یک تصویر بارگذاری کنید';
        setError(errorMsg);
        showNotification('error', errorMsg);
        return;
      }
      if (!prompt.trim()) {
        const errorMsg = 'لطفاً دستوری وارد کنید که توضیح دهد چگونه می‌خواهید تصویر را ویرایش کنید';
        setError(errorMsg);
        showNotification('error', errorMsg);
        return;
      }
    } else {
      const errorMsg = 'لطفاً حداقل یک تصویر بارگذاری کنید';
      setError(errorMsg);
      showNotification('error', errorMsg);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);
    setEnhancedLoadingState('processing', 'راه‌اندازی پردازش تصویر...');
    showNotification('info', 'شروع پردازش تصویر...');

    try {
      // Enhanced progress updates with steps
      setEnhancedLoadingState('processing', 'آماده‌سازی تصاویر...');
      setProcessingProgress(10);
      
      const progressSteps = [
        { progress: 20, step: 'آپلود به سرور...' },
        { progress: 40, step: 'تجزیه و تحلیل محتوا...' },
        { progress: 60, step: 'اعمال پردازش هوش مصنوعی...' },
        { progress: 80, step: 'تولید نتیجه...' },
        { progress: 90, step: 'نهایی‌سازی...' }
      ];
      
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const nextStep = progressSteps.find(step => step.progress > prev);
          if (nextStep) {
            setEnhancedLoadingState('processing', nextStep.step);
            return nextStep.progress;
          }
          return prev;
        });
      }, 1000);

      let result;
      if (isDualImageMode) {
        setEnhancedLoadingState('processing', 'ترکیب تصاویر با هوش مصنوعی...');
        result = await processImage([firstImage, secondImage], prompt, parameters);
      } else {
        if (selectedModel === 'fast') {
          setEnhancedLoadingState('processing', 'حالت پردازش سریع...');
          result = await processSingleImageFast(firstImage, prompt, parameters);
        } else {
          setEnhancedLoadingState('processing', 'پردازش با کیفیت بالا...');
          result = await processSingleImage(firstImage, prompt, parameters);
        }
      }
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      console.log('Processing result received:', result);
      
      // Handle different response structures from fal.ai API
      let processedImageData;
      if (result.images && result.images.length > 0) {
        processedImageData = result.images[0];
        console.log('Using result.images[0]:', processedImageData);
      } else if (result.image) {
        processedImageData = result.image;
        console.log('Using result.image:', processedImageData);
      } else if (result.url) {
        processedImageData = { url: result.url };
        console.log('Using result.url:', processedImageData);
      } else {
        processedImageData = result;
        console.log('Using entire result:', processedImageData);
      }
      
      // Ensure the processed image data has a valid URL
      if (processedImageData && !processedImageData.url && typeof processedImageData === 'string') {
        processedImageData = { url: processedImageData };
        console.log('Converted string to object:', processedImageData);
      }
      
      console.log('Final processedImageData:', processedImageData);
      console.log('Setting processedImage state with:', processedImageData);

      setProcessedImage(processedImageData);
      setIsProcessing(false);
      setProcessingProgress(0);
      setEnhancedLoadingState(null); // Clear loading state immediately
      
      const successMsg = `${isDualImageMode ? 'ترکیب تصویر' : 'ویرایش تصویر'} با موفقیت تکمیل شد!`;
      showNotification('success', successMsg);
    } catch (err) {
      const errorMsg = err.message || 'پردازش تصاویر ناموفق بود';
      setError(errorMsg);
      showNotification('error', errorMsg);
      setIsProcessing(false);
      setProcessingProgress(0);
      setEnhancedLoadingState(null); // Clear loading state immediately on error
    }
  };

  const handleDownload = () => {
    if (processedImage?.url) {
      const link = document.createElement('a');
      link.href = processedImage.url;
      const extension = parameters.output_format === 'jpeg' ? 'jpg' : parameters.output_format;
      link.download = `pixie-edited-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Debug logging
  console.log('EditImage render - loadingState:', loadingState, 'type:', typeof loadingState);
  console.log('EditImage render - processingStep:', processingStep);
  console.log('EditImage render - isProcessing:', isProcessing);
  console.log('EditImage render - loadingState truthy check:', !!loadingState);

  return (
    <div className="edit-image-page">
      {/* Enhanced Loading States */}
      {loadingState && loadingState !== '' && (
        <LoadingStates
          type={loadingState}
          message={processingStep}
          progress={processingProgress}
        />
      )}

      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Type className="icon" />
          </div>
          <div className="header-text">
            <h1>ویرایش تصویر</h1>
            <p>تصاویر خود را با هوش مصنوعی ویرایش و بهبود دهید</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <section className="prompt-upload-section">
          <div className="section-header">
            <Type className="section-icon" />
            <h2>دستور خلاقانه و آپلود تصاویر</h2>
            <p className="section-subtitle">تصاویر را آپلود کنید و دستور بدهید</p>
          </div>
          
          <div className="prompt-upload-container">
            {/* Upload Section */}
            <div className="upload-section">
              <div className="upload-header">
                <ImageIcon className="upload-icon" />
                <Tooltip content="Upload your images here. You can upload one image for editing or two images for fusion." position="bottom">
                  <h3>بارگذاری تصاویر</h3>
                </Tooltip>
              </div>
              <div className="upload-grid">
                <div className="upload-item">
                  <div className="upload-label">
                    <span className="label-text">{isDualImageMode ? 'تصویر اول' : 'تصویر برای ویرایش'}</span>
                    <span className="required-badge">ضروری</span>
                  </div>
                  <Tooltip content={isDualImageMode ? "Upload the first image for fusion" : "Upload an image to edit with AI"} position="top">
                    <ImageUploader 
                      onImageUpload={handleFirstImageUpload}
                      uploadedImage={firstImage}
                      onImageRemove={() => setFirstImage(null)}
                      placeholder={isDualImageMode ? "تصویر اول خود را بارگذاری کنید" : "تصویری برای ویرایش بارگذاری کنید"}
                    />
                  </Tooltip>
                </div>
                <div className="upload-item">
                  {!showSecondUpload ? (
                    <div className="add-second-upload" onClick={() => setShowSecondUpload(true)}>
                      <div className="plus-button">
                        <Plus size={24} />
                        <span>افزودن تصویر دوم</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="upload-label">
                        <span className="label-text">تصویر دوم</span>
                        <span className="optional-badge">اختیاری</span>
                        <button 
                          className="minimize-btn"
                          onClick={() => {
                            setShowSecondUpload(false);
                            setSecondImage(null);
                          }}
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                      <Tooltip content="Upload a second image to enable fusion mode, or leave empty for single image editing" position="top">
                        <ImageUploader 
                          onImageUpload={handleSecondImageUpload}
                          uploadedImage={secondImage}
                          onImageRemove={() => setSecondImage(null)}
                          placeholder="تصویر دوم برای ترکیب"
                        />
                      </Tooltip>
                      {!secondImage && firstImage && (
                        <div className="mode-hint">
                          <Info size={16} />
                          <span>تصویر دوم اضافه کنید یا با تک تصویر ادامه دهید</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Prompt Section */}
            <div className="prompt-section">
              <div className="prompt-header">
                <Wand2 className="prompt-icon" />
                <Tooltip content="Describe what you want to create or how you want to edit your image(s)" position="bottom">
                  <h3>دستور خلاقانه</h3>
                </Tooltip>
              </div>
              <div className="prompt-container">
                <PromptInput
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder={isDualImageMode ? "چگونه تصاویر را ترکیب کنم؟" : "چگونه تصویر را ویرایش کنم؟"}
                  className="edit-image-prompt"
                />
              </div>
            </div>
          </div>

          {/* Model Selection - Only show for single image mode */}
          {isSingleImageMode && (
            <div className="model-selection">
              <div className="section-header">
                <Wand2 className="section-icon" />
                <h3>انتخاب مدل</h3>
              </div>
              <div className="model-options">
                <div 
                  className={`model-option ${selectedModel === 'max' ? 'selected' : ''}`}
                  onClick={() => setSelectedModel('max')}
                >
                  <div className="model-info">
                    <h4>کانتکست مکس</h4>
                    <p>کیفیت بالا، جزئیات بیشتر</p>
                    <span className="model-badge premium">پریمیوم</span>
                  </div>
                </div>
                <div 
                  className={`model-option ${selectedModel === 'fast' ? 'selected' : ''}`}
                  onClick={() => setSelectedModel('fast')}
                >
                  <div className="model-info">
                    <h4>کانتکست پرو</h4>
                    <p>سریع و ارزان</p>
                    <span className="model-badge fast">سریع و ارزان</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className="process-btn"
            onClick={handleProcessImage}
            disabled={!firstImage || (isDualImageMode && !secondImage) || !prompt.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                در حال ساخت...
              </>
            ) : (
              <>
                <Wand2 />
                {isDualImageMode ? 'ترکیب تصاویر' : 'ویرایش تصویر'}
              </>
            )}
          </button>
        </section>

        <section>
          <div className="section-header">
            <Download className="section-icon" />
            <h2>نتایج</h2>
          </div>
          
          <AnimatePresence mode="wait">
            {(() => {
              console.log('Render state - processedImage:', processedImage);
              console.log('Render state - isProcessing:', isProcessing);
              console.log('Render state - processedImage.url:', processedImage?.url);
              return null;
            })()}
            
            {isProcessing && (
              <ProcessingStatus progress={processingProgress} />
            )}
            
            {processedImage && !isProcessing && processedImage.url && (
              <ResultDisplay 
                image={processedImage}
                onDownload={handleDownload}
                outputFormat={parameters.output_format}
              />
            )}
            
            {(!processedImage || !processedImage.url) && !isProcessing && (
              <div className="placeholder">
                <ImageIcon className="placeholder-icon" />
                <p>تصاویر بارگذاری کنید و دستور خود را وارد کنید تا نتایج را اینجا ببینید</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* AI Controls Section */}
        <section className="ai-controls-section">
          <div className="controls-container">
            <div className="controls-header">
              <div className="header-content">
                <div className="header-icon">
                  <Wand2 className="sparkle-icon" />
                </div>
                <div className="header-text">
                  <h2>تنظیمات پیشرفته هوش مصنوعی</h2>
                  <p>کنترل دقیق بر کیفیت و سبک تصویر تولیدی</p>
                </div>
              </div>
              <div className="mode-badge">پیشرفته</div>
            </div>

            <div className="controls-grid">
              {/* Creativity Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>سطح خلاقیت</h3>
                    <p>کنترل میزان خلاقیت و تنوع</p>
                  </div>
                  <div className="control-value">{parameters.creativity}/10</div>
                </div>
                <div className="visual-slider">
                  <div className="slider-track">
                    <div 
                      className="slider-fill" 
                      style={{ width: `${(parameters.creativity / 10) * 100}%` }}
                    ></div>
                    <div 
                      className="slider-thumb" 
                      style={{ left: `${(parameters.creativity / 10) * 100}%` }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={parameters.creativity}
                    onChange={(e) => setParameters(prev => ({...prev, creativity: parseInt(e.target.value)}))}
                    className="range-input"
                  />
                </div>
                <div className="slider-labels">
                  <span>محافظه‌کار</span>
                  <span>متعادل</span>
                  <span>خلاق</span>
                </div>
              </div>

              {/* Aspect Ratio Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>نسبت ابعاد</h3>
                    <p>ابعاد مناسب تصویر را انتخاب کنید</p>
                  </div>
                  <div className="control-value">{parameters.aspectRatio}</div>
                </div>
                <div className="aspect-grid">
                  {[
                    { ratio: '1:1', label: 'مربع', preview: 'square' },
                    { ratio: '16:9', label: 'افقی', preview: 'landscape' },
                    { ratio: '9:16', label: 'عمودی', preview: 'portrait' },
                    { ratio: '21:9', label: 'فوق‌عریض', preview: 'ultrawide' },
                    { ratio: '4:3', label: 'کلاسیک', preview: 'classic' },
                    { ratio: '3:2', label: 'عکاسی', preview: 'photo' },
                    { ratio: '2:3', label: 'عکس عمودی', preview: 'photo-portrait' },
                    { ratio: '4:5', label: 'شبکه اجتماعی', preview: 'social' },
                    { ratio: '5:4', label: 'شبکه افقی', preview: 'social-landscape' },
                    { ratio: '3:4', label: 'موبایل', preview: 'mobile' },
                    { ratio: '9:21', label: 'عمودی بلند', preview: 'vertical' }
                  ].map((option) => (
                    <div
                      key={option.ratio}
                      className={`aspect-option ${parameters.aspectRatio === option.ratio ? 'selected' : ''}`}
                      onClick={() => setParameters(prev => ({...prev, aspectRatio: option.ratio}))}
                    >
                      <div className={`aspect-preview ${option.preview}`}></div>
                      <div className="aspect-label">{option.label}</div>
                      <div className="aspect-ratio">{option.ratio}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Format Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>فرمت خروجی</h3>
                    <p>فرمت فایل مناسب را انتخاب کنید</p>
                  </div>
                  <div className="control-value">{parameters.outputFormat}</div>
                </div>
                <div className="format-options">
                  {[
                    { format: 'PNG', desc: 'کیفیت بالا با شفافیت', icon: 'PNG' },
                    { format: 'JPG', desc: 'حجم کمتر برای اشتراک', icon: 'JPG' }
                  ].map((option) => (
                    <div
                      key={option.format}
                      className={`format-option ${parameters.outputFormat === option.format ? 'selected' : ''}`}
                      onClick={() => setParameters(prev => ({...prev, outputFormat: option.format}))}
                    >
                      <div className="format-icon-wrapper">
                        {option.icon}
                      </div>
                      <div className="format-details">
                        <div className="format-name">{option.format}</div>
                        <div className="format-desc">{option.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seed Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>بذر تصادفی</h3>
                    <p>برای دریافت نتایج قابل تکرار</p>
                  </div>
                  <div className="control-value">{parameters.seed || 'تصادفی'}</div>
                </div>
                <div className="seed-input-group">
                  <input
                    type="text"
                    className="seed-input"
                    value={parameters.seed}
                    onChange={(e) => setParameters(prev => ({...prev, seed: e.target.value}))}
                    placeholder="شماره بذر را وارد کنید یا خالی بگذارید"
                  />
                  <div className="seed-buttons">
                    <button
                      className="seed-btn"
                      onClick={() => setParameters(prev => ({...prev, seed: Math.floor(Math.random() * 1000000).toString()}))}
                      title="تولید بذر تصادفی"
                    >
                      <Shuffle size={16} />
                    </button>
                    <button
                      className="seed-btn"
                      onClick={() => setParameters(prev => ({...prev, seed: ''}))}
                      title="پاک کردن بذر"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => {
          setNotification(prev => ({ ...prev, isVisible: false }));
          setError(null);
        }}
      />
    </div>
  );
};

export default EditImage;