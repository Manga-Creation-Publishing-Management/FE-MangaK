import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Component Select tùy chỉnh: thay thế cho thẻ <select> mặc định của trình duyệt
// Giúp dễ dàng style bằng Tailwind CSS và đồng bộ giao diện trên mọi nền tảng
export function CustomSelect({ value, onChange, options, className = '' }) {
  // State quản lý trạng thái Đóng/Mở của menu thả xuống
  const [isOpen, setIsOpen] = useState(false);
  
  // Tham chiếu (Ref) tới phần tử chứa dropdown để xử lý sự kiện click ra ngoài
  const dropdownRef = useRef(null);

  // Tìm option hiện tại dựa trên value được truyền vào, mặc định là phần tử đầu tiên
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Hook dùng để xử lý sự kiện: Khi người dùng click chuột ra ngoài vùng dropdown thì sẽ tự động đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu có click và click đó KHÔNG nằm trong dropdownRef thì đóng menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Gắn sự kiện lắng nghe chuột
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: gỡ sự kiện khi component bị huỷ để tránh rò rỉ bộ nhớ
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // Component gốc chứa ref để bắt sự kiện click outside
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* Nút chính hiển thị giá trị đang được chọn */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-left"
      >
        <span className="truncate">{selectedOption?.label}</span>
        {/* Icon mũi tên chúc xuống */}
        <ChevronDown size={18} className="text-muted-foreground ml-2 flex-shrink-0" />
      </button>

      {/* Vùng thả xuống (Dropdown List) chỉ hiển thị khi isOpen = true */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden py-1">
          {/* max-h-60 overflow-y-auto: Nếu danh sách quá dài thì sẽ có thanh cuộn */}
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  // Cập nhật giá trị mới lên component cha thông qua onChange
                  onChange(option.value);
                  // Đóng menu thả xuống
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${
                  // Đánh dấu đậm và tô màu nền nếu option này đang được chọn
                  value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
