export const useDeleteViatrumfTransactions = () => {
  const deleteViatrumfTransactions = async () => {
    const response = await fetch("/api/delete-viatrumf-transactions", {
      method: "POST",
    });

    if (!response.ok) {
      alert(`Error deleting viatrumf transactions`);
    }
  };

  return {
    deleteViatrumfTransactions,
  };
};
