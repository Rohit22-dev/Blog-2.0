import React, { useState } from "react";
import advert from "@/public/advert.jpeg";
import shoes from "@/public/shoes.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Card, CardHeader, CardBody, Link } from "@nextui-org/react";
import Image from "next/image";

const AdvertCard = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleSlideChange = (index: number) => {
    setActiveSlideIndex(index);
  };

  const slides = [
    {
      title: "Sponsored",
      website: "mikacosmetics.com",
      image: advert,
      description:
        "Your pathway to stunning and immaculate beauty and made sure your skin is exfoliating skin and shining like light.",
    },
    {
      title: "Sponsored",
      website: "nike.com",
      image: shoes,
      description:
        "Discover the latest trends in cosmetics and enhance your beauty with MikaCosmetics products.",
    },
  ];

  const activeSlide = slides[activeSlideIndex];

  return (
    <section className="h-fit bg-foreground-100 rounded-md p-2 shadow-xl">
      <Card className="flex flex-col border-primary border h-full rounded-md p-2">
        <CardHeader className="flex items-center justify-between w-full">
          <h4 className="font-sans text-small">Sponsored</h4>
          <p className="text-tiny italic">Create ad</p>
        </CardHeader>
        <Carousel
          infiniteLoop
          interval={5000}
          autoPlay
          showThumbs={false}
          onChange={handleSlideChange}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative h-56 w-full">
              <Image
                src={slide.image}
                alt={`slide-${index}`}
                className="rounded-md"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </Carousel>
        <div className="flex items-center justify-between">
          <h2 className="font-sans">{activeSlide.title}</h2>

          <Link
            isBlock
            showAnchorIcon
            className="text-sm italic"
            href="#"
            color="secondary"
          >
            {activeSlide.website}
          </Link>
        </div>
        <CardBody className="text-sm p-0 mt-2">
          {activeSlide.description}
        </CardBody>
      </Card>
    </section>
  );
};

export default AdvertCard;
