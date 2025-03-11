import { Button } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";

type MemberProps = {
  member: Profile;
  onDelete: (id: string) => void;
};

export const Member = ({ member, onDelete }: MemberProps) => {
  const deleteMember = async () => {
    const response = await fetch("/api/profile/delete-member", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: member.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete family member");
    } else {
      onDelete(member.id!);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <div style={{ flex: 1 }}>
        <span>{member.display_name}</span>
      </div>
      <div style={{ gap: 5, display: "flex", alignItems: "center" }}>
        <Button
          icon="trash"
          intent="danger"
          onClick={deleteMember}
          style={{ marginRight: "5px" }}
        />
      </div>
    </div>
  );
};
