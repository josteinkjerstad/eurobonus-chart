import { useState, useEffect } from "react";
import type { Profile } from "../models/profile";

const useFetchProfiles = () => {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const userResponse = await fetch("/api/profiles");
      const profiles = (await userResponse.json()) as Profile[];
      setData(profiles);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  return { data, loading };
};

export default useFetchProfiles;
