import { useState, useEffect } from "react";
import type { SummarizedTransaction } from "../models/transaction";

const useFetchTotalTransactions = () => {
  const [data, setData] = useState<SummarizedTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsResponse = await fetch("/api/summarized-transactions");

      const transactions = (await transactionsResponse.json()) as SummarizedTransaction[];

      setData(transactions);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  return { data, loading };
};

export default useFetchTotalTransactions;
