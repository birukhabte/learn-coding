"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loader should disappear once hydration + page render is done
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner />
    </div>
  );
}