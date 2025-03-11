import { H4 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { CsvUpload } from "./CsvUpload";
import styles from "./UploadSection.module.scss";

type UploadSectionProps = {
  profiles: Profile[];
};

export const UploadSection = ({ profiles }: UploadSectionProps) => (
  <div className={styles.container}>
    <H4>Upload Transactions</H4>
    <p>
      To display your data, please download the transaction file from your SAS profile and upload it here.
      <br />
      All old transactions will automatically be removed when uploading a new file.
    </p>
    <CsvUpload profiles={profiles} />
  </div>
);
