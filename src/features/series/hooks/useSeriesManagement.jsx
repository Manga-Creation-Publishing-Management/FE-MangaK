import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function useSeriesManagement() {
  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = (role,seriesId) => {
    navigate(`${seriesId}`, { state: { role } });
  }

  const handleNavigateToChapter = (role, seriesId, chapterData) => {
    navigate(`../chapter/${chapterData}`, { state: { role } });
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