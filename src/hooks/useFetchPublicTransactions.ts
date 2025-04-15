import { useState, useEffect } from "react";
import type { Transaction } from "../models/transaction";

const useFetchPublicTransactions = (userId: string) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsResponse = await fetch(`/api/user-transactions?user_id=${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const transactions = (await transactionsResponse.json()) as Transaction[];
      setData(transactions);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  return { data, loading };
};

export default useFetchPublicTransactions;
