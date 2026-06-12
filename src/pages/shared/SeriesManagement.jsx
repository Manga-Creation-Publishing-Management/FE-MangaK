import { useState } from "react";
import CreateSeriesModal from "../../features/series/components/CreateSeriesModal";
<<<<<<< HEAD
import { Link } from "react-router";
=======
// import { Link } from "react-router";
>>>>>>> 245483b8384c7e6a14e981545c9565497def0429
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { StatusBadge } from "./StatusBadge";

<<<<<<< HEAD
export function SeriesManagement({ role }) {

  const {
    showCreateSeriesModal,
=======

export function SeriesManagement({ role, statusFilter, seriesFiltered }) {

  const {
    showCreateSeriesModal,
    reload,
>>>>>>> 245483b8384c7e6a14e981545c9565497def0429
    handleReload,
    handleClick,
    handleNavigate
  } = useSeriesManagement();

<<<<<<< HEAD
  const { seriesData } = useCreateSeries();
  console.log(seriesData);

  return (
    <>
      <div className="p-8 space-y-8">
        {role === "mangaka" &&
          <div className="flex justify-between items-center">
            <div>
              <h1>Series Management</h1>
              <p className="text-muted-foreground mt-1">Manage your series and chapters</p>
=======
  const { seriesData } = useCreateSeries(null, handleReload, reload);
  console.log(seriesData);

  //Nếu seriesFilterd: bên ngoài truyền vào dữ liệu đã lọc thì ưu tiên 
  // in ra dữ liệu đã lọc đó
  let filteredSeriesData;

  if (seriesFiltered) {
    filteredSeriesData = seriesFiltered;
  }
  else {
    // Filter series by status if statusFilter is provided
    filteredSeriesData = statusFilter
      ? seriesData.filter(item => statusFilter.includes(item.status))
      : seriesData;
  }

  console.log(role);
  // console.log("Filtered Data for Tantou:", filteredSeriesData);
  console.log("Filtered Data for Editorial", filteredSeriesData);

  return (
    <>
      <div className="p-3 mb-5">
        {role === "mangaka" &&
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-sidebar-foreground font-medium text-2xl pb-1">Series Management</h1>
              <p className="text-muted-foreground">Manage your series and chapters</p>
>>>>>>> 245483b8384c7e6a14e981545c9565497def0429
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
<<<<<<< HEAD
          {seriesData.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className='h-48 w-100 relative'>
=======
          {filteredSeriesData?.map(item => (
            <div key={item.seriesId} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className='h-48 w-full relative'>
>>>>>>> 245483b8384c7e6a14e981545c9565497def0429
                <img className="w-full h-full object-cover" src={item.coverFile} alt="cover file" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3>{item.title}</h3>
<<<<<<< HEAD
                  <p className="text-sm text-muted-foreground mt-1">0 Chpaters</p>
                </div>
                <StatusBadge status={item.status} />
                <button className="cursor-pointer w-full block text-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => handleNavigate(item.id)}
=======
                  <p className="text-sm text-muted-foreground mt-1">{item.totalChapters || 0} Chapters</p>
                </div>
                <StatusBadge status={item?.status.toLowerCase()} />
                <button className="cursor-pointer w-full block text-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => handleNavigate(role, item.seriesId)}
>>>>>>> 245483b8384c7e6a14e981545c9565497def0429
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}

        </div>
<<<<<<< HEAD

      </div>
      {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)}

=======
      </div>
      {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)}


>>>>>>> 245483b8384c7e6a14e981545c9565497def0429
    </>

  );
}