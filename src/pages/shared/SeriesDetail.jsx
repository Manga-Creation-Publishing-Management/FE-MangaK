import { ArrowLeft } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { useLocation, useNavigate, useParams } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { ChapterList } from "../../features/chapters/components/ChapterList";
import { ApprovalPanel } from "./ApprovalPanel";
import { useEffect, useState } from "react";
import { seriesService } from "../../services/seriesService";
import { useUpdateSeries } from "../../features/series/hooks/useUpdateSeries";

export function SeriesDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  // Fallback to path checking if state was lost (e.g. page refresh)
  let roleFromState = location.state?.role;
  if (!roleFromState) {
    if (pathname.includes("tantou")) {
      roleFromState = "tantou";
    } else if (pathname.includes("editorial")) {
      roleFromState = "editorial";
    }
  }

  console.log("roleFromState", roleFromState);

  const {
    genreList
  } = useCreateSeries();

  const [detailData, setDetailData] = useState(null);
  const [localStatus, setLocalStatus] = useState(null);

  const {
    isLoading,
    feedback,
    setFeedback,
    handleApprove,
    handleReject
  } = useUpdateSeries();

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

  // Use localStatus if it's been updated, otherwise use data from API
  const currentStatus = localStatus || detailData?.status;
  const normalizedStatus = currentStatus?.toLowerCase();
  const normalizedRole = roleFromState?.toLowerCase();

  const isTantou = normalizedRole === "tantou";
  const isEditorial = normalizedRole === "editorial";

  console.log(`Is tantou? ${isTantou}`);

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

  // Determine button text based on role
  const approveText = isTantou
    ? "Approve & Submit to Editorial Board"
    : "Approve Series";
  const rejectText = isTantou
    ? "Reject & Send Feedback"
    : "Reject Series";

  return (
    <>
      <div className="p-8 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-card border-border  rounded-xl overflow-hidden">
          <div className="h-100 w-full relative" >
            <img className="w-full h-full object-cover" src={detailData?.coverFile} alt="" />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold">{detailData?.title}</h1>
                <p className="text-muted-foreground mt-1">{detailData?.mangakaName}</p>
              </div>
              <StatusBadge status={currentStatus?.toLowerCase()} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Genres</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailData?.categories?.map((item, index) => {
                    const nameGenre = genreList?.find(itemGenre => String(itemGenre.categoryId) === String(item))
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
                        {nameGenre ? nameGenre.name : item}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 text-foreground">{detailData?.description}</p>
            </div>
          </div>

        </div>
        <ChapterList roleName={roleFromState} seriesData={detailData} />
        {console.log("Checkrolehientai:", roleFromState)}
        
        {/* feedback box for roles tantou and editorial, only when status is processing or pending */}
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
