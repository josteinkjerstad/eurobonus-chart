import { DeleteButton } from "../shared/DeleteButton";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { useDeleteTransactions } from "../../hooks/useDeleteTransactions";

export const DeleteSection = () => {
  const { deleteAccount } = useDeleteAccount();
  const { deleteTransactions } = useDeleteTransactions();

  return (
    <>
      <DeleteButton
        label="Delete All Transactions"
        dialogLabel="Are you sure you want to delete all transactions? This action cannot be undone."
        onDelete={deleteTransactions}
      />
      <DeleteButton
        label="Delete Account"
        dialogLabel="Are you sure you want to delete your account? This action cannot be undone."
        onDelete={deleteAccount}
      />
    </>
  );
};
