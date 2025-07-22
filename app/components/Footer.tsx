"use client";

import { FaTwitter, FaDiscord, FaInstagram } from "react-icons/fa";
import {Great_Vibes } from "next/font/google";
import Link from "next/link";
import { useSearch } from "../context/SearchContext";

const greatVibes = Great_Vibes({
  subsets:["latin"],
  weight:"400"
})

const filters: string[] = [

  "Interior Design",
  "Kitchen Units",
  "Built-in & walk in closets",
  "Bedroom Suites",
  "Kids & Babies furniture",
  "Dinning room suites",
  "Outdoor Furniture",
  "Hotel & Spa Furniture",
];
export default function Footer() {

  const {setSearchQuery} = useSearch();
  return (
    <footer className="bg-gradient-to-r from-neutral-900 to-neutral-950 shadow-2xl text-white py-10 px-4 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-24 gap-5 relative">
        {/* Brand Info */}
        <div className="relaive">
          <h2 className="text-2xl mb-2 font-bold text-amber-400 footer-headings"><span className={`${greatVibes.className} text-3xl`}>craft</span>SPACES</h2>
          <p className="mt-2 text-sm text-gray-400 font-sans">
            Discover, collect, and sell extraordinary NFTs on the world’s most
            secure NFT marketplace.
          </p>
        </div>

        {/* Marketplace Links */}
        <div className="relative font-sans">
          <h3 className="text-lg font-semibold mb-2 text-amber-300 footer-headings">
            Our Services
          </h3>
          <ul className="text-sm space-y-1 text-gray-300 list-disc flex flex-col">
            {filters.map((filter,index) => (
              <Link href={`/shop/product/${filter}`} key={index} className="list-disc" onClick={() => setSearchQuery(filter)}>{filter}</Link>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-2 text-amber-400 footer-headings">
            Get in Touch
          </h3>
          <p>+27 61 438 4733 / 73 462 4360</p>
          <p>Visit our showroom @ no.49 Mainreef</p>
          <p>road, next to Chicken Licken Randfontein</p>
        </div>

        {/* <div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-400">
              Pay less for quality and lifestyle
            </h3>
          </div>
        </div> */}
        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#">
              <FaTwitter size={20} className="hover:text-indigo-400" />
            </a>
            <a href="#">
              <FaDiscord size={20} className="hover:text-indigo-400" />
            </a>
            <a href="#">
              <FaInstagram size={20} className="hover:text-indigo-400" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()}{" "}
        <span className="text-amber-400 ">CraftSpaces.</span> All rights reserved.
      </div>
    </footer>
  );
}
