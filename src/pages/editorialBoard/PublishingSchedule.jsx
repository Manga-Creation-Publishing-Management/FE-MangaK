import { usePublishingSchedule } from "../../features/schedule/PublishingSchedule";
import { Calendar, Clock, Plus } from "lucide-react";
import { OverviewCard } from "@/shared/components/OverviewCard";
import { useState } from "react";

import { ScheduleCard } from "./components/ScheduleCard";
import { ScheduleFormModal } from "./components/ScheduleFormModal";
import { DeleteScheduleModal } from "./components/DeleteScheduleModal";

export function PublishingSchedule() {
  const {
    showAddSchedule,
    setShowAddSchedule,
    selectedSeries,
    setSelectedSeries,
    frequency,
    setFrequency,
    startDate,
    setStartDate,
    approvedSeries,
    schedules,
    handleCreateSchedule,
    isEditing,
    editingScheduleId,
    handleEditClick,
    handleDeleteConfirm,
    handleCloseModal,
  } = usePublishingSchedule();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const [deleteSeriesName, setDeleteSeriesName] = useState("");

  const handleDeleteClick = (schedule) => {
    setDeleteScheduleId(schedule.id);
    setDeleteSeriesName(schedule.seriesName);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteScheduleId) {
      await handleDeleteConfirm(deleteScheduleId);
    }
    setShowDeleteModal(false);
    setDeleteScheduleId(null);
    setDeleteSeriesName("");
  };

  const now = new Date();
  const thisMonthReleases = schedules.filter((schedule) => {
    if (!schedule.startDate) return false;
    const date = new Date(schedule.startDate);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }).length;

  return (
    <div className="p-9 space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-medium text-2xl">
            Publishing Schedule Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage publication schedules for approved series
          </p>
        </div>

        <button
          onClick={() => setShowAddSchedule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={20} />
          Create Schedule
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <OverviewCard
          iconName={<Clock size={24} />}
          iconColor="#10b981"
          contentText="This Month Releases"
          valueNum={thisMonthReleases}
        />
        <OverviewCard
          iconName={<Calendar size={24} />}
          iconColor="#06b6d4"
          contentText="Total Series Scheduled"
          valueNum={schedules.length}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Current Schedules</h2>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>

      <ScheduleFormModal
        show={showAddSchedule}
        isEditing={isEditing}
        editingScheduleId={editingScheduleId}
        schedules={schedules}
        selectedSeries={selectedSeries}
        onSelectedSeriesChange={setSelectedSeries}
        approvedSeries={approvedSeries}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        startDate={startDate}
        onStartDateChange={setStartDate}
        onClose={handleCloseModal}
        onConfirm={handleCreateSchedule}
      />

      <DeleteScheduleModal
        show={showDeleteModal}
        deleteSeriesName={deleteSeriesName}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteScheduleId(null);
          setDeleteSeriesName("");
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}