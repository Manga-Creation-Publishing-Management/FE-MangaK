import { useState } from "react";
import CreateSeriesModal from "../../features/series/components/CreateSeriesModal";
// import { Link } from "react-router";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ArrowBigLeft, ArrowDownLeft, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { getPaginationRange } from "../../features/Pagination/hooks/getPaginationRange";
import { getTotalPage } from "../../features/Pagination/hooks/getTotalPage";
import { PaginationCustom } from "../../features/Pagination/components/PaginationCustom";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";

// Component SeriesManagement: Màn hình quản lý danh sách các bộ truyện
export function SeriesManagement({ role, statusFilter, seriesFiltered }) {

  // Lấy ra các hàm điều khiển từ hook useSeriesManagement (như mở popup tạo mới, reload data, chuyển trang)
  const {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate,
    getCroppedImage
  } = useSeriesManagement();

  // Gọi hook useCreateSeries để lấy danh sách series data hiện có
  // Cần truyền biến reload để hook biết khi nào cần fetch lại data (ví dụ sau khi tạo mới thành công)
  const { seriesData } = useCreateSeries(null, handleReload, reload);
  console.log(seriesData);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Biến dùng để chứa dữ liệu các bộ truyện đã được lọc ra để render
  let filteredSeriesData;

  // Nếu prop 'seriesFiltered' được truyền vào từ component cha, ưu tiên sử dụng danh sách này (custom filter từ ngoài)
  if (seriesFiltered) {
    filteredSeriesData = seriesFiltered;
  }
  else {
    // Nếu không, thực hiện lọc theo 'statusFilter' và các bộ lọc nội bộ (search/status)
    filteredSeriesData = seriesData.filter(item => {
      const matchesStatusProp = statusFilter
        ? (Array.isArray(statusFilter) ? statusFilter.includes(item.status) : item.status === statusFilter)
        : true;

      const matchesSearch =
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mangakaName || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        item.status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesStatusProp && matchesSearch && matchesStatus;
    });
  }

  const {
    currentPage,
    postsPerPage,
    setCurrentPage,
    currentDataListDisplay,
    totalPages
  } = getTotalPage(1, 8, filteredSeriesData);

  console.log(role);
  // console.log("Filtered Data for Tantou:", filteredSeriesData);
  // console.log("Filtered Data for Editorial", filteredSeriesData);

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-2">

        <div className="p-4 mb-5">
          {role === "mangaka" && (
            <div className="flex justify-between items-center mb-5 gap-4">


              <div className="flex items-center gap-4 flex-1 justify-end max-w-3xl">
                {!seriesFiltered && role !== "reader" && (
                  <div className="flex-1 max-w-md">
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
                            { value: "created", label: "Created" },
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

                {/* Nút để mở popup tạo bộ truyện mới */}
                <button
                  onClick={handleClick}
                  className="cursor-pointer border-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shrink-0"
                >
                  <Plus />Create New Series
                </button>
              </div>
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
                      { value: "created", label: "Created" },
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

          {currentDataListDisplay?.length === 0 &&
            <p className="text-warning p-2 italic text-lg flex justify-center">No series found</p>}

          {/* Lưới (Grid) hiển thị danh sách các bộ truyện (3 cột) */}
          <div className="grid grid-cols-4 gap-6">
            {currentDataListDisplay?.map(item => (
              // Mỗi bộ truyện hiển thị dưới dạng một Card
              <div key={item.seriesId} className="col-span-1 md:col-span-1 w-full relative  bg-card border 
                                border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">

                {/* Phần Ảnh Bìa (Cover) */}
                <div className=' aspect-[3/4] w-full relative'>
                  <img className="w-full h-full object-cover" src={item.coverFile} alt="cover file" />
                </div>

                {/* Phần Thông Tin Bộ Truyện */}
                <div className="p-2 px-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.totalChapters || 0} Chapters</p>
                  </div>
                  {/* Trạng thái (Processing, Pending, Approved...) */}
                  <StatusBadge status={item?.status.toLowerCase()} />

                  {/* Nút bấm để xem chi tiết bộ truyện */}
                  <button className="cursor-pointer w-full block text-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => handleNavigate(role, item.seriesId)}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Component Modal (Popup) để tạo bộ truyện mới.
          Chỉ render khi state showCreateSeriesModal là true */}
      {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)}

    </>
  )
}
