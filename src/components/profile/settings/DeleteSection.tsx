import { DeleteButton } from "../../shared/DeleteButton";
import { useDeleteAccount } from "../../../hooks/useDeleteAccount";
import { useDeleteTransactions } from "../../../hooks/useDeleteTransactions";
import { useDeleteViatrumfTransactions } from "../../../hooks/useDeleteViatrumfTransactions";
import { Grid } from "@mui/material";

export const DeleteSection = () => {
  const { deleteAccount } = useDeleteAccount();
  const { deleteTransactions } = useDeleteTransactions();
  const { deleteViatrumfTransactions } = useDeleteViatrumfTransactions();

  return (
    <>
      <DeleteButton
        label="Delete SAS Transactions"
        dialogLabel="Are you sure you want to delete all your SAS transactions? This action cannot be undone."
        onDelete={deleteTransactions}
      />
      <DeleteButton
        label="Delete Viatrumf Transactions"
        dialogLabel="Are you sure you want to delete all your Viatrumf transactions? This action cannot be undone."
        onDelete={deleteViatrumfTransactions}
      />
      <DeleteButton
        label="Delete Account"
        dialogLabel="Are you sure you want to delete your account? This action cannot be undone."
        onDelete={deleteAccount}
      />
    </>
  );
};
