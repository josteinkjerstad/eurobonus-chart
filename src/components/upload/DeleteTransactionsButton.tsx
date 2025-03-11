import { Button, Intent, Icon } from "@blueprintjs/core";

export const DeleteTransactionsButton = () => {
  const handleDelete = async () => {
    const response = await fetch("/api/delete-transactions", {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Transactions deleted successfully!");
    } else {
      const errorText = await response.text();
      alert(`Error deleting transactions: ${errorText}`);
    }
  };

  return (
    <Button
      intent={Intent.DANGER}
      icon={<Icon icon="trash" />}
      onClick={handleDelete}
    >
      Delete All Transactions
    </Button>
  );
};
