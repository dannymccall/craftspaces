"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Modern Minimalist Bedroom",
    image: "/slideshow-images/bedroom.jpeg",
    location: "Accra, Ghana",
    description:
      "A full bedroom transformation with clean lines, neutral tones, and multifunctional furnishings that create a peaceful and elegant personal space."
  },
  {
    title: "Spa Lounge Setup",
    image: "/slideshow-images/dressing.jpeg",
    location: "Johannesburg, South Africa",
    description:
      "Custom spa furniture including recliners, mirrors, and lighting tailored to create a relaxing and luxurious environment for wellness clients."
  },
  {
    title: "Outdoor Garden Retreat",
    image: "/slideshow-images/kitchen.jpeg",
    location: "Cape Coast, Ghana",
    description:
      "An elegant patio and garden space furnished with weather-resistant outdoor sets, blending comfort and design with natural surroundings."
  }
];

const PortfolioProjectsPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-28 px-6 max-w-7xl mx-auto"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-white text-center mb-16"
      >
        Our Projects
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/20 transition duration-300"
          >
            <motion.div
              className="relative w-full h-64"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="brightness-75 rounded-t-xl"
              />
            </motion.div>
            <div className="p-5 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {project.title}
              </h2>
              <p className="text-sm text-amber-400 italic">{project.location}</p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
};

export default PortfolioProjectsPage;
