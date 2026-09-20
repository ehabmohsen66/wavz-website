import { useState, useRef } from 'react';

const PRESET_TAGS = [
  'AI',
  'Cybersecurity',
  'Cloud',
  'SAP',
  'FinTech',
  'Digital Transformation',
  'Banking',
  'Managed Services',
  'IT Testing'
];

export default function TagInput({ value = '', onChange, label = 'Tags', required = false }) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Parse value into array
  const tagsList = typeof value === 'string'
    ? value.split(',').map(t => t.trim()).filter(Boolean)
    : (Array.isArray(value) ? value : []);

  const updateTags = (newTags) => {
    // Save as comma-separated string for compatibility with backend
    onChange(newTags.join(', '));
  };

  const handleAddTag = (rawTag) => {
    const trimmed = rawTag.trim();
    if (!trimmed) return;
    // Don't add duplicate
    if (!tagsList.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      updateTags([...tagsList, trimmed]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (indexToRemove) => {
    updateTags(tagsList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tagsList.length > 0) {
      e.preventDefault();
      handleRemoveTag(tagsList.length - 1);
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <span style={{ fontSize: 11, color: tagsList.length > 0 ? '#1173BD' : '#94a3b8', fontWeight: 600 }}>
          {tagsList.length} {tagsList.length === 1 ? 'tag' : 'tags'} added
        </span>
      </div>

      {/* Main Tag Container Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          minHeight: 44,
          padding: '6px 10px',
          border: `1.5px solid ${isFocused ? '#1173BD' : (required && tagsList.length === 0 ? '#fca5a5' : '#CBD5E1')}`,
          borderRadius: 8,
          background: '#FFFFFF',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          alignItems: 'center',
          cursor: 'text',
          boxShadow: isFocused ? '0 0 0 3px rgba(17,115,189,0.15)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        {tagsList.map((tag, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1E40AF',
              fontSize: 12,
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(idx);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'rgba(30,64,175,0.15)',
                color: '#1E40AF',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
                padding: 0
              }}
              title="Remove tag"
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (inputValue.trim()) {
              handleAddTag(inputValue);
            }
          }}
          placeholder={tagsList.length === 0 ? 'Type a tag and press Enter or comma...' : 'Add another tag...'}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            minWidth: 160,
            fontSize: 13,
            color: '#1e293b',
            background: 'transparent',
            padding: '4px 2px'
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <div style={{ fontSize: 11, color: '#64748B' }}>
          Press <kbd style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4, border: '1px solid #cbd5e1' }}>Enter</kbd> or <kbd style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4, border: '1px solid #cbd5e1' }}>,</kbd> to add tag
        </div>
      </div>

      {/* Suggested Tags */}
      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Suggestions:</span>
        {PRESET_TAGS.map(preset => {
          const alreadyAdded = tagsList.some(t => t.toLowerCase() === preset.toLowerCase());
          return (
            <button
              key={preset}
              type="button"
              onClick={() => handleAddTag(preset)}
              disabled={alreadyAdded}
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px dashed #CBD5E1',
                background: alreadyAdded ? '#F1F5F9' : '#FFFFFF',
                color: alreadyAdded ? '#94A3B8' : '#334155',
                cursor: alreadyAdded ? 'default' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {alreadyAdded ? `✓ ${preset}` : `+ ${preset}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
