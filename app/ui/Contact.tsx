"use client";
import React, { ReactEventHandler, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { useNotification } from "../context/NotificationContext";
import FormLoading from "../components/Loaders/FormLoading";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};
const ContactPage = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    // defaultValues: { name: "", email: "", message: "" },
  });
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const { showToast } = useNotification();

  const onSubmit = async (): Promise<void> => {
    if (!formRef.current) return;
    try {
      setPending(true);
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      console.log(result.text);
      setPending(false);
      showToast("Got it! We'll get back to you soon.", "success");
      reset();
    } catch (error: any) {
      setPending(false);
      console.error(error);
      showToast(error.message, "error");
    }
  };

  return (
    <main className="mt-28 px-6 max-w-6xl mx-auto space-y-16">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        Contact Us
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-900 p-8 rounded-xl shadow-lg space-y-6 w-full md:w-2/3"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
            ref={formRef}
          >
            <div>
              <label className="text-neutral-300 block mb-1">Your Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" , value:"dfdkjkfds"})}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-neutral-300 block mb-1">Your Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                // required
                className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-neutral-300 block mb-1">
                Your Message
              </label>
              <textarea
                {...register("message", { required: "Message is required" })}
                rows={6}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              ></textarea>
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer disabled:opacity-70 py-3 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500 transition duration-300"
            >
              {pending ? <FormLoading /> : "Send Message"}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-left md:text-left text-neutral-300 bg-neutral-900 p-8 rounded-xl shadow-lg w-full md:w-1/3 space-y-4"
        >
          <p>
            <strong>Phone:</strong>
            <br /> +27 61 438 4733 / 73 462 4360
          </p>
          <p>
            <strong>Email:</strong>
            <br />
            <a
              href="mailto:craftspacesgroup@gmail.com"
              className="text-amber-400 hover:underline"
            >
              craftspacesgroup@gmail.com
            </a>
          </p>
          <p>
            <strong>Visit Our Showroom:</strong>
            <br />
            No.49 Mainreef Road,
            <br />
            Next to Chicken Licken,
            <br />
            Randfontein
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default ContactPage;
