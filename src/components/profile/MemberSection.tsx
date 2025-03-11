import { Button, H5 } from "@blueprintjs/core";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";
import { Member } from "./Member";
import type { Profile } from "../../models/profile";
import { useState } from "react";
import styles from "./MemberSection.module.scss";

type MemberSectionProps = {
  members: Profile[];
  onChange(members: Profile[]): void;
};

export const MemberSection = ({ members, onChange }: MemberSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (id: string) => {
    onChange(members.filter(member => member.id !== id));
  };

  const handleAdd = (member: Profile) => {
    onChange([...members, member]);
  };

  const handleChange = (member: Profile) => {
    onChange(members.map(m => (m.id === member.id ? member : m)));
  };

  return (
    <div className={styles.container}>
      <H5>Point Sharing Members</H5>
      {members.map(member => (
        <Member key={member.id} member={member} onDelete={handleDelete} onChange={handleChange} />
      ))}
      <Button onClick={() => setIsOpen(true)}>Add member</Button>
      {isOpen && <AddFamilyMemberDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onAdd={handleAdd} />}
    </div>
  );
};
