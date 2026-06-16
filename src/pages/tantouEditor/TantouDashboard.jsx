import { OverviewCard } from '../shared/OverviewCard'
import { SeriesManagement } from '../shared/SeriesManagement'
import { WelcomeLine } from '../shared/WelcomeLine'
import { CircleCheckBig, CircleEllipsis, CircleX } from 'lucide-react'
import { Notification } from '../shared/Notification'

export function TantouDashboard() {
    return (
        <div className='h-full bg-background'>
            <div className='p-9 bg-background'>
                <WelcomeLine roleName="Tantou Editor" />

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

            <div className='px-9 mb-10'>
                <Notification />
            </div>
        </div >
    )
}
