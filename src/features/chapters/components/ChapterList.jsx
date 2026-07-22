import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router"
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Outdent, Plus, Star } from "lucide-react";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { useSeriesManagement } from "../../series/hooks/useSeriesManagement";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { useChapterRate } from "../hooks/useChapterRate";
import { RatePanel } from "../../../pages/reader/RatePanel";
import { chaptersService } from "../../../services/chapterService";
import { useUpdateRateChapter } from "../hooks/useUpdateRateChapter";
import { CreateChapterModal } from "./CreateChapterModal";
import { useChapterList } from "../hooks/useChapterList";
import { useProgressing } from "../hooks/useProgressing";
import { getTotalPage } from "../../Pagination/hooks/getTotalPage";
import { PaginationCustom } from "../../Pagination/components/PaginationCustom";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";

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

  const [selectedChapterId, setSelectedChapterId] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State lưu trữ số sao Reader đã đánh giá cho từng chapter { [chapterId]: rating }
  const [readerVotes, setReaderVotes] = useState({});

  const { activeChapterId, handlePopUp } = useChapterRate();

  const { handleRateSubmit } = useUpdateRateChapter();


  const { } = useProgressing()

  console.log(`view series info: ${seriesData?.seriesId}`);

  // Khi role là Reader, lấy số sao đã đánh giá cho từng chapter
  useEffect(() => {
    console.log('[VoteEffect] Running. roleName:', roleName, 'chapterList length:', chapterList?.length);
    
    if (roleName?.toLowerCase() !== 'reader') {
      console.log('[VoteEffect] Skipped: role is not reader');
      return;
    }
    if (!chapterList?.length) {
      console.log('[VoteEffect] Skipped: chapterList is empty');
      return;
    }

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const readerId = user?.id;
    console.log('[VoteEffect] readerId:', readerId);
    if (!readerId) return;

    const fetchVotes = async () => {
      const votes = {};
      await Promise.all(
        chapterList.map(async (chapter) => {
          try {
            const res = await chaptersService.getReaderVote(chapter.chapterId, readerId);
            console.log(`[VoteEffect] API response for chapter ${chapter.chapterId}:`, JSON.stringify(res));
            // Parse số sao từ response - hỗ trợ nhiều format
            if (res !== null && res !== undefined) {
              let rating = null;
              if (typeof res === 'number') {
                rating = res;
              } else if (typeof res === 'object') {
                rating = res.data?.rate ?? res.data?.rating ?? res.data?.score
                  ?? res.rate ?? res.rating ?? res.score ?? null;
              }
              if (rating !== null) {
                votes[chapter.chapterId] = rating;
              }
            }
          } catch (err) {
            // Reader chưa đánh giá chapter này -> bỏ qua
            console.log(`[VoteEffect] No vote for chapter ${chapter.chapterId}`, err?.message);
          }
        })
      );
      console.log('[VoteEffect] Final readerVotes:', votes);
      setReaderVotes(votes);
    };

    fetchVotes();
  }, [roleName, chapterList]);

  const visibleChapters = (chapterList || []).filter(chapter => {
    const matchesRole = roleName === 'reader'
      ? chapter.status?.toLowerCase() === 'publishing'
      : true;
    const matchesStatus = filterStatus === "all"
      ? true
      : chapter.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesRole && matchesStatus;
  });

  const chapterOptions = [
    { value: "all", label: "Select Chapter" },
    ...visibleChapters.map(chap => ({
      value: String(chap.chapterId),
      label: `Chapter ${chap.chapterNumber}`
    }))
  ];

  const handleChapterSelectChange = (value) => {
    setSelectedChapterId(value);
    if (value !== "all") {
      if (roleName?.toLowerCase() === 'reader') {
        handlePopUp(value);
      } else {
        handleNavigateToChapter(roleName?.toLowerCase(), seriesData?.seriesId, value);
      }
      setSelectedChapterId("all");
    }
  };

  const {
    currentPage,
    postsPerPage,
    setCurrentPage,
    currentDataListDisplay,
    totalPages
  } = getTotalPage(1, 5, visibleChapters);

  return (
    <>
      {(seriesData?.status === "Scheduled" || seriesData?.status === "Publishing") && (
        <>
          {/* Header của phần danh sách Chapter */}
          {/* Header của phần danh sách Chapter */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-xl ps-2 font-semibold text-card-foreground">Chapters ({chapterList?.length})</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {roleName !== "reader" && (
                <div className="w-full sm:w-44">
                  <SearchFilterBar
                    showSearch={false}
                    useCardWrapper={false}
                    filters={[
                      {
                        value: filterStatus,
                        onChange: setFilterStatus,
                        options: [
                          { value: "all", label: "All Status" },
                          { value: "created", label: "Created" },
                          { value: "pending", label: "Pending" },
                          { value: "processing", label: "Processing" },
                          { value: "scheduled", label: "Scheduled" },
                          { value: "publishing", label: "Publishing" },
                          { value: "rejected", label: "Rejected" }
                        ],
                        className: "w-full"
                      }
                    ]}
                  />
                </div>
              )}

              <div className="w-full sm:w-48">
                <SearchFilterBar
                  showSearch={false}
                  useCardWrapper={false}
                  filters={[
                    {
                      value: selectedChapterId,
                      onChange: handleChapterSelectChange,
                      options: chapterOptions,
                      className: "w-full"
                    }
                  ]}
                />
              </div>

              {/* Chỉ hiển thị nút "Add New Chapter" nếu user hiện tại là Mangaka */}
              {roleName?.toLowerCase() === "mangaka" &&
                <button
                  onClick={() => handleShowChapterModal()}
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto text-sm font-medium"
                >
                  <Plus size={20} />
                  Add New Chapter
                </button>
              }
            </div>
          </div>

          {/* Danh sách các card hiển thị thông tin từng chapter */}
          <div className="space-y-4">
            {currentDataListDisplay?.map((chapter) => {
              const showChapter = roleName === 'reader'
                ? chapter.status?.toLowerCase() === 'publishing'
                : true;

              if (!showChapter) return null;

              return (
                <div key={chapter.chapterId} className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="py-1 text-base sm:text-xl break-words text-card-foreground">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </h4>
                      {/* Hiển thị số sao Reader đã đánh giá cho chapter */}
                      {roleName?.toLowerCase() === 'reader' && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground mr-1">
                            {readerVotes[chapter.chapterId] != null ? 'Your rating:' : 'Not rated yet'}
                          </span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= (readerVotes[chapter.chapterId] || 0)
                                ? "text-[#FBBF24] fill-[#FBBF24]"
                                : "text-[#71618a] fill-transparent"
                              }
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-10 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <StatusBadge status={chapter.status.toLowerCase()} />

                      {roleName !== 'reader' ?
                        <div>
                          <button
                            className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
                            onClick={() => handleNavigateToChapter(roleName?.toLowerCase(), seriesData?.seriesId, chapter?.chapterId)}
                          >
                            View Detail
                          </button>
                        </div>
                        :
                        <div>
                          <button
                            className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
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
          <PaginationCustom
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          {/* Nếu activeChapterId không null (tức đang chọn đánh giá cho một chapter nào đó), hiển thị RatePanel Popup */}
          {activeChapterId &&
            <RatePanel
              onClose={() => handlePopUp(null)} // Đóng popup khi nhấn nút hủy/X
              onSubmit={async (rating) => {
                // Gọi API gửi điểm đánh giá số sao lên server
                await handleRateSubmit(activeChapterId, rating);
                // Cập nhật readerVotes ngay lập tức để hiển thị số sao trên UI
                setReaderVotes(prev => ({ ...prev, [activeChapterId]: rating }));
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