"use client";
import React, { useEffect, useState } from "react";
import ImageChange from "./ImageChange";
import ShowEmailVerificationPopup from "./ShowEmailVerificationPopup";
import { makeRequest } from "../lib/helperFunctions";
import { useNotification } from "../context/NotificationContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "../lib/types/User";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useMe } from "../hooks/useMe";
import { featureCards, quotePassages } from "../lib/essentials";
export const images: string[] = [
  "/slideshow-images/bedroom.jpeg",
  "/slideshow-images/coffee1.jpeg",
  "/slideshow-images/coffee.jpeg",
  "/slideshow-images/study.jpeg",
  "/slideshow-images/coffee2.jpeg",
  "/slideshow-images/kitchen.jpeg",
];


const Home = () => {
  const { showToast } = useNotification();
  const [pending, setPending] = useState<boolean>(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState<boolean>(false);
  const { cart } = useCart();
  const user = useMe();


  // Open the connection when THIS page mounts
 

  useEffect(() => {
    if (cart.length > 0)
      showToast(
        "Please, there are still some items in your cart, try clearing them",
        "info"
      );
    if (user && user.role !== "admin" && !user.email_verified)
      setShowEmailPrompt(true);
  }, []);

  const resendVerificationEmail = async () => {
    showToast("Sending new verification email...", "info");
    setPending(true);
    try {
      const response = await makeRequest(
        `/api/users/auth?service=sendEmailVerification`,
        { method: "POST", body: JSON.stringify({}) }
      );
      if (!response.success) {
        showToast(response.message, "error");
        setPending(false);
        return;
      }
      showToast(response.message, "success");
      setShowEmailPrompt(false);
      setPending(false);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="w-full mb-20">
      {showEmailPrompt && (
        <div className="w-full fixed z-50 mb-8">
          <ShowEmailVerificationPopup
            resendVerificationEmail={resendVerificationEmail}
            pending={pending}
          />
        </div>
      )}
      <ImageChange images={images} />
      <section className="mt-10 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {quotePassages.map((quote, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={quote.image}
                alt="quote background"
                layout="fill"
                objectFit="cover"
                className="brightness-75 transition-transform duration-700 hover:scale-105"
              />
            </div>
            <p className="mt-4 text-lg md:text-xl text-neutral-200 font-light italic">
              “{quote.text}”
            </p>
            <p className="mt-2 text-sm text-amber-400 font-medium">
              {quote.author}
            </p>
          </motion.div>
        ))}
      </section>
      <section className="mt-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {featureCards.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.3 }}
            className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl"
          >
            <div className="relative w-full h-48">
              <Image
                src={feature.image}
                alt="feature"
                layout="fill"
                objectFit="cover"
                className="brightness-75"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </section>
      <section className="mt-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <motion.div
          className="relative w-full md:w-1/2 h-[450px] rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/slideshow-images/broad.png"
            alt="Crafted Inspiration"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 text-left space-y-6"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
            Thoughtful Design
            <br /> Meets Inspired Living
          </h2>
          <p className="text-neutral-300 text-md md:text-lg">
            Explore spaces shaped by clarity, simplicity, and craftsmanship.
            Whether a tranquil reading corner or a lively kitchen, CraftSpaces
            helps you shape environments that reflect your soul. Beauty and
            utility belong together.
          </p>
          <p className="text-amber-400 font-medium">
            – Your story deserves inspired space
          </p>
        </motion.div>
      </section>
      <section className="mt-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          {
            name: "Palmer Json",
            title: "Founder & Lead Programmer",
            description:
              "Palmer is the visionary behind CraftSpaces' technical innovation — building seamless experiences with a heart for design and detail.",
            image: "/me.png",
            socials: [
              { icon: <FaGithub />, href: "https://github.com/" },
              { icon: <FaLinkedin />, href: "https://linkedin.com/" },
            ],
          },
          {
            name: "Jane Doe",
            title: "Chief Executive Officer",
            description:
              "Jane steers the ship with bold leadership and a sharp eye for market trends, ensuring CraftSpaces thrives with integrity and creativity.",
            image: "/slideshow-images/broad.png",
            socials: [
              { icon: <FaLinkedin />, href: "https://linkedin.com/" },
              { icon: <FaTwitter />, href: "https://twitter.com/" },
            ],
          },
        ].map((person, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.3 }}
            className="bg-neutral-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-amber-500/30 transition-shadow duration-300"
          >
            <motion.div
              className="w-40 h-40 relative rounded-full overflow-hidden shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={person.image}
                alt={person.name}
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              {person.name}
            </h3>
            <p className="text-amber-400 text-sm font-medium">{person.title}</p>
            <p className="mt-3 text-neutral-300 text-sm">
              {person.description}
            </p>
            <div className="mt-4 flex gap-4 justify-center">
              {person.socials.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-amber-400 transition-colors text-lg"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </section>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-neutral-900 text-neutral-200 p-10 rounded-xl shadow-lg mt-24 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Let's Build the Space You Deserve
        </h2>
        <p className="text-lg leading-relaxed">
          At Craftspaces, we believe your home, office, or business is more than
          just a place — it's a reflection of your identity. Whether you're
          starting a new chapter or reimagining your current one, we're here to
          craft beauty, comfort, and functionality into every corner. Thank you
          for trusting us with your spaces.
        </p>
        <p className="mt-6 text-amber-400 font-medium">
          Your dream space is just one idea away — let's bring it to life.
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
