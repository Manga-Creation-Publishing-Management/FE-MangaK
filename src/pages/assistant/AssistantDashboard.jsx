import { OverviewCard } from '../shared/OverviewCard'
import { WelcomeLine } from '../shared/WelcomeLine'
import { CircleCheckBig, CircleDashed, CircleAlert } from 'lucide-react'
import Notification from '../shared/Notification';

export function AssistantDashboard() {
  return (
    <div className='h-full bg-background'>
      <div className='p-9 bg-background'>
        <WelcomeLine roleName="Assistant" />

        <div className='flex gap-10 xs:flex-col'>
          <OverviewCard contentText="Completed tasks" iconName={<CircleCheckBig size={30} />} iconColor="#34d399" valueNum={3} />
          <OverviewCard contentText="Pending tasks" iconName={<CircleDashed size={30} />} iconColor="#60a5fa" valueNum={3} />
          <OverviewCard contentText="Need to review" iconName={<CircleAlert size={30} />} iconColor="#fbbf24" valueNum={3} />
        </div>

        <div className='pt-3'>Đây là chỗ cho component TaskManagement</div>


      </div>
      <div className='mt-5 px-9 mb-10'>
        <Notification />
      </div>
    </div >
  )
}
