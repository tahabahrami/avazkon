import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium', // small, medium, large, extra-large
    screenReader: false,
    keyboardNavigation: true,
    focusVisible: true,
    announcements: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion || prefersHighContrast) {
      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      }));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply CSS classes to document
    const { body } = document;
    
    // High contrast
    body.classList.toggle('high-contrast', settings.highContrast);
    
    // Reduced motion
    body.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Font size
    body.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    body.classList.add(`font-${settings.fontSize}`);
    
    // Focus visible
    body.classList.toggle('focus-visible', settings.focusVisible);
    
    // Screen reader optimizations
    body.classList.toggle('screen-reader', settings.screenReader);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      screenReader: false,
      keyboardNavigation: true,
      focusVisible: true,
      announcements: true
    };
    setSettings(defaultSettings);
  };

  // Announcement function for screen readers
  const announce = (message, priority = 'polite') => {
    if (!settings.announcements) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  const value = {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
    announce
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;