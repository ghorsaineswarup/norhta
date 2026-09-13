"use client";

import { useState, ReactNode } from "react";
import AssemblyIntro from "@/components/AssemblyIntro";

export default function HomeClient({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <AssemblyIntro onComplete={() => setIntroDone(true)} />}
      {introDone && children}
    </>
  );
}