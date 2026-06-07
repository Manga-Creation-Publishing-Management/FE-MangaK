import { ArrowLeft } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { useLocation, useNavigate, useParams } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { ChapterList } from "../../features/chapters/components/ChapterList";
import { ApprovalPanel } from "./ApprovalPanel";
import { useState } from "react";
// import { patch } from "../../features/shared/requests";

export function SeriesDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const roleFromState = location.state?.role;

  console.log("roleFromState", roleFromState);

  const {
    seriesData, genreList
  } = useCreateSeries();
  const validSeriesData = seriesData?.find(item => item.id === id)

  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);

  // Use localStatus if it's been updated, otherwise use data from API
  const currentStatus = localStatus || validSeriesData?.status;

  const handleApprove = async () => {
    if (!validSeriesData) return;

    let newStatus;
    if (roleFromState === "tantou" && currentStatus === "processing") {
      newStatus = "pending";
    } else if (roleFromState === "editorial" && currentStatus === "pending") {
      newStatus = "approved";
    } else {
      alert("You cannot approve this series in its current state.");
      return;
    }

    setIsLoading(true);
    try {
      await patch(`series/${id}`, { status: newStatus, feedback });
      setLocalStatus(newStatus);
      alert(`Series has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
      navigate(-1);
    } catch (error) {
      console.error("Error approving series:", error);
      alert("Failed to approve series. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!validSeriesData) return;

    if (!feedback.trim()) {
      alert("Please provide feedback before rejecting.");
      return;
    }

    setIsLoading(true);
    try {
      await patch(`series/${id}`, { status: "rejected", feedback });
      setLocalStatus("rejected");
      alert("Series has been rejected.");
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting series:", error);
      alert("Failed to reject series. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button text based on role
  const approveText = roleFromState === "tantou"
    ? "Approve & Submit to Editorial Board"
    : "Approve Series";
  const rejectText = roleFromState === "tantou"
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
          <div className="h-68 w-full relative" >
            <img className="w-full h-full object-cover" src={validSeriesData?.coverFile} alt="" />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1>{validSeriesData?.title}</h1>
                <p className="text-muted-foreground mt-1">{validSeriesData?.mangakaName}</p>
              </div>
              <StatusBadge status={currentStatus} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Genres</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {validSeriesData?.categories?.map((item, index) => {
                    const nameGenre = genreList?.find(itemGenre => String(itemGenre.id) === String(item))
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
                        {nameGenre.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 text-foreground">{validSeriesData?.description}</p>
            </div>
          </div>

        </div>
        <ChapterList roleName={roleFromState} seriesData={validSeriesData} />

        {/* feedback box for roles tantou and editorial, only when status is processing or pending */}
        {(roleFromState === 'tantou' || roleFromState === 'editorial') &&
          (currentStatus === 'processing' || currentStatus === 'pending') &&
          <ApprovalPanel
            feedback={feedback}
            onFeedbackChange={(e) => setFeedback(e.target.value)}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isLoading}
            approveText={approveText}
            rejectText={rejectText}
          />
        }
      </div >

    </>
  )
}
