import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function useSeriesManagement() {
  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = (role, seriesId) => {
    navigate(`/${role}/series/${seriesId}`, { state: { role } });
  }

  const handleNavigateToChapter = (role, seriesId, chapterData) => {
    navigate(`/${role}/chapter/${chapterData}`, { state: { role, seriesId, chapterData } });
  }

  const handleReload = () => {
    setReload(!reload);
  }

  const handleClick = () => {
    setShowCreateSeriesModal(!showCreateSeriesModal);
  }
  return {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate,
    handleNavigateToChapter
  };
}