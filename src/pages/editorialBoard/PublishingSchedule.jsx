import { usePublishingSchedule } from '../../features/schedule/PublishingSchedule';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/pages/shared/StatusBadge';

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
  } = usePublishingSchedule();

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h1>Publishing Schedule Management</h1>
          <p className="text-muted-foreground mt-1">Manage publication schedules for approved series</p>
        </div>
        <button
          onClick={() => setShowAddSchedule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Create Schedule
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Calendar size={24} />
          </div>
          <p className="text-muted-foreground text-sm">Active Schedules</p>
          <p className="text-2xl mt-1">{schedules.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <p className="text-muted-foreground text-sm">This Month Releases</p>
          <p className="text-2xl mt-1">18</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="w-12 h-12 rounded-lg bg-info/10 text-info flex items-center justify-center mb-4">
            <Calendar size={24} />
          </div>
          <p className="text-muted-foreground text-sm">Total Series Scheduled</p>
          <p className="text-2xl mt-1">{schedules.length}</p>
        </div>
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
                <StatusBadge status={schedule.status === 'active' ? 'approved' : 'processing'} />
                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
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
            <h2 className="mb-6">Create Publishing Schedule</h2>
            <div className="space-y-6 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Series</label>
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
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Publication Frequency</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFrequency('weekly')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      frequency === 'weekly' ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <p className="font-medium">Weekly</p>
                    <p className="text-sm text-muted-foreground">New chapter every week</p>
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      frequency === 'monthly' ? 'border-primary bg-primary/10' : 'border-border'
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
                onClick={() => setShowAddSchedule(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}