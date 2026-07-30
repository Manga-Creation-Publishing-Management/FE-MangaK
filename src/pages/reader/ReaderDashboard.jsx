import { SeriesManagement } from '@/pages/shared/SeriesManagement';
import { useSearch } from '@/features/series/hooks/useSearch';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar';
import useSeriesList from '@/features/series/hooks/useSeriesList';

export function ReaderDashboard() {
    const { seriesData, isLoading } = useSeriesList();
    const { searchTxt, searchResult, handleSearch } = useSearch(seriesData);

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

                <SeriesManagement
                    role="reader"
                    statusFilter="Publishing"
                    seriesFiltered={searchTxt.length > 0 ? searchResult : undefined}
                />

            </div>
        </div>
    )
}