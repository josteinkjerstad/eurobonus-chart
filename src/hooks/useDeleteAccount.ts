export const useDeleteAccount = () => {
  const deleteAccount = async () => {
    const response = await fetch("/api/profile/delete", {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.href = "/signin";
    }
  };

  return {
    deleteAccount,
  };
};
