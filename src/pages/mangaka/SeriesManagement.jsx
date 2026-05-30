import { useState } from "react";
import CreateSeriesModal from "../../features/series/components/CreateNewSeries";

export function SeriesManagement() {
  //  const location = useLocation();
  //   const [showCreateSeries, setShowCreateSeries] = useState(false);

  //   const role = location.pathname.includes('mangaka') ? 'mangaka' :
  //                location.pathname.includes('tantou') ? 'tantou' : 'editorial';

  //   const allSeries = [
  //     { id: 1, name: 'The Last Warrior', author: 'Akira Tanaka', chapters: 24, status: 'approved' as const, coverColor: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  //     { id: 2, name: 'Moonlight Chronicles', author: 'Yuki Sato', chapters: 12, status: 'processing' as const, coverColor: 'bg-gradient-to-br from-orange-400 to-pink-500' },
  //     { id: 3, name: 'Dark Academia', author: 'Hiro Yamada', chapters: 8, status: 'processing' as const, coverColor: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
  //   ];

  //   const series = role === 'editorial'
  //     ? allSeries.filter(s => s.status === 'processing')
  //     : allSeries;

  //   const pageTitle = role === 'editorial' ? 'Series Approval' : 'Series Management';
  //   const pageDesc = role === 'mangaka' ? 'Manage your series and chapters'
  //     : role === 'tantou' ? 'Review and approve series for Editorial Board'
  //     : 'Review and approve series pending editorial decision';

  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);

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
            <div />
            <div className="p-6 space-y-4">
              <div>
                <h3>Name</h3>
                <p className="text-sm text-muted-foreground mt-1">Chapters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCreateSeriesModal && (<CreateSeriesModal onClose ={handleClick} />)}

    </>

  );
}