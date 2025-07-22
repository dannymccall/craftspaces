import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .email()
    .refine((value) => value != "", "Email Required"),
  password: z.string().min(2, { message: "Password Required" }),
});

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name Required" }),
  email: z
    .string()
    .email()
    .refine((value) => value != "", "Email Required"),
  password: z.string().min(2, { message: "Password Required" }),
});

export const addProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Select a Category"),
  price: z
    .string()
    .refine((value) => parseFloat(value) > 0, "Please enter a valid price"),
  //   file: z.instanceof(File).refine((file) => file.size > 0, {
  //     message: "File is required",
  //   }),
});

export const addUserSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  email: z.string().email(),
  role: z.enum(["admin"]),
});

export const billingInfoSchema = z.object({
  fullName: z.string().min(1, "Name is Required"),
  cardNumber: z
    .string()
    .regex(/^\d{13,19}$/, "Invalid Card, between 13 and 19 digits"),
  email: z.string().email(),
  shippingAddress: z.string().min(1, "Address Required"),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}/, "Invalid format. Use MM/YY")
    .refine(
      (value) => {
        const [mmStr, yyStr] = value.split("/");
        const month = parseInt(mmStr, 10);
        const year = parseInt("20" + yyStr, 10);
        if (month < 1 || month > 12) return false;

        const now = new Date();
        const expiryDate = new Date(year, month);

        return expiryDate > now;
      },
      { message: "Card is expired or month is invalid" }
    ),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});
export type SigninState = {
  errors?: {
    name?: string;
    password?: string;
  };
  message?: string;
};
