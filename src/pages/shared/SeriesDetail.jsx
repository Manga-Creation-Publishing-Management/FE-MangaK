import { ArrowLeft, Download, Eye } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { useLocation, useNavigate, useParams } from "react-router";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ChapterList } from "../../features/chapters/components/ChapterList";
import { ApprovalPanel } from "./ApprovalPanel";
import { useEffect, useState } from "react";
import { seriesService } from "../../services/seriesService";
import { useUpdateSeries } from "../../features/series/hooks/useUpdateSeries";
import { PreviewModal } from "./PreviewModal";
import { ConfirmRejectModal } from "./ConfirmRejectModal";
import { AnnotationModal } from "./AnnotationModal";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  //các state quản lí hiển thị pop-up
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);

  const handleInitialRejectClick = () => {
    setConfirmModalOpen(true);
  }

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
        <div className="bg-card border-border rounded-xl overflow-hidden p-6">

          {/* Vùng hiển thị Ảnh bìa */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 border-b border-gray-200 pb-6 items-start">
            <div className="col-span-1 md:col-span-1 w-full aspect-[3/4] relative rounded-xl" >
              <img className="w-full h-full object-cover rounded-xl" src={detailData?.coverFile} alt="" />
            </div>
            <div className="col-span-1 md:col-span-2 w-full h-[440px] relative rounded-xl" >
              <div className=" flex flex-col h-full justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Tiêu đề truyện và Tên tác giả */}
                    <h1 className="text-2xl font-semibold">{detailData?.title}</h1>
                    <p className="text-muted-foreground mt-1">{detailData?.mangakaName}</p>
                  </div>
                  {/* Huy hiệu hiển thị trạng thái (Processing, Pending, Approved...) */}
                  <StatusBadge status={currentStatus?.toLowerCase()} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-12 gap-6 ">

                  <div className="md:col-span-6 space-y-2">
                    <div className="bg-muted/30 p-3 rounded-lg border border-border text-foreground text-sm leading-relaxed">
                      <h3 className="font-normal text-sm text-muted-foreground  tracking-wider">Upcoming Chapter Release Date</h3>
                      {detailData?.publishDate ? (
                        <div className="text-sm my-2 font-semibold">{dayjs(detailData?.publishDate).utc(true).format('DD/MM/YYYY HH:mm')}</div>
                      ) : (
                        <div className="text-sm ms-0.5">— — — —</div>
                      )}

                    </div>
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <div className="bg-muted/30 p-3 rounded-lg border border-border  text-foreground text-sm leading-relaxed">
                      <h3 className="font-normal text-sm text-muted-foreground  tracking-wider">Publish Period</h3>
                      {detailData?.publishPeriod ? (
                        <div className="text-sm my-2 font-semibold capitalize">{detailData?.publishPeriod}</div>
                      ) : (
                        <div className="text-sm ms-0.5"> — — — —</div>
                      )}
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-3">
                    <h3 className="text-sm text-muted-foreground uppercase font-semibold">Genres</h3>
                    {/* Danh sách các thể loại */}
                    <div className="flex flex-wrap gap-2 ">
                      {detailData?.categories?.map((item, index) => {
                        // Ánh xạ từ ID của genre sang Tên thể loại dựa vào genreList
                        const nameGenre = genreList?.find(itemGenre => String(itemGenre.categoryId) === String(item))
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/50 text-secondary-foreground border border-border"
                          >
                            {/* Nếu tìm thấy tên thì in ra, không thì in id (dự phòng) */}
                            {nameGenre ? nameGenre.name : item}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {normalizedRole != 'reader' &&
                    <div className="md:col-span-4 space-y-3 text-right">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase">Original Name</h3>
                      <div className="flex flex-col items-end justify-center text-center">
                        {/* <p className="text-xs text-muted-foreground">Download the initial manuscript file to start working</p> */}
                        <a
                          href={detailData?.nameFile}
                          download
                          className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground hover:bg-secondary/80  p-4 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                        >
                          <Download size={16} />
                          Download Name
                        </a>
                      </div>

                      <div className="flex flex-col items-end justify-center text-center">
                        <button
                          onClick={() => setIsPreviewOpen(true)}
                          className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground hover:bg-secondary/80  p-4 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                        >
                          <Eye size={16} />
                          Preview Name
                        </button>
                      </div>
                    </div>
                  }
                </div>

                <div className="flex flex-col flex-1 min-h-0 pt-2">
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Description</p>
                  <p className="text-foreground text-justify w-full px-4 py-2 bg-input-background rounded-lg border border-border flex-1 overflow-y-auto text-xs leading-relaxed pr-2">
                    {detailData?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>



        </div>

        {/* Component hiển thị Danh sách các Chapter thuộc bộ truyện này */}
        <ChapterList roleName={roleFromState} seriesData={detailData} />
        {console.log("Checkrolehientai:", roleFromState)}

        {/* feedback box for roles tantou and editorial, only when status is processing or pending */}
        {(isTantou || isEditorial) &&
          (normalizedStatus === 'processing' || normalizedStatus === 'pending') &&
          <ApprovalPanel
            feedback={feedback}
            onFeedbackChange={(e) => setFeedback(e.target.value)}
            onApprove={() => handleApprove(id, roleFromState, currentStatus, setLocalStatus)}
            onReject={() => normalizedRole === 'tantou'
              ? handleInitialRejectClick()
              : handleReject(id, normalizedRole, setLocalStatus)
            }
            isLoading={isLoading}
            approveText={approveText}
            rejectText={rejectText}
          />
        }

        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileUrl={detailData?.nameFile}
          role={normalizedRole}
        />
      </div >

      <ConfirmRejectModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onYes={() => {
          setConfirmModalOpen(false);
          setIsAnnotationOpen(true);
        }}
        onNo={() => {
          setConfirmModalOpen(false);
          handleReject(id, normalizedRole, setLocalStatus);
        }}
      />

      <AnnotationModal
        isOpen={isAnnotationOpen}
        onClose={() => setIsAnnotationOpen(false)}
        fileUrl={detailData?.nameFile}
        seriesId={id}
        role={normalizedRole}
        onRejectTrigger={() => { //cho chữ mặc định khi annotation vì reject nó vẫn check á
          handleReject(id, normalizedRole, setLocalStatus, "Annotation feedback added to the submission");
          setIsAnnotationOpen(false);
        }}
      />

    </>
  )
}
