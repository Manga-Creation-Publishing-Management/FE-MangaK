import { use, useEffect, useState } from "react"
import { incomeService } from "../../../services/incomeService";

export function useIncomeHistory() {
  
  const [monthlyIncomesList, setMonthlyIncomesList] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const response = await incomeService.getMonthlyIncomesList();
      setMonthlyIncomesList(response.data);
    }
    fetchApi();
  }, [])


  return {
    monthlyIncomesList
  }
}