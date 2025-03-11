import { Dialog, FormGroup, InputGroup, Button } from "@blueprintjs/core";
import { useForm, Controller } from "react-hook-form";
import type { Profile } from "../../models/profile";

type AddFamilyMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Profile) => void;
};

export const AddFamilyMemberDialog = ({
  isOpen,
  onClose,
  onAdd,
}: AddFamilyMemberDialogProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      display_name: "",
    },
  });

  const addMember = async (name: string) => {
    const response = await fetch("/api/profile/add-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to add member");
    }

    const newMember = (await response.json()) as Profile;
    onAdd(newMember);
  };

  const handleFormSubmit = async (data: { display_name: string }) => {
    addMember(data.display_name);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      style={{ padding: "20px", width: "400px", height: "200px" }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup label="Display Name">
          <Controller
            name="display_name"
            control={control}
            render={({ field }) => <InputGroup {...field} />}
          />
        </FormGroup>
        <Button type="submit" intent="primary">
          Add
        </Button>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
      </form>
    </Dialog>
  );
};
