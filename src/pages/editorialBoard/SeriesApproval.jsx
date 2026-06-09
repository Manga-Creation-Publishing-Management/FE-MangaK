import { SeriesManagement } from "../shared/SeriesManagement";

export function SeriesApproval() {
  return (
    <>
      <div className="p-3">
        <div className="p-3 flex justify-start">
          <div className="p-3 mb-5">
            <p className="text-sidebar-foreground font-medium text-2xl pb-1">Series Approval</p>
            <p className="text-muted-foreground">Review and approve series submitted by Tantou Editors</p>
          </div>
        </div>
        <SeriesManagement role="editorialBoard" statusFilter={["Pending", "Approved", "Rejected", "Publishing"]} />
      </div>
    </>
  )
}