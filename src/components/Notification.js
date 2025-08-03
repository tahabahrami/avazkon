import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ type = 'info', message, isVisible, onClose, autoClose = true }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'var(--success-color)',
      text: 'var(--success-color)',
      icon: 'var(--success-color)'
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'var(--error-color)',
      text: 'var(--error-color)',
      icon: 'var(--error-color)'
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'var(--accent-color)',
      text: 'var(--text-primary)',
      icon: 'var(--accent-color)'
    }
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="notification"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: `linear-gradient(135deg, ${colorScheme.bg}, rgba(30, 41, 59, 0.8))`,
            border: `1px solid ${colorScheme.border}`,
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '500px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <Icon 
            size={20} 
            style={{ color: colorScheme.icon, flexShrink: 0 }} 
          />
          <span 
            style={{ 
              color: colorScheme.text, 
              fontSize: '14px',
              lineHeight: '1.4',
              flex: 1
            }}
          >
            {message}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colorScheme.text,
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;