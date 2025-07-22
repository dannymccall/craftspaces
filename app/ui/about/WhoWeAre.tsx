"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const WhoWeAre = () => {
  return (
    <main className="mt-28 px-6 max-w-6xl mx-auto space-y-24">
      {/* Who We Are */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row gap-10 items-center"
      >
        <div className="relative w-full md:w-1/2 h-96 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/slideshow-images/study.jpeg"
            alt="Who We Are"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
        </div>
        <div className="w-full md:w-1/2 text-left space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Who We Are</h2>
          <p className="text-neutral-300 text-md md:text-lg leading-relaxed">
            At CraftSpaces, we believe that great spaces create great lives. Our
            identity is rooted in a passion for design, innovation, and
            storytelling through interiors. We are artisans of digital and
            physical experiences — building not just homes, but havens that speak
            to the soul. With faith as our compass and creativity as our tool, we
            set out to deliver excellence in every click, every curve, every
            crafted corner.
          </p>
          <p className="text-amber-400 font-medium">
            We are more than a brand — we are a culture of thoughtful making.
          </p>
        </div>
      </motion.section>

      {/* Our Services */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col md:flex-row-reverse gap-10 items-center"
      >
        <div className="relative w-full md:w-1/2 h-96 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/slideshow-images/kitchen.jpeg"
            alt="Our Services"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
        </div>
        <div className="w-full md:w-1/2 text-left space-y-4">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-white">Our Services</h2> */}
          <p className="text-neutral-300 text-md md:text-lg leading-relaxed">
            CraftSpaces provides a carefully curated catalog of home furnishings,
            functional pieces, and lifestyle accessories tailored for discerning
            tastes. We combine artisan-level quality with modern convenience. Our
            services include: customized interior consultation, 3D room previews,
            design kits, online shopping, virtual showroom tours, and access to
            hand-selected designers. We aim to deliver delight in every detail.
          </p>
          <p className="text-amber-400 font-medium">
            Elevate your lifestyle with CraftSpaces — where every piece has a
            purpose.
          </p>
        </div>
      </motion.section>
    </main>
  );
};

export default WhoWeAre;
