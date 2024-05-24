"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-errors";
import { FormSuccess } from "@/components/form-succes";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [erreur, setErreur] = useState<string | undefined>("");
  const [succes, setSucces] = useState<string | undefined>("");
  const [enCours, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setErreur("");
    setSucces("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setErreur(data?.error);
        setSucces(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Entrez un nouveau mot de passe"
      backButtonLabel="Retour à la connexion"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={enCours}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={erreur} />
          <FormSuccess message={succes} />
          <Button disabled={enCours} type="submit" className="w-full">
            Réinitialiser le mot de passe
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};