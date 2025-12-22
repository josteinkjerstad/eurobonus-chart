import { Member } from "./Member";
import type { Profile } from "../../../models/profile";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type MemberSectionProps = {
  members: Profile[];
  onChange(members: Profile[]): void;
};

export const MemberSection = ({ members, onChange }: MemberSectionProps) => {
  const handleDelete = (id: string) => {
    onChange(members.filter(member => member.id !== id));
  };

  const addMember = async () => {
    const response = await fetch("/api/profile/add-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    });

    if (!response.ok) {
      throw new Error("Failed to add member");
    }

    const newMember = (await response.json()) as Profile;
    onChange([...members, newMember]);
  };

  const handleChange = (member: Profile) => {
    onChange(members.map(m => (m.id === member.id ? member : m)));
  };

  return (
    <Grid justifySelf={"center"} container width={"85%"}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Qualifying Period</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(member => (
              <Member key={member.id} member={member} onChange={handleChange} onDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addMember} sx={{ mt: 2 }}>
        Add Member
      </Button>
    </Grid>
  );
};
