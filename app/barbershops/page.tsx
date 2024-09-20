import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import Search from "../(home)/_components/search";

interface BarbershopsPageProps {
  searchParams: {
    search?: string;
    service?: string;
  };
}

// A mesma página atende buscas por texto, serviço e catálogo completo.
const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  // Aplica os filtros de nome e serviço para atender também aos atalhos da home.
  const barbershops = await db.barbershop.findMany({
    where: {
      name: searchParams.search
        ? {
            contains: searchParams.search,
            mode: "insensitive",
          }
        : undefined,
      services: searchParams.service
        ? {
            some: {
              name: {
                contains: searchParams.service,
                mode: "insensitive",
              },
            },
          }
        : undefined,
    },
  });

  return (
    <>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <div className="md:hidden">
          <Search defaultValues={searchParams.search ? { search: searchParams.search } : undefined} />
        </div>

        {(searchParams.search || searchParams.service) && (
          <h1 className="text-xs font-bold uppercase text-gray-400">
            Resultados para &quot;{searchParams.search ?? searchParams.service}&quot;
          </h1>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="w-full">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BarbershopsPage;
