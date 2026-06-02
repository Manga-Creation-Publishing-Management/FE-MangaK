import { ArrowLeft } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { useParams } from "react-router";
import { StatusBadge } from "./StatusBadge";

export function SeriesDetail() {

  const { id } = useParams();



  const {
    seriesData, genreList
  } = useCreateSeries();
  const validSeriesData = seriesData?.find(item => item.id === id)
  return (
    <>
      <div className="p-8 space-y-8">
        <button
          // onClick={() => navigate(-1)}
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
                <p className="text-muted-foreground mt-1">Author Name</p>
              </div>
              <StatusBadge status={validSeriesData?.status} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Genres</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {validSeriesData?.genres?.map((item, index) => {
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


        {/* {seriesStatus === 'approved' && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2>Chapters ({chapters.length})</h2>
                {canReviewChapters && (
                  <p className="text-sm text-muted-foreground mt-1">Click on chapters to review and approve/reject individually</p>
                )}
              </div>
              <div className="flex gap-3">
                {role === 'mangaka' && seriesStatus === 'approved' && (
                  <>
                    <Link
                      to={`/${role}/series/${id}/tasks`}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Users size={20} />
                      Manage Tasks
                    </Link>
                    <button
                      onClick={() => setShowAddChapter(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus size={20} />
                      Add New Chapter
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3>{chapter.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{chapter.pages} pages</p>
                      <p className="text-sm text-muted-foreground">Uploaded: {chapter.uploadDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={chapter.status} />
                      <Link
                        to={`/${role}/series/${id}/chapter/${chapter.id}`}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {canReviewChapters && chapter.status === 'processing' ? 'Review Chapter' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )} */}

        {/* {!canAddChapters && role === 'mangaka' && (
          <>
            {seriesStatus === 'processing' && (
              <div className="bg-info/10 border border-info/30 rounded-lg p-6">
                <p className="text-info text-sm">Names/Draft is awaiting Tantou Editor review. You will be notified once reviewed.</p>
              </div>
            )}

            {seriesStatus === 'rejected' && (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                  <p className="text-destructive font-medium mb-1">Series Rejected</p>
                  <p className="text-sm text-muted-foreground">This series was not approved. See feedback below.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h2>Rejection Feedback</h2>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Tantou Editor</p>
                        <p className="text-sm text-muted-foreground">2026-05-14</p>
                      </div>
                      <p className="text-sm">The draft concept lacks originality and the character designs are too similar to existing licensed works. Please revise the main character's visual identity and strengthen the core story premise before resubmitting.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )} */}

        {/* {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-8 w-full max-w-md">
              <h2 className="mb-6">Set Publication Schedule</h2>
              <div className="space-y-6 mb-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <button
                    onClick={() => setPublicationSchedule('weekly')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${publicationSchedule === 'weekly' ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    <p className="font-medium">Weekly</p>
                    <p className="text-sm text-muted-foreground">New chapter every week</p>
                  </button>
                  <button
                    onClick={() => setPublicationSchedule('monthly')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${publicationSchedule === 'monthly' ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    <p className="font-medium">Monthly</p>
                    <p className="text-sm text-muted-foreground">New chapter every month</p>
                  </button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSet}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Approve Series
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div >
    </>
  )
}