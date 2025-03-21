import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import styles from "./DeleteButton.module.scss";
import { useState } from "react";

type DeleteButtonProps = {
  label: string;
  dialogLabel: string;
  onDelete: () => Promise<void>;
};

export const DeleteButton = ({ label, dialogLabel, onDelete }: DeleteButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    setIsDialogOpen(false);
  };
  return (
    <div className={styles.deleteButton}>
      <Button intent={Intent.DANGER} variant="minimal" onClick={() => setIsDialogOpen(true)}>
        {label}
      </Button>
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Confirm Deletion">
        <div className={Classes.DIALOG_BODY}>{dialogLabel}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button intent={Intent.DANGER} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
