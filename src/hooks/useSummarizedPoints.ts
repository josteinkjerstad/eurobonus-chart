import { useEffect, useState } from "react";

export const useSummarizedPoints = () => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummarizedPoints = async () => {
      try {
        const response = await fetch("/api/summarized-points");
        if (!response.ok) {
          throw new Error(`Error fetching summarized points: ${response.statusText}`);
        }
        const data = await response.json();
        setData(data.map((row: { points: number }) => row.points));
      } finally {
        setLoading(false);
      }
    };

    fetchSummarizedPoints();
  }, []);

  return { data, loading, error };
};
