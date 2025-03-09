import { Dialog, FormGroup, InputGroup, Button, Switch } from '@blueprintjs/core';
import { useForm, Controller } from 'react-hook-form';

type AddFamilyMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { display_name: string; public: boolean }) => void;
};

export const AddFamilyMemberDialog = ({ isOpen, onClose, onSubmit }: AddFamilyMemberDialogProps) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      display_name: '',
      public: false,
    },
  });

  const handleFormSubmit = async (data: { display_name: string; public: boolean }) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup label="Display Name">
          <Controller
            name="display_name"
            control={control}
            render={({ field }) => <InputGroup {...field} />}
          />
        </FormGroup>
        <FormGroup label="Public">
          <Controller
            name="public"
            control={control}
            render={({ field }) => <Switch checked={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} inputRef={field.ref} />}
          />
        </FormGroup>
        <Button type="submit" intent="primary">Add</Button>
        <Button type="button" onClick={onClose}>Cancel</Button>
      </form>
    </Dialog>
  );
};
