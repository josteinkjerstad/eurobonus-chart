import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
    <Grid>
      <Button
        fullWidth
        color="error"
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => setIsDialogOpen(true)}
        sx={{ justifyContent: "flex-start" }}
      >
        {label}
      </Button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>{dialogLabel}</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
