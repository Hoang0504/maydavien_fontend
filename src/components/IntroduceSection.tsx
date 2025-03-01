"use client";

import { useEffect, useState } from "react";
import { Introduce } from "@/models/Introduce";
import { getIntroduces } from "@/services/introduceService";
import IntroduceBox from "./IntroduceBox";

function IntroduceSection() {
  const [introduces, setIntroduces] = useState<Introduce[]>([]);

  useEffect(() => {
    getIntroduces()
      .then((b) => setIntroduces(b.data))
      .catch(console.error);
  }, []);

  return (
    <>
      {introduces.map((introduce: Introduce, index: number) => (
        <IntroduceBox key={introduce.id} introduce={introduce} index={index} />
      ))}
    </>
  );
}

export default IntroduceSection;
