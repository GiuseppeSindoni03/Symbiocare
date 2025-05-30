import { z } from "zod";
import { passwordSchema } from "../../schemas/password-schema";

export const step1Schema = z
  .object({
    name: z
      .string()
      .nonempty("Il nome è obbligatorio.")
      .min(2, "Il nome deve contenere almeno 2 caratteri."),
    surname: z
      .string()
      .nonempty("Il cognome è obbligatorio.")
      .min(2, "Il cognome deve contenere almeno 2 caratteri."),
    email: z
      .string()
      .nonempty("L'email è obbligatoria.")
      .email("Email non valida."),

    password: passwordSchema,

    confirmPassword: z.string().nonempty("Conferma la password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono.",
    path: ["confirmPassword"],
  });

export type Step1SchemaType = z.infer<typeof step1Schema>;
