export const useDeleteTransactions = () => {
  const deleteTransactions = async () => {
    const response = await fetch("/api/delete-transactions", {
      method: "POST",
    });

    if (!response.ok) {
      alert(`Error deleting transactions`);
    }
  };

  return {
    deleteTransactions,
  };
};
