"use client";

import { trpc } from "@/utils/trpc";

const HomeHello = () => {
  const { data } = trpc.home.getStatus.useQuery({});

  return (
    <div>
      <h1>Hello World {data?.status}</h1>
    </div>
  );
};

export default HomeHello;
