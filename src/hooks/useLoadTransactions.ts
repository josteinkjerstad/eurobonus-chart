import { useState } from "react";
import type { Transaction } from "../models/transaction";

const useLoadTransactions = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/load-transactions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to load transactions");
      }

      const transactions = (await response.json()) as Transaction[];
      setData(transactions);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, loadTransactions };
};

export default useLoadTransactions;
