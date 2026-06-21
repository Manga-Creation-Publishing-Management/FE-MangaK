import { useEffect, useState } from "react"
import { incomeService } from "../../../services/incomeService";

export function useIncome() {
  

  const [totalIncome, setTotalIncome] = useState(0);

  const [countCompletedTask, setCountCompletedTask] = useState(0);

  useEffect(() => {
    const fetchApi = async () => {
      const response = await incomeService.getIncomeTask("Pending");
      console.log("income total: ", response.data.incomes.length);
      setTotalIncome(response.data.totalMonth);
      setCountCompletedTask(response.data.incomes.length);
    }
    fetchApi();
  }, [])

  return {
    totalIncome,
    countCompletedTask
  }
}