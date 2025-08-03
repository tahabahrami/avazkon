import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  Upload, 
  Wand2, 
  Play, 
  Download, 
  Settings, 
  Clock, 
  Monitor, 
  Zap, 
  Shuffle,
  Info,
  Lightbulb,
  Film
} from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import Notification from '../../components/Notification';
import PromptInput from '../../components/PromptTagSystem/PromptInput';
import './CreateVideo.css';

const CreateVideo = () => {
  const location = useLocation();
  // State management
  const [prompt, setPrompt] = useState('');
  const [startImage, setStartImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Video parameters
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [fps, setFps] = useState(24);
  const [motionStrength, setMotionStrength] = useState(5);
  const [seed, setSeed] = useState('');
  const [outputFormat, setOutputFormat] = useState('mp4');
  
  const fileInputRef = useRef(null);
  
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
      
      if (postData.startImage) {
        setStartImage(postData.startImage);
      }
      
      if (postData.parameters) {
        const { parameters } = postData;
        if (parameters.duration) setDuration(parameters.duration);
        if (parameters.aspectRatio) setAspectRatio(parameters.aspectRatio);
        if (parameters.fps) setFps(parameters.fps);
        if (parameters.motionStrength) setMotionStrength(parameters.motionStrength);
        if (parameters.seed) setSeed(parameters.seed);
        if (parameters.outputFormat) setOutputFormat(parameters.outputFormat);
      }
      
      setNotification({
        type: 'success',
        message: 'تنظیمات از پست انتخاب شده بارگذاری شد'
      });
    }
  }, [location.state]);
  
  // Prompt suggestions for video generation
  const promptSuggestions = [
    'یک منظره طبیعی زیبا با آبشار و جنگل سبز',
    'شهر مدرن در شب با نورهای رنگارنگ',
    'اقیانوس آرام با امواج ملایم در غروب',
    'کوه‌های برفی با ابرهای متحرک',
    'باغ گل‌های رنگارنگ در بهار',
    'آسمان پر ستاره در شب تاریک',
    'شعله‌های آتش در کمین',
    'باران ملایم روی برگ‌های سبز'
  ];
  
  // Duration options
  const durationOptions = [
    { value: 3, label: '3 ثانیه', desc: 'سریع' },
    { value: 5, label: '5 ثانیه', desc: 'استاندارد' },
    { value: 10, label: '10 ثانیه', desc: 'طولانی' }
  ];
  
  // Aspect ratio options
  const aspectRatioOptions = [
    { value: '16:9', label: '16:9', desc: 'افقی' },
    { value: '9:16', label: '9:16', desc: 'عمودی' },
    { value: '1:1', label: '1:1', desc: 'مربع' },
    { value: '4:3', label: '4:3', desc: 'کلاسیک' }
  ];
  
  // FPS options
  const fpsOptions = [
    { value: 12, label: '12 FPS', desc: 'پایین' },
    { value: 24, label: '24 FPS', desc: 'استاندارد' },
    { value: 30, label: '30 FPS', desc: 'روان' },
    { value: 60, label: '60 FPS', desc: 'بالا' }
  ];
  
  // Output format options
  const formatOptions = [
    { value: 'mp4', label: 'MP4', desc: 'استاندارد', icon: 'MP4' },
    { value: 'webm', label: 'WebM', desc: 'وب', icon: 'WEB' },
    { value: 'mov', label: 'MOV', desc: 'کیفیت بالا', icon: 'MOV' }
  ];
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
  };
  
  const handleImageUpload = (file) => {
    setStartImage(file);
    showNotification('تصویر آپلود شد - حالت تصویر به ویدیو فعال است', 'success');
  };
  
  const handleImageRemove = () => {
    setStartImage(null);
    showNotification('تصویر حذف شد - حالت متن به ویدیو فعال است', 'info');
  };
  
  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    setSeed(randomSeed.toString());
  };
  
  const clearSeed = () => {
    setSeed('');
  };
  
  const simulateVideoGeneration = async () => {
    const steps = [
      { progress: 10, message: 'آماده‌سازی پارامترها...' },
      { progress: 25, message: 'تجزیه و تحلیل پرامپت...' },
      { progress: 40, message: startImage ? 'پردازش تصویر مرجع...' : 'تولید فریم‌های اولیه...' },
      { progress: 60, message: 'ایجاد انیمیشن...' },
      { progress: 80, message: 'رندر کردن ویدیو...' },
      { progress: 95, message: 'نهایی‌سازی...' },
      { progress: 100, message: 'ویدیو آماده است!' }
    ];
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step.progress);
      showNotification(step.message, 'info');
    }
    
    // Simulate result
    const mockResult = {
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: duration,
      aspectRatio: aspectRatio,
      fps: fps,
      format: outputFormat,
      seed: seed || Math.floor(Math.random() * 1000000),
      prompt: prompt,
      hasStartImage: !!startImage
    };
    
    setResult(mockResult);
    showNotification('ویدیو با موفقیت تولید شد!', 'success');
  };
  
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      showNotification('لطفاً توضیحی برای ویدیو وارد کنید', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    setResult(null);
    
    try {
      // Determine which API to use based on whether start image is provided
      const apiEndpoint = startImage 
        ? 'https://fal.ai/models/fal-ai/veo3/fast/image-to-video/api'
        : 'https://fal.ai/models/fal-ai/veo3/fast/api';
      
      showNotification(`شروع تولید ویدیو با ${startImage ? 'تصویر مرجع' : 'متن'}...`, 'info');
      
      // Simulate API call
      await simulateVideoGeneration();
      
    } catch (error) {
      console.error('Error generating video:', error);
      showNotification('خطا در تولید ویدیو. لطفاً دوباره تلاش کنید.', 'error');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  const handleDownload = () => {
    if (result?.videoUrl) {
      const link = document.createElement('a');
      link.href = result.videoUrl;
      link.download = `generated-video-${Date.now()}.${result.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('دانلود ویدیو شروع شد', 'success');
    }
  };
  
  return (
    <motion.div 
      className="create-video-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Video className="icon" />
          </div>
          <div className="header-text">
            <h1>تولید ویدیو</h1>
            <p>ویدیوهای شگفت‌انگیز از متن یا تصویر بسازید</p>
          </div>
        </div>
      </div>
      
      <div className="page-content">
        {/* Prompt Section */}
        <section className="prompt-section">
          <div className="section-header">
            <Wand2 className="section-icon" />
            <div>
              <h2>توضیح ویدیو</h2>
              <p className="section-subtitle">ویدیوی مورد نظر خود را توضیح دهید</p>
            </div>
          </div>
          
          <div className="prompt-container">
            <PromptInput
              value={prompt}
              onChange={handlePromptChange}
              placeholder="ویدیوی مورد نظر خود را توضیح دهید... مثال: یک منظره طبیعی زیبا با آبشار و جنگل سبز"
              className="create-video-prompt"
            />
            
            {/* Prompt Suggestions */}
            <div className="prompt-suggestions">
              <h4>
                <Lightbulb size={16} style={{ marginLeft: '0.5rem' }} />
                پیشنهادات خلاقانه
              </h4>
              <div className="suggestions-grid">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Start Image Section */}
        <section className="start-image-section">
          <div className="section-header">
            <Upload className="section-icon" />
            <div>
              <h2>تصویر مرجع (اختیاری)</h2>
              <p className="section-subtitle">برای تولید ویدیو از تصویر، یک تصویر آپلود کنید</p>
            </div>
          </div>
          
          <div className="image-container">
            <ImageUploader
                  onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              uploadedImage={startImage}
              acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
              maxSize={10}
              className="start-image-upload"
            />
            
            {!startImage && (
              <div className="image-hint">
                <Info size={16} />
                <span>بدون تصویر: ویدیو از متن تولید می‌شود | با تصویر: ویدیو از تصویر شروع می‌شود</span>
              </div>
            )}
          </div>
        </section>
        
        {/* Generate Button */}
        <button
          className="generate-btn"
          onClick={handleGenerateVideo}
          disabled={isProcessing || !prompt.trim()}
        >
          {isProcessing ? (
            <>
              <div className="spinner" />
              در حال تولید... {progress}%
            </>
          ) : (
            <>
              <Film size={20} />
              {startImage ? 'تولید ویدیو از تصویر' : 'تولید ویدیو از متن'}
            </>
          )}
        </button>
        
        {/* Results Section */}
        {result ? (
          <section className="results-section">
            <div className="section-header">
              <Play className="section-icon" />
              <div>
                <h2>ویدیوی تولید شده</h2>
                <p className="section-subtitle">ویدیوی شما آماده است</p>
              </div>
            </div>
            
            <div className="result-container">
              <div className="video-player">
                <video 
                  controls 
                  className="generated-video"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EGenerated Video%3C/text%3E%3C/svg%3E"
                >
                  <source src={result.videoUrl} type={`video/${result.format}`} />
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </video>
              </div>
              
              <div className="result-info">
                <div className="info-grid">
                  <div className="info-item">
                    <Clock size={16} />
                    <span>مدت زمان: {result.duration} ثانیه</span>
                  </div>
                  <div className="info-item">
                    <Monitor size={16} />
                    <span>نسبت تصویر: {result.aspectRatio}</span>
                  </div>
                  <div className="info-item">
                    <Zap size={16} />
                    <span>FPS: {result.fps}</span>
                  </div>
                  <div className="info-item">
                    <Film size={16} />
                    <span>فرمت: {result.format.toUpperCase()}</span>
                  </div>
                </div>
                
                <button className="download-btn" onClick={handleDownload}>
                  <Download size={16} />
                  دانلود ویدیو
                </button>
              </div>
            </div>
          </section>
        ) : !isProcessing && (
          <div className="placeholder">
            <Video className="placeholder-icon" />
            <p>ویدیوی تولید شده اینجا نمایش داده می‌شود</p>
          </div>
        )}
        
        {/* AI Controls Section */}
        <section className="ai-controls-section">
          <div className="controls-header">
            <div className="header-content">
              <div className="header-icon">
                <Settings className="sparkle-icon" />
              </div>
              <div className="header-text">
                <h2>تنظیمات پیشرفته</h2>
                <p>پارامترهای تولید ویدیو را تنظیم کنید</p>
              </div>
            </div>
            <div className="mode-badge">
              {startImage ? 'تصویر به ویدیو' : 'متن به ویدیو'}
            </div>
          </div>
          
          <div className="controls-container">
            <div className="controls-grid">
              {/* Duration Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>مدت زمان</h3>
                    <p>طول ویدیوی تولیدی</p>
                  </div>
                  <div className="control-value">{duration}s</div>
                </div>
                
                <div className="duration-options">
                  {durationOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`duration-option ${duration === option.value ? 'selected' : ''}`}
                      onClick={() => setDuration(option.value)}
                    >
                      <div className="option-label">{option.label}</div>
                      <div className="option-desc">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Aspect Ratio Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>نسبت تصویر</h3>
                    <p>ابعاد ویدیوی تولیدی</p>
                  </div>
                  <div className="control-value">{aspectRatio}</div>
                </div>
                
                <div className="aspect-options">
                  {aspectRatioOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`aspect-option ${aspectRatio === option.value ? 'selected' : ''}`}
                      onClick={() => setAspectRatio(option.value)}
                    >
                      <div className="option-label">{option.label}</div>
                      <div className="option-desc">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FPS Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>نرخ فریم</h3>
                    <p>روانی حرکت در ویدیو</p>
                  </div>
                  <div className="control-value">{fps} FPS</div>
                </div>
                
                <div className="fps-options">
                  {fpsOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`fps-option ${fps === option.value ? 'selected' : ''}`}
                      onClick={() => setFps(option.value)}
                    >
                      <div className="option-label">{option.label}</div>
                      <div className="option-desc">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Motion Strength Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>قدرت حرکت</h3>
                    <p>میزان حرکت در ویدیو</p>
                  </div>
                  <div className="control-value">{motionStrength}/10</div>
                </div>
                
                <div className="visual-slider">
                  <div className="slider-track">
                    <div 
                      className="slider-fill" 
                      style={{ width: `${(motionStrength / 10) * 100}%` }}
                    />
                    <div 
                      className="slider-thumb" 
                      style={{ left: `${(motionStrength / 10) * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={motionStrength}
                    onChange={(e) => setMotionStrength(parseInt(e.target.value))}
                    className="range-input"
                  />
                  <div className="slider-labels">
                    <span>کم</span>
                    <span>متوسط</span>
                    <span>زیاد</span>
                  </div>
                </div>
              </div>
              
              {/* Output Format Control */}
              <div className="control-card">
                <div className="card-header">
                  <div className="control-info">
                    <h3>فرمت خروجی</h3>
                    <p>نوع فایل ویدیوی تولیدی</p>
                  </div>
                  <div className="control-value">{outputFormat.toUpperCase()}</div>
                </div>
                
                <div className="format-options">
                  {formatOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`format-option ${outputFormat === option.value ? 'selected' : ''}`}
                      onClick={() => setOutputFormat(option.value)}
                    >
                      <div className="format-icon-wrapper">
                        {option.icon}
                      </div>
                      <div className="format-details">
                        <div className="format-name">{option.label}</div>
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
                    <h3>Seed</h3>
                    <p>برای تکرار نتایج یکسان</p>
                  </div>
                  <div className="control-value">{seed || 'تصادفی'}</div>
                </div>
                
                <div className="seed-input-group">
                  <input
                    type="text"
                    className="seed-input"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="عدد seed (اختیاری)"
                  />
                  <div className="seed-buttons">
                    <button className="seed-btn" onClick={generateRandomSeed}>
                      <Shuffle size={16} />
                    </button>
                    <button className="seed-btn" onClick={clearSeed}>
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </motion.div>
  );
};

export default CreateVideo;