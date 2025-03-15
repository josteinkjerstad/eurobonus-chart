import { useEffect, useMemo, useState } from "react";
import useLoadTransactions from "../hooks/useLoadTransactions";
import { Charts } from "./charts/Charts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Divider, Spinner } from "@blueprintjs/core";
import { UploadSection } from "./profile/UploadSection";

export const TestDashboard = () => {
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const profile: Profile = useMemo(
    () => ({ id: "1", display_name: "Anonymous Monkey", created: new Date(2025, 1, 20).toISOString(), user_id: "1" }),
    []
  );

  const { data, loading, loadTransactions } = useLoadTransactions();

  const onUpload = async (input: FormData) => {
    const file = input.get("file") as File;
    if (file) {
      await loadTransactions(file);
    }
  };

  useEffect(() => {
    setTransaction(data);
  }, [data]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "90%", justifySelf: "center" }}>
      <UploadSection onUpload={onUpload} profiles={[profile]} />
      <Divider />
      {transaction.length > 0 && <Charts transactions={transaction} profiles={[profile]} />}
    </div>
  );
};
