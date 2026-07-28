import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export function CustomSelect({ value, onChange, options, className = '', name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUpward: false });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;

      setCoords({
        top: openUpward ? rect.top - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        openUpward,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updateCoords();

    const handleScrollOrResize = (event) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      updateCoords();
    };

    const handleClickOutside = (event) => {
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      if (isOutsideButton && isOutsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updateCoords]);

  return (
    <div className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-left"
      >
        <span className="truncate text-foreground">{selectedOption?.label}</span>
        <ChevronDown size={18} className="text-muted-foreground ml-2 flex-shrink-0" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              transform: coords.openUpward ? 'translateY(-100%)' : 'none',
              zIndex: 9999,
            }}
            className="bg-card border border-border rounded-lg shadow-xl overflow-hidden py-1"
          >
            <ul className="max-h-60 overflow-y-auto no-scrollbar">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${
                    value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}

