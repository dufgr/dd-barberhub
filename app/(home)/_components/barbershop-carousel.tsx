"use client";

import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BarbershopItem from "./barbershop-item";

interface BarbershopCarouselProps {
  title: string;
  barbershops: Barbershop[];
}

// A rolagem nativa atende ao toque sem adicionar uma biblioteca de carrossel.
const BarbershopCarousel = ({ title, barbershops }: BarbershopCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateControls = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setCanScrollBack(carousel.scrollLeft > 0);
    setCanScrollForward(carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1);
  };

  const scroll = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Avança a maior parte da faixa visível para revelar os próximos cards.
    carousel.scrollBy({ left: direction * carousel.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    updateControls();
    window.addEventListener("resize", updateControls);
    return () => window.removeEventListener("resize", updateControls);
  }, [barbershops.length]);

  return (
    <section className="mb-12 mt-8 md:mt-10">
      <h2 className="mb-3 px-5 text-lg font-bold md:px-8">{title}</h2>
      <div className="relative">
        <div
          ref={carouselRef}
          onScroll={updateControls}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 scroll-smooth [&::-webkit-scrollbar]:hidden md:px-8"
        >
          {barbershops.map((barbershop) => (
            <div
              key={barbershop.id}
              className="min-w-[167px] max-w-[167px] snap-start md:min-w-0 md:max-w-none md:basis-[calc(33.333333%_-_10.666667px)] md:shrink-0 md:grow-0 lg:basis-[calc(20%_-_12.8px)]"
            >
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>

        {canScrollBack && (
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Voltar no carrossel ${title}`}
            className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md md:flex"
          >
            <ChevronLeftIcon size={20} />
          </button>
        )}
        {canScrollForward && (
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Avançar no carrossel ${title}`}
            className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md md:flex"
          >
            <ChevronRightIcon size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export default BarbershopCarousel;
