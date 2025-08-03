import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const ParameterControl = ({ 
  icon, 
  label, 
  description, 
  value, 
  min = 0, 
  max = 100, 
  step = 1, 
  type = 'range', 
  onChange, 
  visualType = 'default' 
}) => {
  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const handleToggleChange = () => {
    onChange(!value);
  };

  const getVisualIndicatorWidth = () => {
    if (type === 'boolean') return value ? '100%' : '0%';
    return `${((value - min) / (max - min)) * 100}%`;
  };

  const handleVisualClick = (e) => {
    if (type === 'boolean') {
      handleToggleChange();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    // For RTL layout, invert the percentage calculation
    const percentage = 1 - (clickX / rect.width);
    const newValue = min + (percentage * (max - min));
    
    // Round to nearest step
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  };

  const handleStepsClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    // For RTL layout, invert the percentage calculation
    const percentage = 1 - (clickX / rect.width);
    const newValue = min + (percentage * (max - min));
    
    // Round to nearest step
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  };

  const renderVisual = () => {
    switch (visualType) {
      case 'intensity':
        return (
          <div 
            className="parameter-visual visual-intensity clickable-visual"
            onClick={handleVisualClick}
          >
            <motion.div 
              className="visual-indicator"
              style={{ width: getVisualIndicatorWidth() }}
              transition={{ duration: 0.3 }}
            />
          </div>
        );
      
      case 'steps':
        const stepCount = Math.floor((value - min) / ((Math.min(max, 50) - min) / 10));
        return (
          <div 
            className="parameter-visual visual-steps clickable-visual"
            onClick={handleStepsClick}
          >
            <div style={{ 
              display: 'flex', 
              height: '100%', 
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 8px'
            }}>
              {Array.from({ length: 10 }, (_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '6px',
                    height: i < stepCount ? '24px' : '12px',
                    background: i < stepCount ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '3px',
                    transition: 'all 0.3s ease'
                  }}
                  animate={{
                    height: i < stepCount ? '24px' : '12px',
                    background: i < stepCount ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'shield':
        return (
          <div className="parameter-visual visual-shield">
            <motion.div
              animate={{
                scale: value ? 1 : 0.8,
                opacity: value ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
            >
              <Shield size={24} color={value ? '#22c55e' : '#6b7280'} />
            </motion.div>
          </div>
        );
      
      case 'magic':
        return (
          <div 
            className="parameter-visual visual-magic clickable-visual"
            onClick={handleVisualClick}
          >
            <motion.div 
              className="visual-indicator"
              style={{ width: getVisualIndicatorWidth() }}
              transition={{ duration: 0.3 }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: '4px'
            }}>
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '4px',
                    height: '4px',
                    background: '#ffd700',
                    borderRadius: '50%'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div 
            className="parameter-visual clickable-visual"
            onClick={handleVisualClick}
          >
            <motion.div 
              className="visual-indicator"
              style={{ width: getVisualIndicatorWidth() }}
              transition={{ duration: 0.3 }}
            />
          </div>
        );
    }
  };

  const renderInput = () => {
    if (type === 'boolean') {
      return (
        <motion.div 
          className={`toggle-input ${value ? 'active' : ''}`}
          onClick={handleToggleChange}
          whileTap={{ scale: 0.95 }}
        >
          <div className="toggle-slider" />
        </motion.div>
      );
    }

    return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="slider-input"
      />
    );
  };

  const formatValue = (val) => {
    if (type === 'boolean') return val ? 'Enabled' : 'Disabled';
    if (step < 1) return val.toFixed(1);
    return Math.round(val).toString();
  };

  return (
    <motion.div 
      className="parameter-control"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="parameter-header">
        <div className="parameter-icon">{icon}</div>
        <div className="parameter-label">{label}</div>
        <div className="parameter-value">{formatValue(value)}</div>
      </div>
      
      <div className="parameter-description">
        {description}
      </div>
      
      <div className="explanation-text">
        {visualType === 'intensity' && 'قدرت بهبود: ملایم -> قوی'}
        {visualType === 'steps' && 'سطح کیفیت: سریع -> بهترین (زمان بیشتر)'}
        {visualType === 'shield' && (value ? 'محتوای امن تضمین شده' : 'بدون فیلتر محتوا')}
        {visualType === 'magic' && 'قدرت اثر: آرام -> قدرتمند'}
      </div>
      
      {renderVisual()}
      
      <div className="parameter-input">
        {renderInput()}
      </div>
    </motion.div>
  );
};

export default ParameterControl;