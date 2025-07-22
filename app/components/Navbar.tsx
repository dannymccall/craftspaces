"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FaShoppingCart, FaShopify } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdContactMail,
  MdOutlineMedicalInformation,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RiHome5Line, RiAdminFill } from "react-icons/ri";
import { Great_Vibes } from "next/font/google";
import { useSession } from "../hooks/useSession";
import { useCart } from "../context/CartContext";
import { FaSearch } from "react-icons/fa";
import { useMobileSearchbar } from "../context/MobileSearchbarContext";
import { useSearch } from "../context/SearchContext";
import { useProfile } from "../context/ProfileContext";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import Image from "next/image";
import { useLogout } from "../hooks/useLogout";
import { useScroll } from "../context/ScrollContext";
import FormLoading from "./Loaders/FormLoading";
import { IoMdNotifications } from "react-icons/io";
import { useSocketContext } from "../context/SocketContext";
import { fetchNotifications } from "../lib/helperFunctions";
import { useMe } from "../hooks/useMe";
import { Notification } from "../lib/types/Notifications";
import NotificationList from "./NotificationList";
import { useFetch } from "../hooks/useFetch";
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

const navItems = [
  { name: "Home", icon: <RiHome5Line />, href: "/" },
  {
    name: "About Us",
    icon: <MdOutlineMedicalInformation />,
    submenu: [
      { name: "Who We Are", href: "/about/who-we-are" },
      { name: "Our Services", href: "/about/our-services" },
    ],
  },
  {
    name: "Portfolio",
    icon: <LuLayoutDashboard />,
    submenu: [{ name: "Projects", href: "/portfolio/projects" }],
  },
  {
    name: "Shop",
    icon: <FaShopify />,
    submenu: [
      { name: "Products", href: "/shop/products" },
      { name: "Service", href: "/shop/services" },
    ],
  },
  { name: "Contact", icon: <MdContactMail />, href: "/contact" },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
  {
    href: "/admin/add-product",
    label: "Products",
    icon: <MdProductionQuantityLimits />,
  },
  { href: "/admin/add-product", label: "Add Product", icon: <IoAddCircle /> },
  { href: "/admin/add-user", label: "Add User", icon: <IoAddCircle /> },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { showNavbar, scrolled } = useScroll();
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  // const { user } = useSession();
  // const { distinctItemCount } = useCart();
  const { openSearchbar } = useMobileSearchbar();
  const { typedQuery, setTypedQuery } = useSearch();
  const { cart } = useCart();
  const { profilePicture } = useProfile();
  const { handleLogout } = useLogout();
  const [ready, setReady] = useState<boolean>(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const { socket } = useSocketContext();
  const user = useMe();

  const { data: notifications, refetch } = useFetch<Notification>({
    uri: "/api/users/auth",
    service: "fetchNotifications",
  });

  useEffect(() => {
    setOpenDropdown(null); // Close on route change
    setMenuOpen(false);
    setShowProfileDropdown(false);
    setShowNotifications(false);
  }, [pathname]);

  useEffect(() => {
    setReady(true);
  }, []);

  // const getNotfications = async () => {
  //   const res = await fetchNotifications();
  //   setNotifications(res);
  // };

  useEffect(() => {
    socket?.on("notify-user", () =>{
      console.log("hello on user")
      refetch()
    } 
  );
    socket?.on("notifyAdmins", () => refetch());
    socket?.on("markedAsRead", () => refetch())
  }, []);

  const toggleNotifications = () => setShowNotifications((prev) => !prev);
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRefs.current.every(
  //         (ref) => ref && !ref.contains(event.target as Node)
  //       )
  //     ) {
  //       setOpenDropdown(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const isActiveLink = (href: string) => pathname === href;

  const dropdownItemClass =
    "block px-4 py-2 hover:bg-neutral-800 text-sm w-full text-left cursor-pointer flex gap-2 items-center";

  const renderNavLinks = () =>
    navItems.map(({ name, icon, href, submenu }, i) => {
      if (!submenu) {
        return (
          <Link
            key={i}
            href={href!}
            className={`flex gap-2 items-center text-[15px] transition duration-200 hover:scale-105 hover:text-white ${
              isActiveLink(href!)
                ? "bg-amber-400 text-black px-3 py-0.5 rounded-md font-bold"
                : ""
            }`}
          >
            {icon} {name}
          </Link>
        );
      }

      return (
        <div
          key={i}
          ref={(el: any) => (dropdownRefs.current[i] = el)}
          className="relative"
        >
          <button
            className="flex gap-2 items-center text-[15px] hover:text-white transition duration-200"
            onClick={() =>
              setOpenDropdown((prev) => (prev === name ? null : name))
            }
          >
            {icon} {name}
          </button>

          <div
            className={`absolute left-0 top-full mt-2 w-48 bg-neutral-900 rounded-md shadow-xl ring-1 ring-amber-400/10 z-50 flex flex-col transform transition-all duration-200 ease-in-out ${
              openDropdown === name
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {submenu.map((item, j) => (
              <Link
                key={j}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className="block px-4 py-2 text-sm text-white hover:bg-neutral-800"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      );
    });

  const renderAdminDropdown = () => (
    <div className="relative">
      <button
        className="hover:text-gray-300 cursor-pointer flex gap-2 items-center text-[15px]"
        onClick={() =>
          setOpenDropdown((prev) => (prev === "admin" ? null : "admin"))
        }
      >
        <RiAdminFill /> Admin
      </button>
      <div
        className={`absolute top-full left-0 mt-2 w-40 bg-neutral-900 shadow-xl ring-1 ring-amber-400/10 rounded-md z-50 flex flex-col transform transition-all duration-200 ease-in-out ${
          openDropdown === "admin"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {adminLinks.map(({ href, label, icon }, i) => (
          <Link
            key={i}
            href={href}
            onClick={() => setOpenDropdown(null)}
            className={dropdownItemClass}
          >
            {icon} {label}
          </Link>
        ))}
      </div>
    </div>
  );

  const renderProfileImage = () => {
    return profilePicture ? (
      <Image
        src={profilePicture}
        alt="profile"
        width={40}
        height={30}
        className="rounded-md cursor-pointer w-10 h-10"
        onClick={() => setShowProfileDropdown((prev) => !prev)}
      />
    ) : (
      <FaRegCircleUser
        size={30}
        className="cursor-pointer"
        onClick={() => setShowProfileDropdown((prev) => !prev)}
      />
    );
  };

  const renderDropdown = () => (
    <div
      className={`absolute bg-neutral-800 w-32 -right-6 z-50 top-12 rounded-md shadow-lg transition-opacity duration-300 ${
        showProfileDropdown ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <button
        className="flex gap-2 hover:bg-neutral-600 w-full p-2 justify-start items-center cursor-pointer"
        onClick={() => handleSettingsClick(user!.id)}
      >
        <IoSettingsOutline />
        Settings
      </button>
      <button
        className="flex gap-2 hover:bg-neutral-600 w-full p-2 justify-start items-center cursor-pointer"
        onClick={handleLogout}
      >
        <CiLogout />
        Logout
      </button>
    </div>
  );

  const renderUserProfileSection = () => (
    <div className="relative">
      {renderProfileImage()}
      {renderDropdown()}
    </div>
  );

  const renderLoginButton = () => (
    <button
      className="bg-amber-400 ml-3 text-black px-4 py-1.5 rounded-md font-medium hover:opacity-90 cursor-pointer"
      onClick={() => router.push("/auth/auth-page")}
    >
      Login
    </button>
  );

  const renderUserSection = (className: string) => (
    <>
      <div className={`relative flex  items-center ${className}`}>
        <div className="block md:hidden">
          <button onClick={openSearchbar}>
            <FaSearch className="text-2xl" />
          </button>
        </div>

        <div
          className={`${
            pathname.includes("admin") ? "hidden" : "relative"
          } mr-4`}
        >
          <FaShoppingCart
            className="text-[15px] cursor-pointer hover:text-white transition-transform hover:scale-110"
            onClick={() => router.push("/shop/cart")}
          />
          <span className="absolute -top-3 -right-3 bg-amber-400 text-black text-xs px-1.5 py-0.3 rounded-full font-bold shadow-md">
            {cart.length}
          </span>
        </div>

        <div className={`relative mr-4`}>
          <IoMdNotifications
            className="text-[20px] cursor-pointer hover:text-white transition-transform hover:scale-110"
            onClick={toggleNotifications}
          />
          <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs px-1.5 py-0.3 rounded-full font-bold shadow-md">
            {notifications.length}
          </span>
        </div>

        {showNotifications && (
          <NotificationList
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
        {ready ? (
          user ? (
            renderUserProfileSection()
          ) : (
            renderLoginButton()
          )
        ) : (
          <FormLoading />
        )}
      </div>
    </>
  );

  function handleSettingsClick(id: number): void {
    router.push(`/auth/user`);
  }

  return (
    <nav
      className={`text-gold px-1 flex justify-center items-center shadow-2xl fixed z-50 w-full top-0 left-0 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-700 glass"
          : "bg-gradient-to-r from-neutral-900 to-neutral-950"
      } ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex justify-between items-center px-3  w-full">
        <div className=" font-bold w-full">
          <Link href={"/"} className="flex items-center  w-1/2">
            <div className="logo-mask mt-1"></div>

            <h1
              className={`${greatVibes.className} hidden md:flex text-3xl items-center text-gold`}
            >
              craft <span className="ml-1">SPACES</span>
            </h1>
          </Link>
        </div>

        <div
          className={`${
            pathname.includes("admin") ? "hidden" : "relative"
          } w-full`}
        >
          <input
            type="text"
            className="w-full hidden lg:block p-2 bg-[#1a1a1a] active:border active:border-[#FFD700] transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            placeholder="Search for item..."
            value={typedQuery}
            onChange={(e) => setTypedQuery(e.target.value)}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="w-full flex justify-end items-center">
          <div className="flex gap-6 items-center">
            {/* {user?.role === "admin" && renderAdminDropdown()} */}
            {renderUserSection("flex-row gap-4")}
            {/* Mobile Toggle */}
            <div className="">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <HiX className="text-3xl text-gold cursor-pointer" />
                ) : (
                  <HiMenu className="text-3xl text-gold cursor-pointer" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={` absolute w-full h-screen left-0  top-24 text-gold flex flex-col items-center gap-11 py-6 bg-[#0a0a0a] shadow-lg z-auto transition-all duration-300 ${
          menuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {renderNavLinks()}
        {user?.role === "admin" && renderAdminDropdown()}
        {renderUserSection("flex-col gap-7")}
      </div>
    </nav>
  );
};

export default Navbar;
