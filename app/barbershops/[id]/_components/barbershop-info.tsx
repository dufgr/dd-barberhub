"use client";

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

// Mantém voltar/menu no mobile; no desktop a navegação fica no cabeçalho global.
const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.replace("/");
  };

  return (
    <div>
      <div className="relative h-[250px] w-full md:aspect-[1.6] md:h-auto">
        <Button onClick={handleBackClick} size="icon" variant="outline" className="absolute left-4 top-4 z-50 md:hidden">
          <ChevronLeftIcon />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="absolute right-4 top-4 z-50 md:hidden">
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>

        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{
            objectFit: "cover",
          }}
          className="rounded-t-none opacity-75 md:rounded-t-2xl"
        />
      </div>

      <div className="border-b border-solid border-secondary px-5 pb-5 pt-3 md:border-0 md:px-0 md:pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{barbershop.name}</h1>
            <div className="mt-2 flex items-center gap-1">
              <MapPinIcon className="text-primary" size={18} />
              <p className="text-sm">{barbershop.address}</p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-1 rounded-lg bg-card px-3 py-2 md:flex">
            <StarIcon className="fill-primary text-primary" size={16} />
            <span className="text-sm">5,0</span>
            <span className="text-xs text-muted-foreground">899 avaliações</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1 md:hidden">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">5,0 (899 avaliações)</p>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
