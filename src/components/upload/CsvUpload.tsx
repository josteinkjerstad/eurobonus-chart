import { useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./CsvUpload.module.scss";

export const CsvUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setIsLoading(false);

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      const errorText = await response.text();
      alert(`Error uploading transactions: ${errorText}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fileInputContainer}>
        <label htmlFor="file-input" className={styles.fileInputLabel}>
          Select File
        </label>
        <div className={styles.fileName}>
          {selectedFile?.name ?? "No file selected"}
        </div>
      </div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        id="file-input"
        className={styles.fileInput}
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
        className={styles.uploadButton}
      >
        Upload
      </button>
      {isLoading && <div className={styles.loading}>Uploading...</div>}
    </div>
  );
};
