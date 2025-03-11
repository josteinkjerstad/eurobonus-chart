import { H5 } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { CsvUpload } from "./CsvUpload";

type UploadSectionProps = {
  profiles: Profile[];
};

export const UploadSection = ({ profiles }: UploadSectionProps) => (
  <div>
    <H5>Upload Transactions</H5>
    <p>
      To display your data, please download the transaction file from your SAS profile and upload it here.
      <br />
      All old transactions will automatically be removed when uploading a new file.
    </p>
    <CsvUpload profiles={profiles} />
  </div>
);
