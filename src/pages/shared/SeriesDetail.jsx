import { ArrowLeft, Download, Eye, ChevronDown, Loader2 } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { FeedbackHistoryList } from "../../shared/components/FeedbackHistoryList";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ChapterList } from "../../features/chapters/components/ChapterList";
import { ApprovalPanel } from "./ApprovalPanel";
import { useEffect, useState, useRef } from "react";
import { seriesService } from "../../services/seriesService";
import { useUpdateSeries } from "../../features/series/hooks/useUpdateSeries";
import { PreviewModal } from "./PreviewModal";
import { ConfirmRejectModal } from "./ConfirmRejectModal";
import { AnnotationModal } from "./AnnotationModal";
import { TextFeedbackModal } from "./TextFeedbackModal";
import { FeedbackViewer } from "./FeedbackViewer";
import { useToast } from "@/shared/hooks/useToast";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Component hiển thị trang chi tiết của một bộ truyện (Series)
export function SeriesDetail() {
  // useParams lấy ID của bộ truyện từ URL (vd: /series/:id)
  const { id } = useParams();
  // useNavigate dùng để quay lại trang trước đó khi nhấn nút "Back"
  const navigate = useNavigate();
  const { showAlert } = useToast();
  const { setBreadcrumbItems } = useOutletContext();

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const feedbackViewerRef = useRef(null);

  const handleViewFeedbackClick = () => {
    feedbackViewerRef.current?.viewFeedback();
  };

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

  const rolePrefix = roleFromState || "mangaka";
  const customBreadcrumb = [
    { label: rolePrefix.charAt(0).toUpperCase() + rolePrefix.slice(1), path: `/${rolePrefix}` },
    { label: "Series", path: `/${rolePrefix}/series` },
    { label: detailData?.title || "Series Detail" }
  ];

  useEffect(() => {
    if (detailData) {
      setBreadcrumbItems(customBreadcrumb);
      return () => setBreadcrumbItems(null);
    }
  }, [detailData?.title, rolePrefix]);

  if (!detailData) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium text-lg">Loading series details...</span>
      </div>
    );
  }


  return (
    <>
      <div className="p-6 space-y-6">

        {/* Khung chứa ảnh bìa và thông tin cơ bản của bộ truyện */}
        <div className="bg-card border border-border rounded-xl overflow-hidden p-4 sm:p-6">

          {/* Vùng hiển thị Ảnh bìa */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-border pb-6 items-start">
            <div className="col-span-1 md:col-span-4 lg:col-span-3 w-full aspect-[3/4] relative rounded-xl max-w-xs mx-auto md:max-w-none" >
              <img className="w-full h-full object-cover rounded-xl" src={detailData?.coverFile} alt="Series-cover-image" />
            </div>
            <div className="col-span-1 md:col-span-8 lg:col-span-9 w-full min-h-[440px] relative rounded-xl flex flex-col justify-between space-y-4" >
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {/* Tiêu đề truyện và Tên tác giả */}
                    <h2 className="title-obelix text-md sm:text-2xl font-semibold text-card-foreground">{detailData?.title}</h2>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">{detailData?.mangakaName}</p>
                  </div>
                  {/* Huy hiệu hiển thị trạng thái (Processing, Pending, Approved...) */}
                  <StatusBadge status={currentStatus?.toLowerCase()} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="min-h-[40px] info-box p-3 text-foreground text-sm leading-relaxed">
                      <h5 className="font-normal text-sm sm:text-sm text-muted-foreground tracking-wider">Upcoming Chapter Release Date</h5>
                      {detailData?.publishDate ? (
                        <div className="text-sm sm:text-lg my-1.5 font-semibold">{dayjs(detailData?.publishDate).utc(true).format('DD/MM/YYYY HH:mm')}</div>
                      ) : (
                        <div className="text-xs sm:text-sm ms-0.5">— — — —</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="min-h-[40px] info-box p-3 text-foreground text-sm leading-relaxed">
                      <h5 className="font-normal text-sm  sm:text-sm text-muted-foreground tracking-wider">Publish Period</h5>
                      {detailData?.publishPeriod ? (
                        <div className="text-sm sm:text-lg my-1.5 font-semibold capitalize">{detailData?.publishPeriod}</div>
                      ) : (
                        <div className="text-xs sm:text-sm ms-0.5">— — — —</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-7 md:col-span-8 space-y-2">
                    <h5 className="text-xs sm:text-sm text-muted-foreground uppercase font-semibold">Genres</h5>
                    {/* Danh sách các thể loại */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {detailData?.categories?.map((item, index) => {
                        const nameGenre = genreList?.find(itemGenre => String(itemGenre.categoryId) === String(item))
                        return (
                          <span
                            key={index}
                            className="genre-card px-2.5 py-0.5 text-xs font-medium rounded bg-secondary/50 text-secondary-foreground border border-border"
                          >
                            {nameGenre ? nameGenre.name : item}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {normalizedRole != 'reader' &&
                    <div className="sm:col-span-5 md:col-span-4 space-y-2 sm:text-right">
                      <h3 className="font-medium text-xs sm:text-sm text-muted-foreground uppercase">Original Name</h3>
                      <div className="flex flex-col items-start sm:items-end justify-center text-center">
                        <a
                          href={detailData?.nameFile}
                          download
                          className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm w-full sm:w-auto justify-center"
                        >
                          <Download size={16} />
                          Download Name
                        </a>
                      </div>

                      {(detailData?.feedback || (normalizedRole === 'mangaka' && ['pending', 'rejected', 'approved'].includes(normalizedStatus))) && (
                        <div className="flex flex-col items-start sm:items-end justify-center text-center mt-2">
                          <button
                            onClick={handleViewFeedbackClick}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm w-full sm:w-auto justify-center"
                          >
                            <Eye size={16} />
                            Preview/View Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  }
                </div>

                <div className="flex flex-col flex-1 h-full pt-2">
                  <h5 className="text-xs sm:text-sm text-muted-foreground uppercase font-semibold mb-1">Description</h5>
                  <p className="text-foreground text-justify w-full px-4 py-2 info-box flex-1 max-h-30 overflow-y-auto text-sm leading-relaxed">
                    {detailData?.description}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Component hiển thị Danh sách các Chapter thuộc bộ truyện này */}
          <div className="pt-6">
            <ChapterList roleName={roleFromState} seriesData={detailData} />
          </div>
          {console.log("Checkrolehientai:", roleFromState)}

        </div>

        {/* Feedback History Log Section */}
        {['tantou', 'editorial', 'mangaka'].includes(normalizedRole) && (
          <div className="w-full">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-300 mt-2 cursor-pointer"
            >
              <span>View feedback history</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isHistoryOpen ? "rotate-180 text-primary" : ""
                  }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isHistoryOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
            >
              <div className="overflow-hidden">
                <FeedbackHistoryList
                  seriesId={id}
                  fileUrl={detailData?.nameFile}
                  role={normalizedRole}
                />
              </div>
            </div>
          </div>
        )}



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

      <FeedbackViewer
        ref={feedbackViewerRef}
        seriesId={id}
        fallbackFeedback={detailData?.feedback}
        fallbackFeedbackType={detailData?.feedbackType}
        fileUrl={detailData?.nameFile}
        role={normalizedRole}
      />

    </>
  )
}
