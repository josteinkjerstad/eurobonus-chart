export const useDeleteAccount = () => {
  const deleteAccount = async () => {
    const response = await fetch("/api/profile/delete", {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Error deleting account`);
    }
  };

  return {
    deleteAccount,
  };
};
