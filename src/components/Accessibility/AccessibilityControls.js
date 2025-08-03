import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Volume2, Type, Contrast, Zap, RotateCcw, X } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';
import './AccessibilityControls.css';

const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, toggleSetting, resetSettings, announce } = useAccessibility();

  const handleToggle = (setting, label) => {
    toggleSetting(setting);
    announce(`${label} ${!settings[setting] ? 'enabled' : 'disabled'}`);
  };

  const handleFontSizeChange = (size) => {
    updateSetting('fontSize', size);
    announce(`Font size changed to ${size}`);
  };

  const handleReset = () => {
    resetSettings();
    announce('Accessibility settings reset to default');
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' }
  ];

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility controls"
        aria-expanded={isOpen}
      >
        <Settings size={20} />
        <span className="sr-only">Accessibility Settings</span>
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="accessibility-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="accessibility-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="accessibility-header">
                <h2 id="accessibility-title">
                  <Settings size={20} />
                  Accessibility Settings
                </h2>
                <button
                  className="close-button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close accessibility settings"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Controls */}
              <div className="accessibility-content">
                {/* Visual Settings */}
                <div className="setting-group">
                  <h3>
                    <Eye size={16} />
                    Visual
                  </h3>
                  
                  <div className="setting-item">
                    <label className="setting-label">
                      <Contrast size={16} />
                      <span>High Contrast</span>
                      <p className="setting-description">Increases contrast for better visibility</p>
                    </label>
                    <button
                      className={`toggle-button ${settings.highContrast ? 'active' : ''}`}
                      onClick={() => handleToggle('highContrast', 'High contrast')}
                      aria-pressed={settings.highContrast}
                      aria-label="Toggle high contrast mode"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  <div className="setting-item">
                    <label className="setting-label">
                      <Zap size={16} />
                      <span>Reduced Motion</span>
                      <p className="setting-description">Reduces animations and transitions</p>
                    </label>
                    <button
                      className={`toggle-button ${settings.reducedMotion ? 'active' : ''}`}
                      onClick={() => handleToggle('reducedMotion', 'Reduced motion')}
                      aria-pressed={settings.reducedMotion}
                      aria-label="Toggle reduced motion"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  <div className="setting-item">
                    <label className="setting-label">
                      <Eye size={16} />
                      <span>Focus Indicators</span>
                      <p className="setting-description">Shows focus outlines for keyboard navigation</p>
                    </label>
                    <button
                      className={`toggle-button ${settings.focusVisible ? 'active' : ''}`}
                      onClick={() => handleToggle('focusVisible', 'Focus indicators')}
                      aria-pressed={settings.focusVisible}
                      aria-label="Toggle focus indicators"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>
                </div>

                {/* Typography */}
                <div className="setting-group">
                  <h3>
                    <Type size={16} />
                    Typography
                  </h3>
                  
                  <div className="setting-item">
                    <label className="setting-label">
                      <span>Font Size</span>
                      <p className="setting-description">Adjust text size for better readability</p>
                    </label>
                    <div className="font-size-options">
                      {fontSizeOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`font-size-button ${settings.fontSize === option.value ? 'active' : ''}`}
                          onClick={() => handleFontSizeChange(option.value)}
                          aria-pressed={settings.fontSize === option.value}
                          aria-label={`Set font size to ${option.label}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="setting-group">
                  <h3>
                    <Volume2 size={16} />
                    Audio
                  </h3>
                  
                  <div className="setting-item">
                    <label className="setting-label">
                      <Volume2 size={16} />
                      <span>Screen Reader Announcements</span>
                      <p className="setting-description">Enables audio announcements for actions</p>
                    </label>
                    <button
                      className={`toggle-button ${settings.announcements ? 'active' : ''}`}
                      onClick={() => handleToggle('announcements', 'Screen reader announcements')}
                      aria-pressed={settings.announcements}
                      aria-label="Toggle screen reader announcements"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  <div className="setting-item">
                    <label className="setting-label">
                      <Volume2 size={16} />
                      <span>Screen Reader Mode</span>
                      <p className="setting-description">Optimizes interface for screen readers</p>
                    </label>
                    <button
                      className={`toggle-button ${settings.screenReader ? 'active' : ''}`}
                      onClick={() => handleToggle('screenReader', 'Screen reader mode')}
                      aria-pressed={settings.screenReader}
                      aria-label="Toggle screen reader mode"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>
                </div>

                {/* Reset */}
                <div className="setting-group">
                  <button
                    className="reset-button"
                    onClick={handleReset}
                    aria-label="Reset all accessibility settings to default"
                  >
                    <RotateCcw size={16} />
                    Reset to Default
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityControls;