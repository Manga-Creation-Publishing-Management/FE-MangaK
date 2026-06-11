import { OverviewCard } from '../shared/OverviewCard'
import { SeriesManagement } from '../shared/SeriesManagement'
import { WelcomeLine } from '../shared/WelcomeLine'
import { CircleCheckBig, CircleEllipsis, CircleX } from 'lucide-react'

// Component Trang chủ (Dashboard) dành riêng cho role Tantou Editor (Biên tập viên phụ trách)
export function TantouDashboard() {
    return (
        // Vỏ bao full chiều cao
        <div className='h-screen p-2 bg-background'>
            <div className='p-5 bg-background'>
                
                {/* Lời chào đầu trang */}
                <WelcomeLine roleName="Tantou Editor" />

                {/* Các thẻ (Card) tổng quan trạng thái công việc của Tantou */}
                <div className='flex gap-10 xs:flex-col'>
                    <OverviewCard contentText="Processing Series" iconName={<CircleEllipsis size={30} />}
                        iconColor="#60a5fa" valueNum={3} />
                    <OverviewCard contentText="Approved Series" iconName={<CircleCheckBig size={30} />}
                        iconColor="#34d399" valueNum={5} />
                    <OverviewCard contentText="Rejected Series" iconName={<CircleX size={30} />}
                        iconColor="#fbbf24" valueNum={3} />
                </div>

                {/* Danh sách các bộ truyện được phân công (Assigned Series) */}
                <div className='p-3 mt-5 ml-1 text-2xl font-medium text-foreground'>Assigned Series</div>
                <SeriesManagement role="tantouEditor" statusFilter={["Processing", "PendingBoard", "Rejected", "Approved"]} />

                {/* Placeholder: Vùng dự định làm Mailbox/Feedback */}
                <div>Div này cho Mailbox (feedback)</div>
            </div>
        </div >
    )
}
