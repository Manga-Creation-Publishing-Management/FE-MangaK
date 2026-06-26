import { OverviewCard } from '@/shared/components/OverviewCard';
import { WelcomeLine } from '@/shared/components/WelcomeLine';
import { CircleCheckBig, CircleDashed, CircleAlert } from 'lucide-react';
<<<<<<< HEAD
import Feedback from '@/shared/components/Feedback';
=======
import { Feedback } from '@/shared/components/Feedback';
>>>>>>> 66e51d545b446c0a37b0266e73c22c1c5d46291d
import { MyTask } from './MyTask';

// Component Trang chủ (Dashboard) dành riêng cho role Assistant (Trợ lý)
export function AssistantDashboard() {
  return (
    <div className='h-full bg-background'>
      <div className='p-9 bg-background'>
        <WelcomeLine roleName="Assistant" />

        <div className='flex gap-10 xs:flex-col px-9'>
          <OverviewCard contentText="Completed tasks" iconName={<CircleCheckBig size={30} />} iconColor="#34d399" valueNum={3} />
          <OverviewCard contentText="Pending tasks" iconName={<CircleDashed size={30} />} iconColor="#60a5fa" valueNum={3} />
          <OverviewCard contentText="Need to review" iconName={<CircleAlert size={30} />} iconColor="#fbbf24" valueNum={3} />
        </div>

        <div className='pt-3'>
          <MyTask />
        </div>


      </div>
<<<<<<< HEAD
      <div className='mt-5 px-9 pb-10'>
=======
      <div className='mt-5 px-9 mb-10'>
>>>>>>> 66e51d545b446c0a37b0266e73c22c1c5d46291d
        <Feedback />
      </div>
    </div >
  )
}
