import { usePublishingSchedule } from '../../features/schedule/PublishingSchedule';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/pages/shared/StatusBadge';
import { OverviewCard } from '../shared/OverviewCard';
import { useState } from 'react';

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
  const [deleteSeriesName, setDeleteSeriesName] = useState('');

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
    setDeleteSeriesName('');
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h1>Publishing Schedule Management</h1>
          <p className="text-muted-foreground mt-1">Manage publication schedules for approved series</p>
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
          valueNum={18}
        />
        <OverviewCard
          iconName={<Calendar size={24} />}
          iconColor="#06b6d4"
          contentText="Total Series Scheduled"
          valueNum={schedules.length}
        />
      </div>

      <div>
        <h2>Current Schedules</h2>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3>{schedule.seriesName}</h3>
                <p className="text-sm text-muted-foreground mt-1">by {schedule.author}</p>
                <div className="grid grid-cols-4 gap-6 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="mt-1 capitalize">{schedule.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="mt-1">{schedule.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Release</p>
                    <p className="mt-1">{schedule.nextRelease || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chapters Published</p>
                    <p className="mt-1">{schedule.chaptersPublished}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleEditClick(schedule)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit Schedule"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(schedule)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Schedule"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-8 w-full max-w-2xl">
            <h2 className="mb-6">{isEditing ? 'Update Publishing Schedule' : 'Create Publishing Schedule'}</h2>
            <div className="space-y-6 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Series</label>
                {isEditing ? (
                  <input
                    type="text"
                    disabled
                    value={schedules.find(s => s.id === editingScheduleId)?.seriesName || ''}
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border text-muted-foreground cursor-not-allowed focus:outline-none"
                  />
                ) : (
                  <select
                    value={selectedSeries}
                    onChange={(e) => setSelectedSeries(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a series...</option>
                    {approvedSeries.map((series) => (
                      <option key={series.id} value={series.id}>
                        {series.name} by {series.author}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Publication Frequency</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFrequency('weekly')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${frequency === 'weekly' ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    <p className="font-medium">Weekly</p>
                    <p className="text-sm text-muted-foreground">New chapter every week</p>
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${frequency === 'monthly' ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    <p className="font-medium">Monthly</p>
                    <p className="text-sm text-muted-foreground">New chapter every month</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-sm text-info">
                  The publishing schedule will determine when new chapters are automatically released to readers.
                  Make sure the mangaka has enough chapters ready before setting the start date.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                {isEditing ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-8 w-full max-w-md">
            <h2 className="mb-4">Confirm Delete</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete the publishing schedule for <strong>{deleteSeriesName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteScheduleId(null);
                  setDeleteSeriesName('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}