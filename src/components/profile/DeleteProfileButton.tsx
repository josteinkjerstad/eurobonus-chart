import { Button, Intent, Icon } from "@blueprintjs/core";

export const DeleteAccountButton = () => {
  const handleDelete = async () => {
    const response = await fetch("/api/profile/delete", {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error deleting account: ${errorText}`);
    }
  };

  return (
    <Button intent={Intent.DANGER} icon={<Icon icon="trash" />} onClick={handleDelete}>
      Delete Your Account
    </Button>
  );
};
