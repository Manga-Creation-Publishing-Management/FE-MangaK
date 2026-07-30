import { useState } from 'react';
import CreateSeriesModal from '@/features/series/components/CreateSeriesModal';
import { useSeriesManagement } from '@/features/series/hooks/useSeriesManagement';
import useSeriesList from '@/features/series/hooks/useSeriesList';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Loader2, Plus } from 'lucide-react';
import { getTotalPage } from '@/features/pagination/hooks/getTotalPage';
import { PaginationCustom } from '@/features/pagination/components/PaginationCustom';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar';

export function SeriesManagement({ role, statusFilter, seriesFiltered, headerControls }) {

  const {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate
  } = useSeriesManagement();

  const { seriesData, isLoading } = useSeriesList(reload);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  let filteredSeriesData;

  if (seriesFiltered) {
    filteredSeriesData = seriesFiltered;
  } else {
    filteredSeriesData = seriesData.filter(item => {
      const matchesStatusProp = statusFilter
        ? (Array.isArray(statusFilter) ? statusFilter.includes(item.status) : item.status === statusFilter)
        : true;

      const matchesSearch =
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mangakaName || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all"
          ? item.status?.toLowerCase() !== "rejected"
          : item.status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesStatusProp && matchesSearch && matchesStatus;
    });
  }

  const {
    currentPage,
    setCurrentPage,
    currentDataListDisplay,
    totalPages
  } = getTotalPage(1, 8, filteredSeriesData);

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6">

        <div className="mb-5">
          {headerControls ? (
            <div className="mb-6">{headerControls}</div>
          ) : (
            <>
              {role === "mangaka" && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-4">
                  <div className="flex-1 w-full max-w-xl">
                    {!seriesFiltered && role !== "reader" && (
                      <SearchFilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Search by title..."
                        useCardWrapper={false}
                        filters={[
                          {
                            value: filterStatus,
                            onChange: setFilterStatus,
                            options: [
                              { value: "all", label: "All Status" },
                              { value: "processing", label: "Processing" },
                              { value: "pending", label: "Pending" },
                              { value: "approved", label: "Approved" },
                              { value: "publishing", label: "Publishing" },
                              { value: "scheduled", label: "Scheduled" },
                              { value: "rejected", label: "Rejected" },
                              { value: "cancelled", label: "Cancelled" }
                            ]
                          }
                        ]}
                      />
                    )}
                  </div>

                  <button
                    onClick={handleClick}
                    className="cursor-pointer border-2 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto"
                  >
                    <Plus />Create New Series
                  </button>
                </div>
              )}

              {role !== "mangaka" && !seriesFiltered && role !== "reader" && (
                <div className="mb-6">
                  <SearchFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search by title..."
                    useCardWrapper={false}
                    filters={[
                      {
                        value: filterStatus,
                        onChange: setFilterStatus,
                        options: [
                          { value: "all", label: "All Status" },
                          { value: "processing", label: "Processing" },
                          { value: "pending", label: "Pending" },
                          { value: "approved", label: "Approved" },
                          { value: "publishing", label: "Publishing" },
                          { value: "scheduled", label: "Scheduled" },
                          { value: "rejected", label: "Rejected" },
                          { value: "cancelled", label: "Cancelled" }
                        ]
                      }
                    ]}
                  />
                </div>
              )}
            </>
          )}

          {role !== "mangaka" && !seriesFiltered && role !== "reader" && (
            <div className="mb-6">
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by title..."
                useCardWrapper={false}
                filters={[
                  {
                    value: filterStatus,
                    onChange: setFilterStatus,
                    options: [
                      { value: "all", label: "All Status" },
                      { value: "processing", label: "Processing" },
                      { value: "pending", label: "Pending" },
                      { value: "approved", label: "Approved" },
                      { value: "publishing", label: "Publishing" },
                      { value: "scheduled", label: "Scheduled" },
                      { value: "rejected", label: "Rejected" },
                      { value: "cancelled", label: "Cancelled" }
                    ]
                  }
                ]}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading series...</span>
              </div>
            ) : currentDataListDisplay.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-8 text-muted-foreground">
                <p className="text-sm text-accent">No series found.</p>
              </div>
            ) : (
              currentDataListDisplay?.map(item => (
                <div key={item.seriesId} className="w-full relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  
                  <div className=' aspect-[3/4] w-full relative'>
                    <img className="w-full h-full object-cover" src={item.coverFile} alt="cover file" />
                  </div>

                  <div className="p-3 sm:p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold truncate sm:text-lg text-card-foreground line-clamp-1">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.totalChapters || 0} Chapters</p>
                    </div>
                    <StatusBadge status={item?.status.toLowerCase()} />

                    <button className="cursor-pointer w-full block text-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      onClick={() => handleNavigate(role, item.seriesId)}
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div >

      {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)}

    </>
  )
}
