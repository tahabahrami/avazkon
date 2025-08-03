import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, Type, Wand2, Info, Shuffle, X, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import ProcessingStatus from '../../components/ProcessingStatus';
import ResultDisplay from '../../components/ResultDisplay';
import Notification from '../../components/Notification';
import Tooltip from '../../components/UI/Tooltip';
import LoadingStates from '../../components/LoadingStates/LoadingStates';
import PromptInput from '../../components/PromptTagSystem/PromptInput';
import './CreateImage.css';

const CreateImage = () => {
  const location = useLocation();
  const [referenceImage, setReferenceImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parameters, setParameters] = useState({
    width: 1024,
    height: 1024,
    num_inference_steps: 28,
    guidance_scale: 3.5,
    num_images: 1,
    enable_safety_checker: true,
    output_format: 'jpeg',
    seed: '',
    creativity: 7,
    style: 'realistic',
    quality: 'standard'
  });
  const [, setError] = useState(null);
  const [notification, setNotification] = useState({ type: 'info', message: '', isVisible: false });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(null);
  const [processingStep, setProcessingStep] = useState('');

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
      
      if (postData.referenceImage) {
        // Convert base64 or URL to file object if needed
        setReferenceImage(postData.referenceImage);
      }
      
      showNotification('info', 'تنظیمات از پست انتخاب شده بارگذاری شد');
    }
  }, [location.state, showNotification]);

  const handleReferenceImageUpload = useCallback((file) => {
    setReferenceImage(file);
    setGeneratedImage(null);
    setError(null);
    setEnhancedLoadingState('upload', 'در حال پردازش تصویر مرجع...');
    showNotification('success', 'تصویر مرجع با موفقیت آپلود شد!');
    setEnhancedLoadingState(null);
  }, [setEnhancedLoadingState, showNotification]);

  const handlePromptChange = useCallback((e) => {
    setPrompt(e.target.value);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleCreateImage = async () => {
    if (!prompt.trim()) {
      const errorMsg = 'لطفاً دستوری وارد کنید که توضیح دهد چه تصویری می‌خواهید بسازید';
      setError(errorMsg);
      showNotification('error', errorMsg);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);
    setEnhancedLoadingState('processing', 'راه‌اندازی ساخت تصویر...');
    showNotification('info', 'شروع تولید تصویر...');

    try {
      // Simulate API call to fal-ai/flux/krea/api
      const progressSteps = [
        { progress: 15, step: 'تجزیه و تحلیل پرامپت...' },
        { progress: 30, step: 'آماده‌سازی مدل هوش مصنوعی...' },
        { progress: 50, step: 'تولید تصویر...' },
        { progress: 70, step: 'اعمال استایل...' },
        { progress: 85, step: 'بهبود کیفیت...' },
        { progress: 95, step: 'نهایی‌سازی...' }
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
      }, 800);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setEnhancedLoadingState('success', 'تصویر با موفقیت ساخته شد!');
      
      // Mock result
      const mockResult = {
        url: 'https://picsum.photos/1024/1024?random=' + Date.now(),
        width: parameters.width,
        height: parameters.height,
        content_type: `image/${parameters.output_format}`
      };
      
      setGeneratedImage(mockResult);
      setIsProcessing(false);
      setProcessingProgress(0);
      setEnhancedLoadingState(null);
      showNotification('success', 'تصویر با موفقیت ساخته شد!');
    } catch (err) {
      const errorMsg = err.message || 'ساخت تصویر ناموفق بود';
      setError(errorMsg);
      showNotification('error', errorMsg);
      setIsProcessing(false);
      setProcessingProgress(0);
      setEnhancedLoadingState(null);
    }
  };

  const handleDownload = () => {
    if (generatedImage?.url) {
      const link = document.createElement('a');
      link.href = generatedImage.url;
      const extension = parameters.output_format === 'jpeg' ? 'jpg' : parameters.output_format;
      link.download = `pixie-created-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const promptSuggestions = [
    'منظره طبیعی زیبا با آسمان آبی و ابرهای سفید',
    'پرتره هنری از یک شخص با نور نرم',
    'شهر مدرن در شب با نورهای رنگارنگ',
    'حیوان خانگی بامزه در محیط طبیعی',
    'غذای خوشمزه با تزئین زیبا',
    'معماری کلاسیک با جزئیات دقیق'
  ];

  return (
    <div className="create-image-page">
      {/* Enhanced Loading States */}
      {loadingState && (
        <LoadingStates
          type={loadingState}
          message={processingStep}
          progress={processingProgress}
        />
      )}

      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Sparkles className="icon" />
          </div>
          <div className="header-text">
            <h1>ساخت تصویر</h1>
            <p>تصاویر خلاقانه با هوش مصنوعی بسازید</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <section className="prompt-section">
          <div className="section-header">
            <Type className="section-icon" />
            <h2>دستور خلاقانه</h2>
            <p className="section-subtitle">تصویر مورد نظر خود را توصیف کنید</p>
          </div>
          
          <div className="prompt-container">
            <PromptInput
              value={prompt}
              onChange={handlePromptChange}
              placeholder="تصویری که می‌خواهید بسازید را توصیف کنید..."
              className="create-image-prompt"
            />
            
            {/* Prompt Suggestions */}
            <div className="prompt-suggestions">
              <h4>پیشنهادات:</h4>
              <div className="suggestions-grid">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => setPrompt(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reference Image Section */}
        <section className="reference-section">
          <div className="section-header">
            <ImageIcon className="section-icon" />
            <h2>تصویر مرجع</h2>
            <p className="section-subtitle">اختیاری - برای الهام و راهنمایی</p>
          </div>
          
          <div className="reference-container">
            <Tooltip content="Upload a reference image to guide the AI generation (optional)" position="top">
              <ImageUploader 
                onImageUpload={handleReferenceImageUpload}
                uploadedImage={referenceImage}
                onImageRemove={() => setReferenceImage(null)}
                placeholder="تصویر مرجع برای الهام (اختیاری)"
              />
            </Tooltip>
            {!referenceImage && (
              <div className="reference-hint">
                <Info size={16} />
                <span>تصویر مرجع می‌تواند به هوش مصنوعی کمک کند تا نتیجه بهتری تولید کند</span>
              </div>
            )}
          </div>
        </section>

        <button
          className="create-btn"
          onClick={handleCreateImage}
          disabled={!prompt.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner" />
              در حال ساخت...
            </>
          ) : (
            <>
              <Sparkles />
              ساخت تصویر
            </>
          )}
        </button>

        <section>
          <div className="section-header">
            <Download className="section-icon" />
            <h2>نتایج</h2>
          </div>
          
          <AnimatePresence mode="wait">
            {isProcessing && (
              <ProcessingStatus progress={processingProgress} />
            )}
            
            {generatedImage && !isProcessing && (
              <ResultDisplay 
                image={generatedImage}
                onDownload={handleDownload}
                outputFormat={parameters.output_format}
              />
            )}
            
            {!generatedImage && !isProcessing && (
              <div className="placeholder">
                <Sparkles className="placeholder-icon" />
                <p>دستور خود را وارد کنید تا تصویر جدید بسازیم</p>
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
                  <h2>تنظیمات پیشرفته</h2>
                  <p>کنترل دقیق بر کیفیت و سبک تصویر</p>
                </div>
              </div>
              <div className="mode-badge">پیشرفته</div>
            </div>

            <div className="controls-grid">
              {/* Image Dimensions */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>ابعاد تصویر</h3>
                    <p>عرض و ارتفاع تصویر نهایی</p>
                  </div>
                  <div className="control-value">{parameters.width}×{parameters.height}</div>
                </div>
                <div className="dimension-presets">
                  {[
                    { width: 512, height: 512, label: 'مربع کوچک' },
                    { width: 1024, height: 1024, label: 'مربع بزرگ' },
                    { width: 1024, height: 768, label: 'افقی' },
                    { width: 768, height: 1024, label: 'عمودی' },
                    { width: 1920, height: 1080, label: 'HD افقی' },
                    { width: 1080, height: 1920, label: 'HD عمودی' }
                  ].map((preset) => (
                    <button
                      key={`${preset.width}x${preset.height}`}
                      className={`dimension-preset ${parameters.width === preset.width && parameters.height === preset.height ? 'selected' : ''}`}
                      onClick={() => setParameters(prev => ({...prev, width: preset.width, height: preset.height}))}
                    >
                      <div className="preset-label">{preset.label}</div>
                      <div className="preset-size">{preset.width}×{preset.height}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>سبک تصویر</h3>
                    <p>انتخاب سبک هنری</p>
                  </div>
                  <div className="control-value">{parameters.style}</div>
                </div>
                <div className="style-options">
                  {[
                    { value: 'realistic', label: 'واقع‌گرایانه', desc: 'تصاویر طبیعی و واقعی' },
                    { value: 'artistic', label: 'هنری', desc: 'سبک نقاشی و هنری' },
                    { value: 'anime', label: 'انیمه', desc: 'سبک انیمیشن ژاپنی' },
                    { value: 'cartoon', label: 'کارتونی', desc: 'سبک کارتون و انیمیشن' }
                  ].map((style) => (
                    <div
                      key={style.value}
                      className={`style-option ${parameters.style === style.value ? 'selected' : ''}`}
                      onClick={() => setParameters(prev => ({...prev, style: style.value}))}
                    >
                      <div className="style-label">{style.label}</div>
                      <div className="style-desc">{style.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>کیفیت تصویر</h3>
                    <p>تعادل بین کیفیت و سرعت</p>
                  </div>
                  <div className="control-value">{parameters.quality}</div>
                </div>
                <div className="quality-options">
                  {[
                    { value: 'draft', label: 'پیش‌نویس', desc: 'سریع و کیفیت پایین', steps: 10 },
                    { value: 'standard', label: 'استاندارد', desc: 'متعادل', steps: 28 },
                    { value: 'high', label: 'بالا', desc: 'کیفیت بالا', steps: 50 }
                  ].map((quality) => (
                    <div
                      key={quality.value}
                      className={`quality-option ${parameters.quality === quality.value ? 'selected' : ''}`}
                      onClick={() => setParameters(prev => ({
                        ...prev, 
                        quality: quality.value,
                        num_inference_steps: quality.steps
                      }))}
                    >
                      <div className="quality-label">{quality.label}</div>
                      <div className="quality-desc">{quality.desc}</div>
                      <div className="quality-steps">{quality.steps} مرحله</div>
                    </div>
                  ))}
                </div>
              </div>

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
                    onChange={(e) => setParameters(prev => ({
                      ...prev, 
                      creativity: parseInt(e.target.value),
                      guidance_scale: 11 - parseInt(e.target.value) * 0.7
                    }))}
                    className="range-input"
                  />
                </div>
                <div className="slider-labels">
                  <span>محافظه‌کار</span>
                  <span>متعادل</span>
                  <span>خلاق</span>
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

              {/* Output Format */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>فرمت خروجی</h3>
                    <p>فرمت فایل نهایی</p>
                  </div>
                  <div className="control-value">{parameters.output_format.toUpperCase()}</div>
                </div>
                <div className="format-options">
                  {[
                    { format: 'jpeg', desc: 'حجم کمتر، مناسب اشتراک', icon: 'JPG' },
                    { format: 'png', desc: 'کیفیت بالا با شفافیت', icon: 'PNG' },
                    { format: 'webp', desc: 'حجم کم و کیفیت بالا', icon: 'WEBP' }
                  ].map((option) => (
                    <div
                      key={option.format}
                      className={`format-option ${parameters.output_format === option.format ? 'selected' : ''}`}
                      onClick={() => setParameters(prev => ({...prev, output_format: option.format}))}
                    >
                      <div className="format-icon-wrapper">
                        {option.icon}
                      </div>
                      <div className="format-details">
                        <div className="format-name">{option.format.toUpperCase()}</div>
                        <div className="format-desc">{option.desc}</div>
                      </div>
                    </div>
                  ))}
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

export default CreateImage;