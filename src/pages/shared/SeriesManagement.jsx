import { useState } from "react";
import CreateSeriesModal from "@/features/series/components/CreateSeriesModal";
import { useSeriesManagement } from "@/features/series/hooks/useSeriesManagement";
import useCreateSeries from "@/features/series/hooks/useCreateSeries";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Plus } from "lucide-react";
import { getTotalPage } from "@/features/Pagination/hooks/getTotalPage";
import { PaginationCustom } from "@/features/Pagination/components/PaginationCustom";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";


export function SeriesManagement({ role, statusFilter, seriesFiltered }) {

  const {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate
  } = useSeriesManagement();

  const { seriesData } = useCreateSeries(null, handleReload, reload);

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
      <div className="bg-card border border-border rounded-xl p-2">

        <div className="p-4 mb-5">
          {role === "mangaka" && (
            <div className="flex justify-between items-center mb-5 gap-4">
              <div className="flex-1 max-w-xl">
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
                className="cursor-pointer border-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shrink-0"
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

          <div className="grid grid-cols-4 gap-6">
            {currentDataListDisplay.length === 0 ?
              (<div className="text-center py-8 text-muted-foreground">
                <p className="text-sm text-accent">No series found.</p>
              </div>)
              : (currentDataListDisplay?.map(item => (
                <div key={item.seriesId} className="col-span-1 md:col-span-1 w-full relative  bg-card border 
                                border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">

                  <div className=' aspect-[3/4] w-full relative'>
                    <img className="w-full h-full object-cover" src={item.coverFile} alt="cover file" />
                  </div>

                  <div className="p-2 px-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.totalChapters || 0} Chapters</p>
                    </div>
                    <StatusBadge status={item?.status.toLowerCase()} />

                    <button className="cursor-pointer w-full block text-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      onClick={() => handleNavigate(role, item.seriesId)}
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              )))
            }
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
