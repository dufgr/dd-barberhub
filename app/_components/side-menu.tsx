"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  DropletsIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  ScissorsIcon,
  SparklesIcon,
  UserIcon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";

// Reúne autenticação e atalhos de serviço no menu mobile.
const SideMenu = () => {
  const { data } = useSession();

  const handleLogoutClick = () => signOut();

  // Usa credenciais locais no desenvolvimento e Google em produção.
  const handleLoginClick = () => signIn(process.env.NODE_ENV === "development" ? "local" : "google");

  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {data?.user ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={data.user?.image ?? ""} />
            </Avatar>

            <h2 className="font-bold">{data.user.name}</h2>
          </div>

          <Button variant="secondary" size="icon" onClick={handleLogoutClick} aria-label="Sair da conta">
            <LogOutIcon />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col px-5 py-6 gap-3">
          <div className="flex items-center gap-2">
            <UserIcon size={32} />
            <h2 className="font-bold">Olá, faça seu login!</h2>
          </div>
          <Button variant="secondary" className="w-full justify-start" onClick={handleLoginClick}>
            <LogInIcon className="mr-2" size={18} />
            {process.env.NODE_ENV === "development" ? "Entrar localmente" : "Fazer Login com Google"}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button variant="outline" className="justify-start" asChild>
          <Link href="/">
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>

        {data?.user && (
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} className="mr-2" />
              Agendamentos
            </Link>
          </Button>
        )}

        <div className="my-2 border-t border-border" />

        {[
          { label: "Cabelo", service: "Cabelo", Icon: ScissorsIcon },
          { label: "Barba", service: "Barba", Icon: WavesIcon },
          { label: "Acabamento", service: "Pézinho", Icon: SparklesIcon },
          { label: "Sobrancelha", service: "Sobrancelha", Icon: UserIcon },
          { label: "Massagem", service: "Massagem", Icon: WavesIcon },
          { label: "Hidratação", service: "Hidratação", Icon: DropletsIcon },
        ].map(({ label, service, Icon }) => (
          <Button key={label} variant="ghost" className="justify-start" asChild>
            <Link href={`/barbershops?service=${encodeURIComponent(service)}`}>
              <Icon size={18} className="mr-2" />
              {label}
            </Link>
          </Button>
        ))}
      </div>
    </>
  );
};

export default SideMenu;
