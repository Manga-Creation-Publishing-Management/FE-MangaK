import { useState, useEffect } from "react";
import { seriesService } from "../../../services/seriesService";

export default function useSeriesList(reloadState) {
    const [seriesData, setSeriesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                setIsLoading(true);
                const resultsSeries = await seriesService.getAllSeries();
                setSeriesData(resultsSeries.data.toReversed());
            } catch (error) {
                console.error("Fail when loading series list", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeries();
    }, [reloadState]); // Fetch lại khi reloadState thay đổi

    return { seriesData, isLoading };
}
