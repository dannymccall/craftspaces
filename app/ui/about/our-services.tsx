"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const services = [
  {
    title: "Interior Design",
    image: "/slideshow-images/study.jpeg",
    description:
      "We craft timeless interior spaces that reflect your personality and function seamlessly in daily life. From consultation to execution, our team creates harmony in every room."
  },
  {
    title: "Kitchen Units",
    image: "/slideshow-images/kitchen.jpeg",
    description:
      "Sleek, durable, and beautifully functional kitchen units that transform the heart of your home into a space of creativity and connection."
  },
  {
    title: "Built-in & Walk-in Closets",
    image: "/slideshow-images/dressing.jpeg",
    description:
      "Tailored storage solutions designed with elegance and practicality. Our built-in and walk-in closets are made to fit your space and lifestyle."
  },
  {
    title: "Bedroom Suites",
    image: "/slideshow-images/bedroom.jpeg",
    description:
      "Complete bedroom sets crafted for rest, beauty, and intimacy. Every detail — from headboard to dresser — is curated for comfort and style."
  },
  {
    title: "Kids & Babies Furniture",
    image: "/slideshow-images/coffee1.jpeg",
    description:
      "Safe, playful, and charming furniture designed especially for children. We merge imagination and safety into every piece."
  },
  {
    title: "Dinning Room Suites",
    image: "/slideshow-images/coffee.jpeg",
    description:
      "Elegant dining suites that foster family moments and hospitality. Built for gatherings, styled for grace."
  },
  {
    title: "Outdoor Furniture",
    image: "/slideshow-images/kitchen.jpeg",
    description:
      "Stylish and weather-resistant furniture that brings luxury to your outdoor living. Perfect for patios, balconies, and gardens."
  },
  {
    title: "Hotel & Spa Furniture",
    image: "/slideshow-images/dressing.jpeg",
    description:
      "Luxury-grade furniture for commercial environments, tailored to elevate the guest experience in hotels, resorts, and wellness spaces."
  }
];

const ServicesPage = () => {
  return (
    <main className="mt-28 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white text-center mb-16">
        Our Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-neutral-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-amber-500/20 transition duration-300"
          >
            <div className="relative w-full h-64 md:h-80">
              <Image
                src={service.image}
                alt={service.title}
                layout="fill"
                objectFit="cover"
                className="brightness-75"
              />
            </div>
            <div className="p-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {service.title}
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default ServicesPage;
