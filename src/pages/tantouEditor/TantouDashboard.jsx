import { OverviewCard } from '@/shared/components/OverviewCard';
import { SeriesManagement } from '../shared/SeriesManagement';
import { WelcomeLine } from '@/shared/components/WelcomeLine';
import { CircleCheckBig, CircleEllipsis, CircleX } from 'lucide-react';
import { Feedback } from '@/shared/components/Feedback';

// Component Trang chủ (Dashboard) dành riêng cho role Tantou Editor (Biên tập viên phụ trách)
export function TantouDashboard() {
    return (
        <div className='h-full bg-background'>
            <div className='p-9 bg-background'>
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
            </div>
            <div className='px-9 mt-5 text-2xl font-medium text-primary'>Assigned Series</div>
            <SeriesManagement role="tantou" statusFilter={["Processing", "PendingBoard", "Rejected", "Approved", "Publishing"]} />

<<<<<<< HEAD
            <div className='mt-5 px-9 pb-10'>
=======
            <div className='px-9 mb-10'>
>>>>>>> 66e51d545b446c0a37b0266e73c22c1c5d46291d
                <Feedback />
            </div>
        </div >
    )
}
