import CreateSeriesModal from "../../features/series/components/CreateSeriesModal";
// import { Link } from "react-router";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { StatusBadge } from "./StatusBadge";

// Component SeriesManagement: Màn hình quản lý danh sách các bộ truyện
export function SeriesManagement({ role, statusFilter, seriesFiltered }) {

  // Lấy ra các hàm điều khiển từ hook useSeriesManagement (như mở popup tạo mới, reload data, chuyển trang)
  const {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate
  } = useSeriesManagement();

  // Gọi hook useCreateSeries để lấy danh sách series data hiện có
  // Cần truyền biến reload để hook biết khi nào cần fetch lại data (ví dụ sau khi tạo mới thành công)
  const { seriesData } = useCreateSeries(null, handleReload, reload);
  console.log(seriesData);

  // Biến dùng để chứa dữ liệu các bộ truyện đã được lọc ra để render
  let filteredSeriesData;

  // Nếu prop 'seriesFiltered' được truyền vào từ component cha, ưu tiên sử dụng danh sách này (custom filter từ ngoài)
  if (seriesFiltered) {
    filteredSeriesData = seriesFiltered;
  }
  else {
    // Nếu không, thực hiện lọc theo 'statusFilter' (nếu có). 
    // Ví dụ statusFilter = ['pending', 'processing'] sẽ giữ lại các truyện có status nằm trong mảng đó
    filteredSeriesData = statusFilter
      ? seriesData.filter(item => statusFilter.includes(item.status))
      : seriesData; // Nếu không có bộ lọc nào thì lấy toàn bộ
  }

  console.log(role);
  // console.log("Filtered Data for Tantou:", filteredSeriesData);
  console.log("Filtered Data for Editorial", filteredSeriesData);

  return (
    <>
      <div className="p-3 mb-5">

        {/* Header đặc biệt chỉ dành cho role Mangaka (cho phép tạo truyện mới) */}
        {role === "mangaka" &&
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-sidebar-foreground font-medium text-2xl pb-1">Series Management</h1>
              <p className="text-muted-foreground">Manage your series and chapters</p>
            </div>
            {/* Nút để mở popup tạo bộ truyện mới */}
            <button
              onClick={handleClick}
              className="cursor-pointer border-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create New Series
            </button>
          </div>
        }

        {/* Lưới (Grid) hiển thị danh sách các bộ truyện (3 cột) */}
        <div className="grid grid-cols-3 gap-6">
          {filteredSeriesData?.map(item => (
            // Mỗi bộ truyện hiển thị dưới dạng một Card
            <div key={item.seriesId} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">

              {/* Phần Ảnh Bìa (Cover) */}
              <div className='h-48 w-full relative'>
                <img className="w-full h-full object-cover" src={item.coverFile} alt="cover file" />
              </div>

              {/* Phần Thông Tin Bộ Truyện */}
              <div className="p-6 space-y-4">
                <div>
                  <h3>{item.title}</h3>
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

      {/* Component Modal (Popup) để tạo bộ truyện mới.
          Chỉ render khi state showCreateSeriesModal là true */}
      {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)}
    </>

  );
}