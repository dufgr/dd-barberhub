"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarDaysIcon, LogInIcon, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";
import Search from "../(home)/_components/search";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";

// Reaproveita o cabeçalho e alterna a navegação conforme o tamanho da tela.
const Header = ({ desktopOnly = false, showSearch = true }: { desktopOnly?: boolean; showSearch?: boolean }) => {
  const { data } = useSession();
  const handleLoginClick = () => signIn(process.env.NODE_ENV === "development" ? "local" : "google");

  // A barra ocupa a tela toda, mas o conteúdo segue o limite da página.
  return (
    <header className={`w-full ${desktopOnly ? "hidden md:block" : ""}`}>
      <Card className="w-full rounded-none border-x-0 border-t-0">
        <CardContent className="mx-auto flex w-full max-w-[1280px] flex-row items-center justify-between gap-4 p-4 md:px-6">
          <Link href="/" className="shrink-0">
            <Image src="/dd-barberhub.png" alt="DD BarberHub" height={18} width={120} />
          </Link>

          {showSearch && (
            <div className="hidden min-w-0 flex-1 md:block md:max-w-md">
              <Search />
            </div>
          )}

          <nav className="hidden shrink-0 items-center gap-5 md:flex">
            {data?.user ? (
              <>
                <Link href="/bookings" className="flex items-center gap-2 text-sm hover:text-primary">
                  <CalendarDaysIcon size={16} /> Agendamentos
                </Link>
                <button onClick={() => signOut()} className="flex items-center gap-2 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={data.user.image ?? ""} />
                    <AvatarFallback>{data.user.name?.slice(0, 1) ?? "U"}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-36 truncate">{data.user.name}</span>
                </button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={handleLoginClick}>
                <LogInIcon className="mr-2" size={16} /> Entrar
              </Button>
            )}
          </nav>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir menu">
                  <MenuIcon size={16} />
                </Button>
              </SheetTrigger>

              <SheetContent className="p-0">
                <SideMenu />
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default Header;
