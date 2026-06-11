import { OverviewCard } from '../shared/OverviewCard'
import { WelcomeLine } from '../shared/WelcomeLine'
import { BookOpen } from 'lucide-react'
import { SeriesManagement } from '../shared/SeriesManagement'

// Component Trang chủ (Dashboard) dành riêng cho role Mangaka (Tác giả)
export function MangakaDashboard() {
  return (
    // Vỏ ngoài thiết lập full height và padding
    <div className='h-screen p-2 bg-background'>
      <div className='p-5 bg-background'>
        
        {/* Lời chào đầu trang */}
        <WelcomeLine roleName="Mangaka" />

        {/* Khung chứa các thẻ thống kê tổng quan. 
            Responsive: Ở màn hình nhỏ (xs) sẽ tự động xếp dọc (flex-col) */}
        <div className='flex gap-10 xs:flex-col'>
          <OverviewCard contentText="Total series" iconName={<BookOpen size={30} />} iconColor="#60a5fa" valueNum={3} />
          <OverviewCard contentText="Total chapter" iconName={<BookOpen size={30} />} iconColor="#fbbf24" valueNum={3} />
        </div>

        {/* Component Quản lý Danh sách Truyện, truyền role='mangaka' để giao diện hiển thị phù hợp (như có nút Create) */}
        <SeriesManagement role="mangaka" />

      </div>
    </div >
  )
}
