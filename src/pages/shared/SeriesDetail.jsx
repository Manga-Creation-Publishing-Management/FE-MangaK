import { ArrowLeft } from "lucide-react";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { Outlet, useLocation, useParams } from "react-router";
import { StatusBadge } from "./StatusBadge";
import { ChapterList } from "../../features/chapters/components/ChapterList";

export function SeriesDetail() {

  const { id } = useParams();

  const location = useLocation();
  const roleFromState = location.state?.role;

  console.log("roleFromState", roleFromState);

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
        <ChapterList roleName={roleFromState} seriesData={validSeriesData}/>
      </div >
    </>
  )
}