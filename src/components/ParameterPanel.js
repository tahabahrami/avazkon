import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Square, FileImage, Shuffle, ChevronDown, ChevronUp } from 'lucide-react';
import ParameterControl from './ParameterControl';

const ParameterPanel = ({ parameters, setParameters, isDualImageMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleParameterChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    handleParameterChange('seed', randomSeed);
  };

  const clearSeed = () => {
    handleParameterChange('seed', null);
  };

  return (
    <motion.div 
      className="parameter-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="parameter-panel-header clickable"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="header-left">
          <Settings className="panel-icon" />
          <h3>کنترل‌های هوش مصنوعی</h3>
          <span className="mode-indicator">
            {isDualImageMode ? 'حالت ترکیب' : 'حالت ویرایش'}
          </span>
        </div>
        <div className="header-right">
          <span className="expand-hint">
            {isExpanded ? 'مخفی کردن' : 'نمایش'} پارامترها
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="parameter-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
        {/* Creativity Level (Guidance Scale) */}
        <ParameterControl
          icon={<Palette size={20} />}
          label="سطح خلاقیت"
          description="کنترل می‌کند که هوش مصنوعی چقدر دقیق از دستور شما پیروی کند"
          value={parameters.guidance_scale}
          min={1}
          max={10}
          step={0.5}
          onChange={(value) => handleParameterChange('guidance_scale', value)}
          visualType="intensity"
        />





        {/* Aspect Ratio (Single Image Mode Only) */}
        {!isDualImageMode && (
          <div className="parameter-item aspect-ratio-control">
            <div className="parameter-header">
              <div className="parameter-icon"><Square size={20} /></div>
              <div className="parameter-label">نسبت ابعاد</div>
              <div className="parameter-value">{parameters.aspect_ratio}</div>
            </div>
            <div className="parameter-description">
              ابعاد تصویر خروجی
            </div>
            <div className="aspect-ratio-grid">
              <div 
                className={`aspect-option ${parameters.aspect_ratio === '16:9' ? 'active' : ''}`}
                onClick={() => handleParameterChange('aspect_ratio', '16:9')}
                title="افقی (16:9)"
              >
                <div className="aspect-preview aspect-16-9"></div>
                <span>16*9</span>
              </div>
              <div 
                className={`aspect-option ${parameters.aspect_ratio === '1:1' ? 'active' : ''}`}
                onClick={() => handleParameterChange('aspect_ratio', '1:1')}
                title="مربع (1:1)"
              >
                <div className="aspect-preview aspect-1-1"></div>
                <span>1*1</span>
              </div>
              <div 
                className={`aspect-option ${parameters.aspect_ratio === '9:16' ? 'active' : ''}`}
                onClick={() => handleParameterChange('aspect_ratio', '9:16')}
                title="عمودی (9:16)"
              >
                <div className="aspect-preview aspect-9-16"></div>
                <span>9*16</span>
              </div>
              <div 
                className={`aspect-option ${parameters.aspect_ratio === '4:3' ? 'active' : ''}`}
                onClick={() => handleParameterChange('aspect_ratio', '4:3')}
                title="کلاسیک (4:3)"
              >
                <div className="aspect-preview aspect-4-3"></div>
                <span>4*3</span>
              </div>
            </div>
          </div>
        )}

        {/* Output Format */}
        <div className="parameter-item custom-select">
          <div className="parameter-header">
            <div className="parameter-icon"><FileImage size={20} /></div>
            <div className="parameter-label">فرمت خروجی</div>
            <div className="parameter-value">{parameters.output_format.toUpperCase()}</div>
          </div>
          <div className="parameter-description">
            فرمت فایل تصویر برای دانلود
          </div>
          <select
            value={parameters.output_format}
            onChange={(e) => handleParameterChange('output_format', e.target.value)}
            className="parameter-select"
          >
            <option value="jpeg">JPEG - حجم فایل کمتر</option>
            <option value="png">PNG - کیفیت بالاتر</option>
          </select>
        </div>

        {/* Seed Control */}
        <div className="parameter-item seed-control">
          <div className="parameter-header">
            <div className="parameter-icon"><Shuffle size={20} /></div>
            <div className="parameter-label">بذر تصادفی</div>
            <div className="parameter-value">
              {parameters.seed ? parameters.seed : 'تصادفی'}
            </div>
          </div>
          <div className="parameter-description">
            برای نتایج قابل تکرار تنظیم کنید، برای تصادفی خالی بگذارید
          </div>
          <div className="seed-controls">
            <input
              type="number"
              placeholder="خودکار (تصادفی)"
              value={parameters.seed || ''}
              onChange={(e) => handleParameterChange('seed', e.target.value ? parseInt(e.target.value) : null)}
              className="seed-input"
            />
            <motion.button
              type="button"
              onClick={generateRandomSeed}
              className="seed-button"
              title="تولید بذر تصادفی"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle size={16} />
            </motion.button>
            <motion.button
              type="button"
              onClick={clearSeed}
              className="seed-button clear"
              title="پاک کردن بذر (خودکار)"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ×
            </motion.button>
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <motion.div 
          className="parameter-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="summary-item">
            <Palette size={16} />
            <span>خلاقیت: {parameters.guidance_scale}</span>
          </div>
          <div className="summary-item">
            <Square size={16} />
            <span>نسبت: {parameters.aspect_ratio}</span>
          </div>
          <div className="summary-item">
            <FileImage size={16} />
            <span>{parameters.output_format.toUpperCase()}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParameterPanel;