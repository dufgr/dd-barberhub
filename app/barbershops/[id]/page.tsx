import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Header from "@/app/_components/header";
import BarbershopBusinessInfo from "@/app/_components/barbershop-business-info";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

// Busca a barbearia uma vez para alimentar o conteúdo mobile e o painel desktop.
const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    // TODO: redirecionar para home page
    return null;
  }

  // Carrega os serviços junto da barbearia para os dois layouts usarem os mesmos dados.
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    // TODO: redirecionar para home page
    return null;
  }

  return (
    <>
      <Header desktopOnly />
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 py-5 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] md:gap-6 md:px-8">
        <main className="min-w-0">
          <BarbershopInfo barbershop={barbershop} />
          <BarbershopBusinessInfo barbershop={barbershop} mobileSection="about" />

          <section className="py-5 md:py-3">
            <h2 className="mb-3 px-0 text-xs font-bold uppercase text-gray-400">Serviços</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {barbershop.services.map((service) => (
                <ServiceItem
                  key={service.id}
                  barbershop={barbershop}
                  service={service}
                  isAuthenticated={!!session?.user}
                />
              ))}
            </div>
          </section>
          <BarbershopBusinessInfo barbershop={barbershop} mobileSection="contact" />
        </main>

        <aside className="hidden min-w-0 md:block">
          <BarbershopBusinessInfo barbershop={barbershop} desktopOnly />
        </aside>
      </div>
    </>
  );
};

export default BarbershopDetailsPage;
