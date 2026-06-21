import { Outlet, useParams } from "react-router"
import { StatusBadge } from "../../../pages/shared/StatusBadge";
import { Outdent, Plus } from "lucide-react";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { useSeriesManagement } from "../../series/hooks/useSeriesManagement";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { useChapterRate } from "../hooks/useChapterRate";
import { RatePanel } from "../../../pages/reader/RatePanel";
import { useUpdateRateChapter } from "../hooks/useUpdateRateChapter";
import { CreateChapterModal } from "./CreateChapterModal";
import { useChapterList } from "../hooks/useChapterList";

export function ChapterList({ roleName, seriesData }) {

  const { reload, handleReload } = useSeriesManagement();
  console.log("seriesID:", seriesData?.seriesId)
  const {
    chapterList,
    showCreateChapterModal,
    handleShowChapterModal
  } = useChapterList(seriesData?.seriesId, reload);
  const { handleApprove, handleReject } = useUpdateChapter();
  const { handleNavigateToChapter } = useSeriesManagement();





  // Hook quản lý trạng thái hiển thị Popup đánh giá của từng chapter
  const { activeChapterId, handlePopUp } = useChapterRate();

  // Hook thực hiện gửi số sao đánh giá (API submit)
  const { handleRateSubmit } = useUpdateRateChapter();
  // console.log("length", chapterList.length)
  console.log(`view series info: ${seriesData?.seriesId}`);

  return (
    <>
      {(seriesData?.status === "Approved" || seriesData?.status === "Publishing") && (
        <>
          {/* Header của phần danh sách Chapter */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl ps-2 font-semibold ">Chapters ({chapterList?.length})</h2>
            </div>

            <div className="flex gap-3">
              <>
                {/* Chỉ hiển thị nút "Add New Chapter" nếu user hiện tại là Mangaka */}
                {roleName?.toLowerCase() === "mangaka" &&
                  <button
                    onClick={() => handleShowChapterModal()}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={20} />
                    Add New Chapter
                  </button>
                }
              </>
            </div>
          </div>

          {/* Danh sách các card hiển thị thông tin từng chapter */}
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

                      {console.log(`${roleName?.toLowerCase()} ChapterId: ${chapter.chapterId}`)}
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
                        // Nếu là người đọc (reader) thì hiển thị nút "Rate chapter" để mở Popup đánh giá, ngược lại hiển thị nút "View Detail"
                        <div>
                          <button
                            className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                            onClick={() => handlePopUp(chapter.chapterId)} // Mở popup đánh giá cho chapter này
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
          {/* Nếu activeChapterId không null (tức đang chọn đánh giá cho một chapter nào đó), hiển thị RatePanel Popup */}
          {activeChapterId &&
            <RatePanel
              onClose={() => handlePopUp(null)} // Đóng popup khi nhấn nút hủy/X
              onSubmit={async (rating) => {
                // Gọi API gửi điểm đánh giá số sao lên server
                await handleRateSubmit(activeChapterId, rating);
                handlePopUp(null); // Đóng popup sau khi submit thành công
              }}
            />
          }
        </>
      )
      }

      {
        showCreateChapterModal &&
        <CreateChapterModal
          seriesId={seriesData?.seriesId}
          onClose={handleShowChapterModal}
          onReload={handleReload}
        />
      }

    </>
  )
}