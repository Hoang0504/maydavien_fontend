"use client";

import { useEffect, useState } from "react";

import IntroduceBox from "./IntroduceBox";
import { Introduce } from "@/models/Introduce";
import { getIntroduces } from "@/services/introduceService";
import { useLoading } from "@/context/loadingContext";

function IntroduceSection({ id }: { id: string }) {
  const { setLoading } = useLoading();
  const [introduces, setIntroduces] = useState<Introduce[]>([]);

  const fetchIntroducesData = async () => {
    setLoading(true);
    const data = await getIntroduces();
    setIntroduces(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIntroducesData();
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
