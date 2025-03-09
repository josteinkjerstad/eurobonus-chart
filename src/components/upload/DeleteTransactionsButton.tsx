import styles from "./DeleteTransactionsButton.module.scss";

export const DeleteTransactionsButton = () => {
  const handleDelete = async () => {
    const response = await fetch("/api/delete-transactions", {
      method: "POST",
    });

    if (response.ok) {
      alert("Transactions deleted successfully!");
    } else {
      const errorText = await response.text();
      alert(`Error deleting transactions: ${errorText}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={styles.deleteButton}
    >
      <span className={styles.trashIcon}></span>
      Delete All Transactions
    </button>
  );
};
