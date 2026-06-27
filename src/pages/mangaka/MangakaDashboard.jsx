import { OverviewCard } from '@/shared/components/OverviewCard';
import { WelcomeLine } from '@/shared/components/WelcomeLine';
import { BookOpen } from 'lucide-react';
import { SeriesManagement } from '../shared/SeriesManagement';
import { Feedback } from '@/shared/components/Feedback';

// Component Trang chủ (Dashboard) dành riêng cho role Mangaka (Tác giả)
export function MangakaDashboard() {
  return (
    <div className='h-full bg-background'>
      <div className='p-9 bg-background'>
        <WelcomeLine roleName="Mangaka" />

        {/* Khung chứa các thẻ thống kê tổng quan. 
            Responsive: Ở màn hình nhỏ (xs) sẽ tự động xếp dọc (flex-col) */}
        <div className='flex gap-10 xs:flex-col'>
          <OverviewCard contentText="Total series" iconName={<BookOpen size={30} />} iconColor="#60a5fa" valueNum={3} />
          <OverviewCard contentText="Total chapter" iconName={<BookOpen size={30} />} iconColor="#fbbf24" valueNum={3} />
        </div>
      </div>

      <SeriesManagement role="mangaka" />

      <div className='px-9 mb-10'>
        <Feedback />
      </div>
    </div >
  )
}
