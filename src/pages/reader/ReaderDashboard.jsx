// import { OverviewCard } from '../shared/OverviewCard'
import { WelcomeLine } from '../shared/WelcomeLine'
import { Search } from 'lucide-react'
import { SeriesManagement } from '../shared/SeriesManagement'

export function ReaderDashboard() {
    return (
        <div className='h-screen p-2 bg-background'>
            <div className='p-5 bg-background'>
                <WelcomeLine roleName="Reader" />

                {/* <div className='flex gap-10 xs:flex-col'>
                    <OverviewCard contentText="Series Available" iconName={<BookOpen size={30} />} iconColor="#60a5fa" valueNum={15} />
                    <OverviewCard contentText="Chapter to vote" iconName={<BookOpen size={30} />} iconColor="#fbbf24" valueNum={200} />
                    </div> */}

                <div className='p-3 bg-card rounded-lg border border-border hover:shadow'>
                    <p className='p-3 pb-5 text-muted-foreground '>Search for a series and rate your favourite chapters</p>
                    <div className='p-3 bg-muted rounded-full flex gap-3'>
                        <Search color='rgba(123, 100, 138, 1)' />
                        <input className='bg-transparent w-full' type="text" placeholder='Search series by name ... ' />
                    </div>
                </div>

                <SeriesManagement role="reader" />

            </div>
        </div >
    )
}
