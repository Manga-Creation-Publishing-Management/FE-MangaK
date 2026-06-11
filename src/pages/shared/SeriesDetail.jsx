import { ArrowLeft } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { useLocation, useNavigate, useParams } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { ChapterList } from "../../features/chapters/components/ChapterList";
import { ApprovalPanel } from "./ApprovalPanel";
import { useEffect, useState } from "react";
import { seriesService } from "../../services/seriesService";
import { useUpdateSeries } from "../../features/series/hooks/useUpdateSeries";

// Component hiển thị trang chi tiết của một bộ truyện (Series)
export function SeriesDetail() {
  // useParams lấy ID của bộ truyện từ URL (vd: /series/:id)
  const { id } = useParams();
  // useNavigate dùng để quay lại trang trước đó khi nhấn nút "Back"
  const navigate = useNavigate();

  // useLocation dùng để lấy đường dẫn hiện tại hoặc state truyền qua URL
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  // Thử lấy 'role' (vai trò) từ location.state. 
  // Việc này quan trọng để hiển thị giao diện tuỳ chỉnh theo role
  let roleFromState = location.state?.role;
  
  // Dự phòng (Fallback): Nếu state bị mất (ví dụ do người dùng f5/refresh trang),
  // Cố gắng tự nội suy role bằng cách nhìn vào đường dẫn URL (pathname)
  if (!roleFromState) {
    if (pathname.includes("tantou")) {
      roleFromState = "tantou";
    } else if (pathname.includes("editorial")) {
      roleFromState = "editorial";
    }
  }

  console.log("roleFromState", roleFromState);

  // Hook dùng để lấy danh sách thể loại (genre)
  const { genreList } = useCreateSeries();

  // State lưu trữ dữ liệu chi tiết của bộ truyện lấy từ server
  const [detailData, setDetailData] = useState(null);
  
  // State lưu trữ trạng thái hiện tại (cục bộ) của bộ truyện để không phải gọi API lại ngay lập tức khi vừa approve/reject
  const [localStatus, setLocalStatus] = useState(null);

  // Hook hỗ trợ xử lý duyệt / từ chối series (Approval Flow)
  const {
    isLoading,
    feedback,
    setFeedback,
    handleApprove,
    handleReject
  } = useUpdateSeries();

  // Effect chạy mỗi khi ID thay đổi để lấy dữ liệu từ API
  useEffect(() => {
    const fetchSeriesDetail = async () => {
      if (!id) return;
      try {
        const response = await seriesService.getSeriesById(id);
        setDetailData(response.data);
      } catch (error) {
        console.log("Lỗi:", error);
      }
    };
    fetchSeriesDetail();
  }, [id]);

  // Ưu tiên sử dụng trạng thái local (nếu vừa có thay đổi), nếu không thì lấy trạng thái từ dữ liệu API
  const currentStatus = localStatus || detailData?.status;
  const normalizedStatus = currentStatus?.toLowerCase();
  const normalizedRole = roleFromState?.toLowerCase();

  // Kiểm tra xem user hiện tại có phải là Tantou hay Editorial không (liên quan đến tính năng phê duyệt)
  const isTantou = normalizedRole === "tantou";
  const isEditorial = normalizedRole === "editorial";

  console.log(`Is tantou? ${isTantou}`);

  // Log debug để kiểm tra quá trình render
  console.log("SeriesDetail render debug:", {
    detailData,
    currentStatus,
    normalizedStatus,
    roleFromState,
    normalizedRole,
    isTantou,
    isEditorial,
    showPanel: (((isTantou) && (normalizedStatus === 'processing'))
      || ((isEditorial) && (normalizedStatus === 'pending')))
  });

  // Tùy chỉnh dòng chữ trên nút Phê duyệt / Từ chối dựa trên role
  const approveText = isTantou
    ? "Approve & Submit to Editorial Board"
    : "Approve Series";
  const rejectText = isTantou
    ? "Reject & Send Feedback"
    : "Reject Series";

  return (
    <>
      <div className="p-8 space-y-8">
        
        {/* Nút quay lại trang trước */}
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        {/* Khung chứa ảnh bìa và thông tin cơ bản của bộ truyện */}
        <div className="bg-card border-border rounded-xl overflow-hidden">
          
          {/* Vùng hiển thị Ảnh bìa */}
          <div className="h-100 w-full relative" >
            <img className="w-full h-full object-cover" src={detailData?.coverFile} alt="" />
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Tiêu đề truyện và Tên tác giả */}
                <h1 className="text-2xl font-semibold">{detailData?.title}</h1>
                <p className="text-muted-foreground mt-1">{detailData?.mangakaName}</p>
              </div>
              {/* Huy hiệu hiển thị trạng thái (Processing, Pending, Approved...) */}
              <StatusBadge status={currentStatus?.toLowerCase()} />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Genres</p>
                {/* Danh sách các thể loại */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailData?.categories?.map((item, index) => {
                    // Ánh xạ từ ID của genre sang Tên thể loại dựa vào genreList
                    const nameGenre = genreList?.find(itemGenre => String(itemGenre.categoryId) === String(item))
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
                        {/* Nếu tìm thấy tên thì in ra, không thì in id (dự phòng) */}
                        {nameGenre ? nameGenre.name : item}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Mô tả bộ truyện */}
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 text-foreground">{detailData?.description}</p>
            </div>
          </div>
        </div>
        
        {/* Component hiển thị Danh sách các Chapter thuộc bộ truyện này */}
        <ChapterList roleName={roleFromState} seriesData={detailData} />

        {/* Hộp thoại Phản hồi / Phê duyệt dành cho Tantou hoặc Editorial Board. 
            Chỉ hiển thị khi Status đang ở mức cần xử lý (processing hoặc pending) */}
        {(isTantou || isEditorial) &&
          (normalizedStatus === 'processing' || normalizedStatus === 'pending') &&
          <ApprovalPanel
            feedback={feedback}
            onFeedbackChange={(e) => setFeedback(e.target.value)}
            onApprove={() => handleApprove(id, roleFromState, currentStatus, setLocalStatus)}
            onReject={() => handleReject(id, roleFromState, setLocalStatus)}
            isLoading={isLoading}
            approveText={approveText}
            rejectText={rejectText}
          />
        }
      </div >

    </>
  )
}
