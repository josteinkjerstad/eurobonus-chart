import { Dialog, FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { useForm, Controller } from 'react-hook-form';

type AddFamilyMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export const AddFamilyMemberDialog = ({ isOpen, onClose, onSubmit }: AddFamilyMemberDialogProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      display_name: '',
    },
  });

  const handleFormSubmit = async (data: { display_name: string; }) => {
    onSubmit(data.display_name);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} style={{padding: '20px', width: '400px', height: '200px' }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup label="Display Name">
          <Controller
            name="display_name"
            control={control}
            render={({ field }) => <InputGroup {...field} />}
          />
        </FormGroup>
        <Button type="submit" intent="primary">Add</Button>
        <Button type="button" onClick={onClose}>Cancel</Button>
      </form>
    </Dialog>
  );
};
