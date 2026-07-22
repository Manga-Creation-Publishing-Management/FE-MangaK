import { useEffect, useState } from "react";
import { taskService } from "../../../services/taskService";

export function useGetPageRange(chapterId) {
  const [assignedRanges, setAssignedRanges] = useState("");
  const [isLoadingRanges, setIsLoadingRanges] = useState(false);

  useEffect(() => {
    if (!chapterId) {
      setAssignedRanges("");
      return;
    }

    const fetchPageRanges = async () => {
      setIsLoadingRanges(true);
      try {
        const response = await taskService.getPageRange(chapterId);
        console.log("getPageRange response:", response);
        
        if (response && response.success) {
            setAssignedRanges(response.data || "None");
        } else {
            setAssignedRanges("");
        }
      } catch (error) {
        console.error("Failed to fetch assigned page ranges", error);
        setAssignedRanges("");
      } finally {
        setIsLoadingRanges(false);
      }
    };

    fetchPageRanges();
  }, [chapterId]);

  return { assignedRanges, isLoadingRanges };
}
