
import { WelcomeLine } from '../shared/WelcomeLine'
import { Search } from 'lucide-react'
import { SeriesManagement } from '../shared/SeriesManagement'
import { useSearch } from '../../features/series/hooks/useSearch'
import { HeaderPage } from '../shared/HeaderPage';
import avatarImgDemo from "../shared/avatarImgDemo.png";
import { Outlet } from 'react-router';

export function ReaderDashboard() {
    const { searchTxt, searchResult, handleSearch } = useSearch();

    return (
        <div className='h-screen p-2 bg-background'>
            <HeaderPage roleName="Reader" avatarUrl={avatarImgDemo} />
            <div className='p-5 bg-background'>
                <WelcomeLine roleName="Reader" />

                <div className='p-3 mx-3 bg-card rounded-lg border border-border hover:shadow'>
                    <p className='p-3 pb-5 text-muted-foreground '>Search for a series and rate your favourite chapters</p>
                    <div className='p-3 bg-muted rounded-full flex gap-3 hover:border-2 hover:border-primary'>
                        <Search color='rgba(123, 100, 138, 1)' />
                        <input className='w-full focus:outline-none ' type="text"
                            placeholder='Search series by name ... '
                            onChange={(e) => { handleSearch(e.target.value) }} />
                    </div>
                </div>


                {searchTxt.length > 0
                    ? (searchResult.length === 0
                        ? <div className='p-6 text-warning'>There is no series matches</div>
                        : <SeriesManagement role="reader" seriesFiltered={searchResult} />
                    )
                    : <SeriesManagement role="reader" statusFilter={"Publishing"} />}

            </div>
        </div >
    )
}
