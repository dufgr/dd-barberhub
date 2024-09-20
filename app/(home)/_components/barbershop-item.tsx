"use client";

import { Badge } from "@/app/_components/ui/badge";
import { buttonVariants } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

// Imagem, título e botão abrem a mesma página de detalhes.
const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Link
      href={`/barbershops/${barbershop.id}`}
      className="block min-w-full max-w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="min-w-full max-w-full rounded-2xl">
        <CardContent className="px-1 py-0 pt-1">
          <div className="w-full h-[159px] relative">
            <div className="absolute top-2 left-2 z-50">
              <Badge variant="secondary" className="opacity-90 flex gap-1 items-center top-3 left-3">
                <StarIcon size={12} className="fill-primary text-primary" />
                <span className="text-xs">5,0</span>
              </Badge>
            </div>
            <Image
              alt={barbershop.name}
              src={barbershop.imageUrl}
              style={{
                objectFit: "cover",
              }}
              fill
              className="rounded-2xl"
            />
          </div>

          <div className="px-2 pb-3">
            <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
            <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
            <span className={buttonVariants({ variant: "secondary", className: "w-full mt-3" })}>Reservar</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BarbershopItem;
