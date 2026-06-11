import { OverviewCard } from '../shared/OverviewCard'
import { WelcomeLine } from '../shared/WelcomeLine'
import { CircleCheckBig, CircleDashed, CircleAlert } from 'lucide-react'

// Component Trang chủ (Dashboard) dành riêng cho role Assistant (Trợ lý)
export function AssistantDashboard() {
  return (
    // Vỏ ngoài thiết lập full height
    <div className='h-screen p-2 bg-background'>
      <div className='p-5 bg-background'>
        
        {/* Lời chào đầu trang */}
        <WelcomeLine roleName="Assistant" />

        {/* Cụm thống kê công việc của Assistant */}
        <div className='flex gap-10 xs:flex-col'>
          <OverviewCard contentText="Completed tasks" iconName={<CircleCheckBig size={30} />} iconColor="#34d399" valueNum={3} />
          <OverviewCard contentText="Pending tasks" iconName={<CircleDashed size={30} />} iconColor="#60a5fa" valueNum={3} />
          <OverviewCard contentText="Need to review" iconName={<CircleAlert size={30} />} iconColor="#fbbf24" valueNum={3} />
        </div>

        {/* Placeholder: Khu vực dự kiến hiển thị component TaskManagement */}
        <div className='pt-3'>Đây là chỗ cho component TaskManagement</div>

        {/* Placeholder: Khu vực dự kiến hiển thị hộp thư hoặc nhận xét (feedback) */}
        <div>Div này cho Mailbox (feedback)</div>

      </div>
    </div >
  )
}
