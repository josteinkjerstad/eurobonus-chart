import { useState, useEffect } from "react";
import type { Transaction } from "../models/transaction";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";

const useFetchViatrumfTransactions = () => {
  const [data, setData] = useState<ViatrumfTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsResponse = await fetch("/api/viatrumf-transactions");
      const transactions = (await transactionsResponse.json()) as ViatrumfTransaction[];
      setData(transactions);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  return { data, loading };
};

export default useFetchViatrumfTransactions;
