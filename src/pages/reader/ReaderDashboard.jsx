import { SeriesManagement } from '@/pages/shared/SeriesManagement';
import { useSearch } from '@/features/series/hooks/useSearch';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar';

export function ReaderDashboard() {
    const { searchTxt, searchResult, handleSearch } = useSearch();

    return (
        <div className='p-5 bg-background'>
            <div className='mx-3 bg-card rounded-xl border border-border p-6 space-y-6'>

                <div className="max-w-md mx-auto">
                    <SearchFilterBar
                        searchQuery={searchTxt}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search series by name..."
                        useCardWrapper={false}
                    />
                </div>

                {searchTxt.length > 0
                    ? (searchResult.length === 0
                        ? <div className='p-6 text-warning'>There is no series matches</div>
                        : <SeriesManagement role="reader" seriesFiltered={searchResult} />
                    )
                    : <SeriesManagement role="reader" statusFilter={"Publishing"} />
                }

            </div>
        </div>
    )
}