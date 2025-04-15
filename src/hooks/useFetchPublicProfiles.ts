import { useState, useEffect } from "react";
import type { Profile } from "../models/profile";

const useFetchPublicProfiles = (userId: string) => {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const userResponse = await fetch(`/api/user-profiles?user_id=${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const profiles = (await userResponse.json()) as Profile[];
      setData(profiles);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  return { data, loading };
};

export default useFetchPublicProfiles;
