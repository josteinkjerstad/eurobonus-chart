import { Button, InputGroup } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { useState } from "react";
import { useChangeDisplayName } from "../../hooks/useChangeDisplayName";
import { useDeleteMember } from "../../hooks/useDeleteMember";
import styles from "./ProfileSection.module.scss";

type MemberProps = {
  member: Profile;
  onDelete: (id: string) => void;
  onChange: (member: Profile) => void;
};

export const Member = ({ member, onDelete, onChange }: MemberProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(member.display_name);

  const deleteMember = useDeleteMember(member.id, onDelete);
  const changeDisplayName = useChangeDisplayName(member.id, setDisplayName);

  const handleSaveClick = async () => {
    const event = { target: { value: displayName } } as React.ChangeEvent<HTMLInputElement>;
    await changeDisplayName(event);
    onChange({ ...member, display_name: displayName });
    setIsEditing(false);
  };

  return (
    <div className={styles.members}>
      <div style={{ display: "flex", minWidth: "200px" }}>
        {isEditing ? <InputGroup value={displayName} onChange={e => setDisplayName(e.target.value)} /> : <span>{member.display_name}</span>}
      </div>

      <div className={styles.memberButtons}>
        {isEditing ? (
          <Button icon="tick" intent="success" onClick={handleSaveClick} style={{ marginRight: "5px" }} />
        ) : (
          <Button icon="edit" onClick={() => setIsEditing(true)} style={{ marginRight: "5px" }} />
        )}
        <Button icon="trash" intent="danger" onClick={deleteMember} style={{ marginRight: "5px" }} />
      </div>
    </div>
  );
};
