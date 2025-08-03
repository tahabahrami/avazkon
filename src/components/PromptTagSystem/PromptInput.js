import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import PromptTag from './PromptTag';
import { getPromptById, getAvailablePrompts } from '../../services/promptDatabase';
import './PromptInput.css';

const PromptInput = ({ 
  value = '', 
  onChange, 
  placeholder = 'توضیح تصویر مورد نظر خود را بنویسید...', 
  className = '',
  username = 'current_user'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Initialize from value prop
  useEffect(() => {
    if (value && value !== getCombinedValue()) {
      parseInitialValue(value);
    }
  }, [value]);

  // Parse initial value to extract existing tags
  const parseInitialValue = (text) => {
    const tagPattern = /##(\w{6})/g;
    const foundTags = [];
    let cleanText = text;
    let match;

    while ((match = tagPattern.exec(text)) !== null) {
      const promptId = match[1];
      const prompt = getPromptById(promptId);
      if (prompt) {
        foundTags.push(promptId);
        cleanText = cleanText.replace(match[0], '');
      }
    }

    setTags(foundTags);
    setInputValue(cleanText.trim());
  };

  // Get combined value of input + tags (for display purposes only)
  const getCombinedValue = () => {
    // Return the input value as-is since it contains the tags
    return inputValue;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;
    
    setInputValue(newValue);
    setCursorPosition(position);
    
    // Check for tag pattern ##XXXXXX
    const tagPattern = /##(\w{6})(?=\s|$)/g;
    const matches = [...newValue.matchAll(tagPattern)];
    
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const promptId = lastMatch[1];
      const prompt = getPromptById(promptId);
      
      if (prompt && !tags.includes(promptId)) {
        // Add tag and keep the tag in input for backend processing
        const newTags = [...tags, promptId];
        setTags(newTags);
      }
    }
    
    // Check for partial tag pattern ##XXXXX (5 chars) to show suggestions
    const partialPattern = /##(\w{0,5})$/;
    const partialMatch = newValue.match(partialPattern);
    
    if (partialMatch && partialMatch[1].length >= 2) {
      const partial = partialMatch[1];
      const availablePrompts = getAvailablePrompts(username);
      const filtered = availablePrompts.filter(prompt => 
        prompt.id.startsWith(partial) && !tags.includes(prompt.id)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    
    // Update parent with current input value (single call, no setTimeout)
    onChange && onChange({ target: { value: newValue } });
  };

  // Handle suggestion click
  const handleSuggestionClick = (prompt) => {
    const partialPattern = /##\w*$/;
    const newInputValue = inputValue.replace(partialPattern, `##${prompt.id} `);
    const newTags = [...tags, prompt.id];
    
    setTags(newTags);
    setInputValue(newInputValue);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Update parent with the input value containing the tag
    onChange && onChange({ target: { value: newInputValue } });
    
    // Focus back to input and set cursor position
    inputRef.current?.focus();
    const cursorPos = newInputValue.length;
    inputRef.current?.setSelectionRange(cursorPos, cursorPos);
  };

  // Remove tag
  const removeTag = (tagId) => {
    const newTags = tags.filter(id => id !== tagId);
    setTags(newTags);
    
    // Remove the tag from input text as well
    const tagPattern = new RegExp(`##${tagId}\\s*`, 'g');
    const newInputValue = inputValue.replace(tagPattern, '').trim();
    setInputValue(newInputValue);
    
    // Update parent with the updated input value
    onChange && onChange({ target: { value: newInputValue } });
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`prompt-input-container ${className}`}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="prompt-tags-display">
          {tags.map(tagId => (
            <PromptTag 
              key={tagId} 
              promptId={tagId} 
              onRemove={removeTag}
              username={username}
            />
          ))}
        </div>
      )}
      
      {/* Input Field */}
      <div className="prompt-input-wrapper">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="prompt-input"
          rows={3}
        />
        
        {/* Input Helper */}
        <div className="input-helper">
          <Sparkles size={16} />
          <span>برای استفاده از پرامپت‌های آماده ## و شش رقم تایپ کنید</span>
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown" ref={suggestionsRef}>
            <div className="suggestions-header">
              <Search size={14} />
              <span>پرامپت‌های پیشنهادی</span>
            </div>
            {suggestions.map(prompt => (
              <div 
                key={prompt.id}
                className={`suggestion-item ${prompt.secret ? 'suggestion-premium' : 'suggestion-public'}`}
                onClick={() => handleSuggestionClick(prompt)}
              >
                <div className="suggestion-id">##{ prompt.id}</div>
                <div className="suggestion-content">
                  <div className="suggestion-text">
                    {prompt.secret ? 'پرامپت محرمانه' : prompt.value}
                  </div>
                  {prompt.secret && !prompt.private && (
                    <div className="suggestion-cost">{prompt.cost} اعتبار</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptInput;