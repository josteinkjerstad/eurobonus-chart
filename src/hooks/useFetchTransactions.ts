import { useState, useEffect } from "react";
import type { Transaction } from "../models/transaction";

const useFetchTransactions = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsResponse = await fetch("/api/transactions");
      const transactions = (await transactionsResponse.json()) as Transaction[];
      setData(transactions);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  return { data, loading };
};

export default useFetchTransactions;
