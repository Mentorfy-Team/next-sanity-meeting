import { FeatureCard } from "@/components/organisms/FeatureCard";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/sanity/sanity-utils";
import { trpc } from "@/utils/trpc";
import {
  ArrowRightIcon,
  CameraIcon,
  HomeIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex flex-col items-center">
        <span className="text-4xl">Bem-vindo ao</span>
        <h1 className="text-7xl font-extrabold">
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Meeting Mentorfy
          </span>
        </h1>
      </div>
      <p className="mt-12 text-2xl text-gray-400">
        Meeting Mentorfy é uma plataforma de aprendizado online que permite que
        Mentores e mentorados se conectem e colaborem em tempo real.
      </p>
      <p className="mt-2 text-2xl text-gray-400">
        Crie suas próprias salas para hospedar sessões ou participe de outras
        usando um link curto e conveniente.
      </p>
      <Button className="mt-6 bg-transparent text-primary-400 text-2xl p-0 hover:bg-transparent">
        Saiba mais sobre o Meeting Mentorfy{" "}
        <ArrowRightIcon className="ml-3 mt-2 scale-150" />
      </Button>
      <h2 className="mt-24 font-bold text-gray-400 text-2xl">
        EXPLORE NOSSOS RECURSOS
      </h2>
      <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          title="Iniciar uma reunião"
          description="Inicie uma aula virtual com vídeo, áudio, compartilhamento de tela, chat e todas as ferramentas necessárias para aprendizado aplicado."
          icon={<VideoIcon className="scale-150" />}
        />
        <FeatureCard
          title="Grave suas reuniões"
          description="Grave as reuniões do Meeting Mentorfy e compartilhe-as com os alunos para revisão e reflexão sobre o material."
          icon={<CameraIcon className="scale-150" />}
        />
        <FeatureCard
          title="Gerencie suas salas"
          description="Configure suas salas e as configurações de reunião para ser responsável por uma sala de aula eficaz.

          "
          icon={<HomeIcon className="scale-150" />}
        />
        <FeatureCard
          title="E mais!"
          description="O Meeting Mentorfy oferece ferramentas integradas para aprendizado aplicado e é projetado para economizar tempo durante a aula.

          "
          icon={<VideoIcon className="scale-150" />}
        />
      </div>
    </div>
  );
}
