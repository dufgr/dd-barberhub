"use client";

import { Barbershop } from "@prisma/client";
import { CopyIcon, SmartphoneIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// Telefones e horários são do protótipo até entrarem no modelo Prisma.
const phones = ["(11) 98204-5108", "(11) 99503-2351"];
const openingHours = [
  ["Segunda", "Fechado"],
  ["Terça-Feira", "09:00 - 21:00"],
  ["Quarta-Feira", "09:00 - 21:00"],
  ["Quinta-Feira", "09:00 - 21:00"],
  ["Sexta-Feira", "09:00 - 21:00"],
  ["Sábado", "08:00 - 17:00"],
  ["Domingo", "Fechado"],
];

interface BarbershopBusinessInfoProps {
  barbershop: Barbershop;
  desktopOnly?: boolean;
  mobileSection?: "about" | "contact";
}

// Mostra os mesmos dados da barbearia no fluxo mobile e no painel desktop.
const BarbershopBusinessInfo = ({
  barbershop,
  desktopOnly = false,
  mobileSection,
}: BarbershopBusinessInfoProps) => {
  const copyPhone = async (phone: string) => {
    await navigator.clipboard.writeText(phone);
    toast.success("Telefone copiado!");
  };

  return (
    <>
      {!desktopOnly && mobileSection !== "contact" && (
        <section className="border-y border-border px-5 py-6 md:hidden">
          <h2 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Sobre nós</h2>
          <p className="text-sm leading-relaxed">
            Bem-vindo à {barbershop.name}, onde tradição encontra estilo. Nossa equipe transforma cortes de cabelo e
            barbas em obras de arte, em um ambiente acolhedor.
          </p>
        </section>
      )}

      {!desktopOnly && mobileSection !== "about" && (
        <section className="space-y-3 border-b border-border px-5 py-6 md:hidden">
          <h2 className="text-xs font-bold uppercase text-muted-foreground">Contato</h2>
          {phones.map((phone) => (
            <div key={phone} className="flex items-center gap-3">
              <SmartphoneIcon size={18} />
              <span className="flex-1 text-sm">{phone}</span>
              <Button variant="outline" size="sm" onClick={() => copyPhone(phone)}>
                Copiar
              </Button>
            </div>
          ))}
        </section>
      )}

      {desktopOnly && (
        <Card className="overflow-hidden rounded-2xl">
          <div className="relative h-32">
          <Image src="/barbershop-map.png" alt="Mapa da região" fill className="object-cover opacity-60" />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg bg-background/90 p-2">
            <Image
              src={barbershop.imageUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{barbershop.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{barbershop.address}</p>
            </div>
          </div>
          </div>
          <CardContent className="space-y-4 p-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase">Sobre nós</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Bem-vindo à {barbershop.name}, onde tradição encontra estilo. Nossa equipe de mestres barbeiros transforma
              cortes de cabelo e barbas em obras de arte.
            </p>
          </div>
          <div className="space-y-2 border-t border-border pt-3">
            {phones.map((phone) => (
              <div key={phone} className="flex items-center gap-2 text-xs">
                <SmartphoneIcon size={15} className="shrink-0" />
                <span className="flex-1">{phone}</span>
                <Button variant="secondary" size="sm" className="h-8" onClick={() => copyPhone(phone)}>
                  <CopyIcon size={12} className="mr-1" /> Copiar
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-3 text-xs">
            {openingHours.map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{day}</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-[10px] text-muted-foreground">Em parceria com</span>
            <Image src="/dd-barberhub.png" alt="DD Barber Hub" width={90} height={14} />
          </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BarbershopBusinessInfo;
