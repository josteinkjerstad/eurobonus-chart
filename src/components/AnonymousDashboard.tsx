import { useEffect, useMemo, useState } from "react";
import useLoadTransactions from "../hooks/useLoadTransactions";
import { Charts } from "./charts/Charts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Divider, Spinner } from "@blueprintjs/core";
import { UploadSection } from "./profile/UploadSection";
import { calculateTotalBonusPoints, getEarliestDate } from "../utils/calculations";
import { CsvUpload } from "./profile/CsvUpload";

export const AnonymousDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    setTransactions(data);
  }, [data]);

  const sum = useMemo(() => calculateTotalBonusPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestDate(transactions), [transactions]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <CsvUpload onUpload={onUpload} profileId={profile.id} />
      <br />
      {sum > 0 && <p>{`You've earned a total of ${sum.toLocaleString()} eurobonus points since ${earliestdate}`}</p>}
      {transactions.length > 0 && <Charts transactions={transactions} profiles={[profile]} />}
    </>
  );
};
