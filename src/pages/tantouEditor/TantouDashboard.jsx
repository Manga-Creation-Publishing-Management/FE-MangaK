import { OverviewCard } from '../shared/OverviewCard'
import { SeriesManagement } from '../shared/SeriesManagement'
import { WelcomeLine } from '../shared/WelcomeLine'
import { CircleCheckBig, CircleEllipsis, CircleX } from 'lucide-react'

export function TantouDashboard() {
    return (
        <div className='h-screen p-2 bg-background'>
            <div className='p-5 bg-background'>
                <WelcomeLine roleName="Tantou Editor" />

                <div className='flex gap-10 xs:flex-col'>
                    <OverviewCard contentText="Processing Series" iconName={<CircleEllipsis size={30} />}
                        iconColor="#60a5fa" valueNum={3} />
                    <OverviewCard contentText="Approved Series" iconName={<CircleCheckBig size={30} />}
                        iconColor="#34d399" valueNum={5} />
                    <OverviewCard contentText="Rejected Series" iconName={<CircleX size={30} />}
                        iconColor="#fbbf24" valueNum={3} />
                </div>

                <div className='p-3 mt-2 text-2xl font-medium text-foreground'>Assigned Series</div>
                <SeriesManagement role="tantou" />

                <div>Div này cho Mailbox (feedback)</div>
            </div>
        </div >
    )
}
