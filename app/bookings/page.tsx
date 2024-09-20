import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { authOptions } from "../_lib/auth";
import BarbershopBusinessInfo from "../_components/barbershop-business-info";
import BookingInfo from "../_components/booking-info";
import { Badge } from "../_components/ui/badge";
import { Card, CardContent } from "../_components/ui/card";
import { isFuture } from "date-fns";

// Busca apenas as reservas do usuário autenticado antes de montar os layouts.
const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  // Separa reservas futuras e anteriores nas seções do layout.
  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
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
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ]);
  const selectedBooking = confirmedBookings[0] ?? finishedBookings[0];

  return (
    <>
      <Header />

      <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-8 px-5 py-6 md:grid-cols-2 md:gap-10 md:py-10">
        <main className="min-w-0">
          <h1 className="mb-6 text-xl font-bold">Agendamentos</h1>

          {confirmedBookings.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase text-gray-400">Confirmados</h2>
              <div className="flex flex-col gap-3">
                {confirmedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {finishedBookings.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-bold uppercase text-gray-400">Finalizados</h2>
              <div className="flex flex-col gap-3">
                {finishedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {confirmedBookings.length === 0 && finishedBookings.length === 0 && (
            <p className="text-sm text-muted-foreground">Você ainda não tem agendamentos.</p>
          )}
        </main>

        {selectedBooking && (
          <aside className="hidden min-w-0 space-y-4 md:block">
            <BarbershopBusinessInfo barbershop={selectedBooking.barbershop} desktopOnly />
            <Card>
              <CardContent className="space-y-3 p-4">
                <Badge variant={isFuture(selectedBooking.date) ? "default" : "secondary"}>
                  {isFuture(selectedBooking.date) ? "Confirmado" : "Finalizado"}
                </Badge>
                <BookingInfo booking={selectedBooking} />
              </CardContent>
            </Card>
          </aside>
        )}
      </div>
    </>
  );
};

export default BookingsPage;
