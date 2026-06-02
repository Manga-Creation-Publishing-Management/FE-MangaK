import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function useSeriesManagement() {
  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = (seriesId) => {
    navigate(`${seriesId}`)
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
    handleNavigate
  };
}