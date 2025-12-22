import { useState } from "react";
import styles from "./ChangePasswordForm.module.scss";
import { useChangePassword } from "../../hooks/useChangePassword";
import { validatePassword } from "../../utils/validations";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Grid } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export const ChangePasswordForm = () => {
  const { changePassword, loading, successMessage, error } = useChangePassword();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setPasswordError("");
    await changePassword(newPassword, confirmPassword);
    if (successMessage) {
      setIsDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setPasswordError("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Grid>
      <Button variant="outlined" startIcon={<LockIcon />} onClick={() => setIsDialogOpen(true)} sx={{ justifyContent: "flex-start" }}>
        Change Password
      </Button>
      <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className={styles.form} id="change-password-form">
            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
              fullWidth
              error={!!passwordError}
              helperText={passwordError}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="change-password-form" disabled={loading} variant="contained">
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
