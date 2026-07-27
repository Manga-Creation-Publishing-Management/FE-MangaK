import { useEffect, useState } from "react";
import { incomeService } from "../../../services/incomeService";

export function useIncomeHistory() {
  const [monthlyIncomesList, setMonthlyIncomesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const response = await incomeService.getMonthlyIncomesList();
        setMonthlyIncomesList(response.data || []);
      } catch (error) {
        console.error("Error fetching monthly income history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  return {
    monthlyIncomesList,
    loading
  };
}