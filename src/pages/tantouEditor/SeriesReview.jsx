import { ApprovalPanel } from "../shared/ApprovalPanel";
import { SeriesManagement } from "../shared/SeriesManagement";

export function SeriesReview() {
  return (
    <>
      <div className="p-3">
        <div className="p-3 flex justify-start">
          <div className="p-3 mb-5">
            <p className="text-sidebar-foreground font-medium text-2xl pb-1">Series Management</p>
            <p className="text-muted-foreground">Review and approve series for Editorial Board</p>
          </div>
        </div>
        <SeriesManagement role="tantouEditor" statusFilter={["Processing", "rejected"]} />

      </div >
    </>
  )
}