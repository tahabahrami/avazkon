import React, { useState } from 'react';
import { Lock, AlertCircle, Star } from 'lucide-react';
import { getPromptById, hasPromptAccess } from '../../services/promptDatabase';
import './PromptTag.css';

const PromptTag = ({ promptId, onRemove, username = 'current_user' }) => {
  const prompt = getPromptById(promptId);
  const hasAccess = hasPromptAccess(promptId, username);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleTouchStart = () => setShowTooltip(true);
  const handleTouchEnd = () => setTimeout(() => setShowTooltip(false), 2000);

  if (!prompt) {
    return (
      <span className="prompt-tag prompt-tag-error">
        <AlertCircle size={14} />
        <span>نامعتبر: {promptId}</span>
        {onRemove && (
          <button 
            className="tag-remove" 
            onClick={() => onRemove(promptId)}
            aria-label="حذف تگ"
          >
            ×
          </button>
        )}
      </span>
    );
  }

  const renderTooltip = () => {
    if (!showTooltip || !prompt.creator) return null;
    
    return (
      <div className="prompt-tooltip">
        <div className="tooltip-content">
          <img 
            src={prompt.thumbnail} 
            alt="نمونه نتیجه" 
            className="tooltip-thumbnail"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Y2EzYWYiLz4KPHBhdGggZD0iTTMwIDEwSDEwQzguOSAxMCA4IDEwLjkgOCAxMlYyOEM4IDI5LjEgOC45IDMwIDEwIDMwSDMwQzMxLjEgMzAgMzIgMjkuMSAzMiAyOFYxMkMzMiAxMC45IDMxLjEgMTAgMzAgMTBaTTMwIDI4SDEwVjEySDMwVjI4WiIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4K';
            }}
          />
          <div className="tooltip-info">
            <span className="tooltip-creator">سازنده: {prompt.creator}</span>
          </div>
        </div>
      </div>
    );
  };

  // Secret and private - no access
  if (prompt.secret && prompt.private && !hasAccess) {
    return (
      <span 
        className="prompt-tag prompt-tag-restricted"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Lock size={14} />
        <span>دسترسی محدود</span>
        {onRemove && (
          <button 
            className="tag-remove" 
            onClick={() => onRemove(promptId)}
            aria-label="حذف تگ"
          >
            ×
          </button>
        )}
        {renderTooltip()}
      </span>
    );
  }

  // Secret but not private - show cost but hide prompt value
  if (prompt.secret && !prompt.private) {
    return (
      <span 
        className="prompt-tag prompt-tag-premium"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Lock size={14} />
        <span className="tag-content">
          <span className="tag-text">پرامپت محرمانه</span>
          <span className="tag-cost">{prompt.cost} اعتبار</span>
        </span>
        {onRemove && (
          <button 
            className="tag-remove" 
            onClick={() => onRemove(promptId)}
            aria-label="حذف تگ"
          >
            ×
          </button>
        )}
        {renderTooltip()}
      </span>
    );
  }

  // Public prompt
  return (
    <span 
      className="prompt-tag prompt-tag-public"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Star size={14} />
      <span className="tag-text">{prompt.value}</span>
      {onRemove && (
        <button 
          className="tag-remove" 
          onClick={() => onRemove(promptId)}
          aria-label="حذف تگ"
        >
          ×
        </button>
      )}
      {renderTooltip()}
    </span>
  );
};

export default PromptTag;