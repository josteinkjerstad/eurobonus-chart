import type { Profile } from "../../../models/profile";
import { useState } from "react";
import { useChangeDisplayName } from "../../../hooks/useChangeDisplayName";
import { useDeleteMember } from "../../../hooks/useDeleteMember";
import { PeriodSelector } from "../../shared/PeriodSelector";
import { DeleteButton } from "../../shared/DeleteButton";
import { TableCell, TableRow, TextField, IconButton } from "@mui/material";

type MemberProps = {
  member: Profile;
  onDelete: (id: string) => void;
  onChange: (member: Profile) => void;
};

export const Member = ({ member, onDelete, onChange }: MemberProps) => {
  const [displayName, setDisplayName] = useState(member.display_name);

  const handleChange = (newValue: string) => {
    setDisplayName(newValue);
    onChange({ ...member, display_name: newValue });
  };

  const deleteMember = useDeleteMember(member.id, onDelete);
  const changeDisplayName = useChangeDisplayName(member.id, handleChange);

  return (
    <TableRow>
      <TableCell>
        <TextField
          variant="standard"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          onBlur={e => changeDisplayName(e.target.value)}
          fullWidth
        />
      </TableCell>
      <TableCell>
        <PeriodSelector profile={member} />
      </TableCell>
      <TableCell>
        <DeleteButton label="Delete" dialogLabel={`Are you sure you want to delete ${member.display_name}?`} onDelete={deleteMember} />
      </TableCell>
    </TableRow>
  );
};
