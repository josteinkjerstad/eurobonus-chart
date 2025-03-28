import { InputGroup } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { useState } from "react";
import { useChangeDisplayName } from "../../hooks/useChangeDisplayName";
import { useDeleteMember } from "../../hooks/useDeleteMember";
import styles from "./MemberSection.module.scss";
import { PeriodSelector } from "../shared/PeriodPeriodSelector";
import { DeleteButton } from "../shared/DeleteButton";

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
    <div className={styles.member}>
      <InputGroup onChange={e => setDisplayName(e.target.value)} value={displayName} onBlur={changeDisplayName} />
      <div className={styles.memberButtons}>
        <PeriodSelector profile={member} />
        <DeleteButton label={"Delete"} dialogLabel={`Are you sure you want to delete ${member.display_name}?`} onDelete={deleteMember} />
      </div>
    </div>
  );
};
