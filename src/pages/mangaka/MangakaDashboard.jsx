import { OverviewCard } from '../shared/OverviewCard'
import { WelcomeLine } from '../shared/WelcomeLine'
import { BookOpen } from 'lucide-react'
import { SeriesManagement } from '../shared/SeriesManagement'
import Notification from '../shared/Notification'

export function MangakaDashboard() {
  return (
    <div className='h-full bg-background'>
      <div className='p-9 bg-background'>
        <WelcomeLine roleName="Mangaka" />

        <div className='flex gap-10 xs:flex-col'>
          <OverviewCard contentText="Total series" iconName={<BookOpen size={30} />} iconColor="#60a5fa" valueNum={3} />
          <OverviewCard contentText="Total chapter" iconName={<BookOpen size={30} />} iconColor="#fbbf24" valueNum={3} />
        </div>
      </div>

      <SeriesManagement role="mangaka" />

      <div className='px-9 mb-10'>
        <Notification />
      </div>
    </div >
  )
}
