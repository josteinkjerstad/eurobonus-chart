import { TextField } from "@mui/material";

type ViatrumfUploadProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ViatrumfUpload = ({ value, onChange }: ViatrumfUploadProps) => {
  return (
    <div style={{ display: "flex", width: "100%", flexDirection: "row", gap: "10px", paddingTop: 10 }}>
      <TextField
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your viatrumf transactions here"
        multiline
        fullWidth
        sx={{
          "& .MuiInputBase-root": {
            height: 200,
            alignItems: "flex-start",
            overflow: "scroll",
          },
        }}
      />
    </div>
  );
};
