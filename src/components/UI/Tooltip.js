import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import './Tooltip.css';

const Tooltip = ({
  children,
  content,
  position = 'top',
  trigger = 'hover',
  delay = 300,
  disabled = false,
  className = '',
  maxWidth = 250,
  showArrow = true,
  interactive = false,
  offset = 8,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let x = 0;
    let y = 0;
    let finalPosition = position;

    // Calculate initial position
    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      default:
        break;
    }

    // Check if tooltip goes outside viewport and adjust
    if (x < 10) {
      if (position === 'left') {
        finalPosition = 'right';
        x = triggerRect.right + offset;
      } else {
        x = 10;
      }
    } else if (x + tooltipRect.width > viewport.width - 10) {
      if (position === 'right') {
        finalPosition = 'left';
        x = triggerRect.left - tooltipRect.width - offset;
      } else {
        x = viewport.width - tooltipRect.width - 10;
      }
    }

    if (y < 10) {
      if (position === 'top') {
        finalPosition = 'bottom';
        y = triggerRect.bottom + offset;
      } else {
        y = 10;
      }
    } else if (y + tooltipRect.height > viewport.height - 10) {
      if (position === 'bottom') {
        finalPosition = 'top';
        y = triggerRect.top - tooltipRect.height - offset;
      } else {
        y = viewport.height - tooltipRect.height - 10;
      }
    }

    setTooltipPosition({ x, y });
    setActualPosition(finalPosition);
  };

  // Show tooltip
  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (interactive) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    } else {
      setIsVisible(false);
    }
  };

  // Handle tooltip hover (for interactive tooltips)
  const handleTooltipEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleTooltipLeave = () => {
    if (interactive) {
      hideTooltip();
    }
  };

  // Handle click trigger
  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  // Handle focus trigger
  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isVisible) {
      setIsVisible(false);
    }
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (trigger === 'click' && isVisible && 
          triggerRef.current && !triggerRef.current.contains(e.target) &&
          tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible && trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, trigger]);

  // Trigger props based on trigger type
  const getTriggerProps = () => {
    const props = {
      ref: triggerRef,
      onKeyDown: handleKeyDown
    };

    if (trigger === 'hover') {
      props.onMouseEnter = showTooltip;
      props.onMouseLeave = hideTooltip;
    } else if (trigger === 'click') {
      props.onClick = handleClick;
    } else if (trigger === 'focus') {
      props.onFocus = handleFocus;
      props.onBlur = handleBlur;
    }

    return props;
  };

  // Render tooltip content
  const renderTooltip = () => {
    if (!isVisible || !content) return null;

    return createPortal(
      <AnimatePresence>
        <motion.div
          ref={tooltipRef}
          className={`tooltip tooltip--${actualPosition} ${className}`}
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            maxWidth,
            zIndex: 9999
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
          role="tooltip"
          aria-hidden={!isVisible}
          {...props}
        >
          {showArrow && (
            <div className={`tooltip__arrow tooltip__arrow--${actualPosition}`} />
          )}
          <div className="tooltip__content">
            {typeof content === 'string' ? (
              <span>{content}</span>
            ) : (
              content
            )}
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      {React.cloneElement(children, {
        ...getTriggerProps(),
        'aria-describedby': isVisible ? 'tooltip' : undefined
      })}
      {renderTooltip()}
    </>
  );
};

export default Tooltip;