"use client";

import { useState, useEffect, ReactNode } from "react";
import AssemblyIntro from "@/components/AssemblyIntro";

const INTRO_SEEN_KEY = "norhta_intro_seen";

export default function HomeClient({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(true); // default true to avoid flash before check
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY);
    setIntroDone(!!seen);
    setChecked(true);
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    setIntroDone(true);
  }

  if (!checked) return null; // avoid flashing either state before we know

  return (
    <>
      {!introDone && <AssemblyIntro onComplete={handleIntroComplete} />}
      {introDone && children}
    </>
  );
}