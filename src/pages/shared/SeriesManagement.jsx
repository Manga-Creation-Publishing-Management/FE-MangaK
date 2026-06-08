import { useState } from "react";
import CreateSeriesModal from "../../features/series/components/CreateSeriesModal";
import { Link } from "react-router";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { StatusBadge } from "./StatusBadge";


export function SeriesManagement({ role, statusFilter }) {

  const {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate
  } = useSeriesManagement();

  const { seriesData } = useCreateSeries(null, handleReload, reload);
  console.log(seriesData);

  // Filter series by status if statusFilter is provided
  const filteredSeriesData = statusFilter
    ? seriesData.filter(item => statusFilter.includes(item.status))
    : seriesData;
  console.log(role);
  console.log("Filtered Data for Tantou:", filteredSeriesData);

  return (
    <>
      <div className="p-3 mb-5">
        {role === "mangaka" &&
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-sidebar-foreground font-medium text-2xl pb-1">Series Management</h1>
              <p className="text-muted-foreground">Manage your series and chapters</p>
            </div>
            <button
              onClick={handleClick}
              className="cursor-pointer border-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create New Series
            </button>
          </div>
        }

        <div className="grid grid-cols-3 gap-6">
          {filteredSeriesData?.map(item => (
            <div key={item.seriesId} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className='h-48 w-100 relative'>
                <img className="w-full h-full object-cover" src={item.coverFile} alt="cover file" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3>{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.totalChapters || 0} Chapters</p>
                </div>
                <StatusBadge status={item.status} />
                <button className="cursor-pointer w-full block text-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => handleNavigate(role, item.seriesId)}
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
      {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)}


    </>

  );
}