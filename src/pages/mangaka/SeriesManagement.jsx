import { useState } from "react";
import CreateSeriesModal from "../../features/series/components/CreateSeriesModal";
import { Link } from "react-router";

export function SeriesManagement() {

  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleClick = () => {
    setShowCreateSeriesModal(!showCreateSeriesModal);
  }
  return (
    <>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1>SeriesManagement</h1>
            <p className="text-muted-foreground mt-1">Desc</p>
          </div>
          <button
            onClick={handleClick}
            className="cursor-pointer border-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Create New Series
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div  />
              <div className="p-6 space-y-4">
                <div>
                  <h3>Name</h3>
                  <p className="text-sm text-muted-foreground mt-1"> Chapters</p>
                </div>
                <Link
                  className="block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  View Details
                </Link>
              </div>
            </div>
        </div>
      </div>
      {showCreateSeriesModal && (<CreateSeriesModal onClose ={handleClick} onReload={handleReload} />)}

    </>

  );
}