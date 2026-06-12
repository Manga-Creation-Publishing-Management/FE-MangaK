import { Outlet, useParams } from "react-router"
import { StatusBadge } from "../../../pages/shared/StatusBadge";
import { Outdent, Plus } from "lucide-react";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { useSeriesManagement } from "../../series/hooks/useSeriesManagement";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { useChapterRate } from "../hooks/useChapterRate";
import { RatePanel } from "../../../pages/reader/RatePanel";
import { useUpdateRateChapter } from "../hooks/useUpdateRateChapter";

export function ChapterList({ roleName, seriesData }) {

  console.log("seriesID:", seriesData?.seriesId)
  const { chapterList } = useCreateChapter(seriesData?.seriesId);
  const { handleApprove, handleReject } = useUpdateChapter();
  const { handleNavigateToChapter } = useSeriesManagement();

  //nhằm lấy series ID của chapter lấy đánh giá
  const { activeChapterId, handlePopUp } = useChapterRate();

  //gọi hook update
  const { handleRateSubmit } = useUpdateRateChapter();
  // console.log("length", chapterList.length)


  return (
    <>
      {seriesData?.status === "Approved" || seriesData?.status === "Publishing" && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl ps-2 font-semibold ">Chapters ({chapterList?.length})</h2>
            </div>
            <div className="flex gap-3">
              <>
                {/* <Link
                  to={`/${role}/series/${id}/tasks`}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Users size={20} />
                  Manage Tasks
                </Link> */}
                {roleName?.toLowerCase() === "mangaka" &&
                  <button
                    // onClick={() => setShowAddChapter(true)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={20} />
                    Add New Chapter
                  </button>
                }
              </>
            </div>
          </div>
          <div className="space-y-4">
            {chapterList?.map((chapter) => {
              const showChapter = roleName === 'reader'
                ? chapter.status?.toLowerCase() === 'publishing'
                : true; // nếu là reader, chapter k pub thì false, nếu không là reader thì true, 
              // nếu vừa là reader và pub thì true

              if (!showChapter) return null; //tức là nếu là reader mà chapter không pub sẽ không trả về

              return (
                <div key={chapter.chapterId} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="py-1 font-semibold text-xl break-words">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </h3>
                      <p className="text-sm text-muted-foreground py-2">
                        Uploaded: {chapter.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <StatusBadge status={chapter.status} />

                      {/* Đã xóa mt-4 thừa ở nút bấm để không bị lệch trục dọc */}
                      {console.log(`${roleName?.toLowerCase()}${seriesData.id}${chapter.id}`)}
                      {roleName !== 'reader' ?
                        <div>
                          <button
                            className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                            onClick={() => handleNavigateToChapter(roleName?.toLowerCase(), seriesData?.seriesId, chapter?.chapterId)}
                          >

                            View Detail
                          </button>
                        </div>
                        :
                        //nếu là reader thì hiện nút để Rate, không thì hiện nút view details
                        <div>
                          <button
                            className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                            onClick={() => handlePopUp(chapter.chapterId)}
                          >

                            Rate chapter
                          </button>
                        </div>}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
          {activeChapterId &&
            <RatePanel
              onClose={() => handlePopUp(null)}
              onSubmit={async (rating) => {
                await handleRateSubmit(activeChapterId, rating);
                handlePopUp(null); //đóng popup
              }}
            />
          }
        </>
      )
      }

    </>
  )
}