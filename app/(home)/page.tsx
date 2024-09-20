import { format } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import BarbershopCarousel from "./_components/barbershop-carousel";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../_components/ui/button";
import { ScissorsIcon, SparklesIcon, WavesIcon } from "lucide-react";

// Busca os dados no servidor para renderizar lojas e reservas já carregadas.
export default async function Home() {
  const session = await getServerSession(authOptions);

  // Carrega o catálogo e as reservas do usuário em paralelo.
  const [barbershops, recommendedBarbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    db.barbershop.findMany({
      orderBy: {
        id: "asc",
      },
    }),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const greeting = session?.user?.name?.split(" ")[0] ?? "vamos agendar";

  return (
    <div className="w-full">
      <Header showSearch={false} />

      <section className="relative overflow-hidden md:border-b md:border-border">
        {barbershops[0] && (
          <Image
            src={barbershops[0].imageUrl}
            alt=""
            fill
            priority
            className="hidden object-cover opacity-[0.12] md:block"
          />
        )}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-background via-background/90 to-transparent md:block" />

        <div className="relative mx-auto grid w-full max-w-[1280px] gap-8 px-5 pb-6 pt-5 md:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-10 md:px-8 md:py-12">
          <div>
            <div>
              <h1 className="text-xl md:text-2xl">
                Olá, <strong>{greeting}!</strong>
              </h1>
              <p className="capitalize text-sm text-muted-foreground">
                {format(new Date(), "EEEE',' d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>

            <div className="mt-6 md:mt-8">
              <Search />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 md:hidden">
              {[
                { label: "Cabelo", service: "Cabelo", Icon: ScissorsIcon },
                { label: "Barba", service: "Barba", Icon: WavesIcon },
                { label: "Acabamento", service: "Pézinho", Icon: SparklesIcon },
              ].map(({ label, service, Icon }) => (
                <Button key={label} variant="outline" size="sm" className="h-11 px-2" asChild>
                  <Link href={`/barbershops?service=${encodeURIComponent(service)}`}>
                    <Icon size={16} className="mr-1.5" /> {label}
                  </Link>
                </Button>
              ))}
            </div>

            <Link
              href="/barbershops"
              className="mt-5 flex min-h-32 items-center justify-between overflow-hidden rounded-2xl bg-primary/20 px-5 py-4 md:hidden"
            >
              <span className="max-w-40 text-xl font-bold leading-tight">
                Agende nos melhores
                <span className="mt-1 block text-sm font-normal text-muted-foreground">com DD Barber Hub</span>
              </span>
              <ScissorsIcon size={76} className="-rotate-12 text-primary" />
            </Link>

            {confirmedBookings.length > 0 && (
              <div className="mt-8 hidden md:block">
                <h2 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Agendamentos</h2>
                <div className="flex flex-col gap-3">
                  {confirmedBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden min-w-0 md:block">
            <h2 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Recomendados</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
              {barbershops.map((barbershop) => (
                <div key={barbershop.id} className="min-w-[220px] max-w-[220px]">
                  <BarbershopItem barbershop={barbershop} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 w-full max-w-[1280px] md:hidden">
        {confirmedBookings.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 px-5 text-xs font-bold uppercase text-muted-foreground">Agendamentos</h2>
            <div className="flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <div key={booking.id} className="min-w-[320px]">
                  <BookingItem booking={booking} />
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="mb-3 px-5 text-xs font-bold uppercase text-muted-foreground">Recomendados</h2>
          <div className="flex gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
                <BarbershopItem barbershop={barbershop} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        <BarbershopCarousel title="Populares" barbershops={recommendedBarbershops} />
        <BarbershopCarousel title="Mais visitados" barbershops={barbershops.slice().reverse()} />
      </div>
    </div>
  );
}
