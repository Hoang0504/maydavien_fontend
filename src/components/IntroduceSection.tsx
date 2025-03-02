"use client";

import { useEffect, useState } from "react";
import { Introduce } from "@/models/Introduce";
import { getIntroduces } from "@/services/introduceService";
import IntroduceBox from "./IntroduceBox";

function IntroduceSection({ id }: { id: string }) {
  const [introduces, setIntroduces] = useState<Introduce[]>([]);

  useEffect(() => {
    getIntroduces()
      .then((b) => setIntroduces(b.data))
      .catch(console.error);
  }, []);

  return (
    <div id={id}>
      {introduces.map((introduce: Introduce, index: number) => (
        <IntroduceBox key={introduce.id} introduce={introduce} index={index} />
      ))}
    </div>
  );
}

export default IntroduceSection;
