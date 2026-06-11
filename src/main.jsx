import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './app/App.jsx'

// File main.jsx: Điểm bắt đầu (Entry point) của toàn bộ ứng dụng React
// Nhiệm vụ: Tìm thẻ div có id="root" trong index.html và render ứng dụng vào đó

createRoot(document.getElementById('root')).render(
  // StrictMode là một công cụ giúp làm nổi bật các vấn đề tiềm ẩn trong ứng dụng
  // (Nó có thể làm cho các component render 2 lần trong chế độ phát triển để phát hiện lỗi side-effect)
  <StrictMode>
    {/* Component gốc bao bọc tất cả các màn hình */}
    <App />
  </StrictMode>,
)
