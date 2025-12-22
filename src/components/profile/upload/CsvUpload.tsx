import type { ChangeEvent } from "react";
import { Button, Typography, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type CsvUploadProps = {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
};

export const CsvUpload = ({ selectedFile, onFileSelect }: CsvUploadProps) => {
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} sx={{ width: "400px", justifyContent: "flex-start" }}>
        {selectedFile?.name ?? "Choose file"}
        <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileSelect} />
      </Button>
    </Box>
  );
};
