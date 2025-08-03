import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Tooltip.css';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 500, 
  disabled = false,
  className = '',
  maxWidth = 200,
  showArrow = true,
  trigger = 'hover' // 'hover', 'click', 'focus'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const [actualPosition, setActualPosition] = useState(position);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let top = 0;
    let left = 0;
    let finalPosition = position;

    // Calculate initial position
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + 8;
        break;
      default:
        break;
    }

    // Check if tooltip goes outside viewport and adjust
    if (top < 8) {
      if (position === 'top') {
        top = triggerRect.bottom + 8;
        finalPosition = 'bottom';
      } else {
        top = 8;
      }
    }

    if (top + tooltipRect.height > viewport.height - 8) {
      if (position === 'bottom') {
        top = triggerRect.top - tooltipRect.height - 8;
        finalPosition = 'top';
      } else {
        top = viewport.height - tooltipRect.height - 8;
      }
    }

    if (left < 8) {
      if (position === 'left') {
        left = triggerRect.right + 8;
        finalPosition = 'right';
      } else {
        left = 8;
      }
    }

    if (left + tooltipRect.width > viewport.width - 8) {
      if (position === 'right') {
        left = triggerRect.left - tooltipRect.width - 8;
        finalPosition = 'left';
      } else {
        left = viewport.width - tooltipRect.width - 8;
      }
    }

    setTooltipPosition({ top, left });
    setActualPosition(finalPosition);
  };

  const showTooltip = () => {
    if (disabled || !content) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible, content]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerProps = {
    ref: triggerRef,
    onClick: handleClick,
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip
    })
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && content && (
        <motion.div
          ref={tooltipRef}
          className={`tooltip ${actualPosition} ${className}`}
          style={{
            position: 'fixed',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: maxWidth,
            zIndex: 10000
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          <div className="tooltip-content">
            {typeof content === 'string' ? (
              <span>{content}</span>
            ) : (
              content
            )}
          </div>
          {showArrow && (
            <div className={`tooltip-arrow ${actualPosition}`} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {React.cloneElement(children, triggerProps)}
      {typeof document !== 'undefined' && createPortal(
        tooltipContent,
        document.body
      )}
    </>
  );
};

export default Tooltip;