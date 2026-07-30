import { useEffect, useState } from 'react';
import { incomeService } from '@/services/incomeService';

export function useIncome() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [countCompletedTask, setCountCompletedTask] = useState(0);
  const [paidIncomes, setPaidIncomes] = useState([]);
  const [loadingPaid, setLoadingPaid] = useState(false);
  const [reload, setReload] = useState(false);

  const handleReload = () => setReload((prev) => !prev);

  useEffect(() => {
    const fetchPaidIncome = async () => {
      setLoadingPaid(true);
      try {
        const response = await incomeService.getIncomeTask("Paid");
        if (response && response.data) {
          const list = response.data.incomes || [];
          setTotalIncome(response.data.totalMonth || 0);
          setCountCompletedTask(list.length);
          setPaidIncomes(list);
        }
      } catch (error) {
        console.error("Error fetching paid incomes:", error);
      } finally {
        setLoadingPaid(false);
      }
    };

    fetchPaidIncome();
  }, [reload]);

  return {
    totalIncome,
    countCompletedTask,
    paidIncomes,
    loadingPaid,
    handleReload
  };
}