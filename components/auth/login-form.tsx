"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email déjà utilisé avec un autre fournisseur!"
      : "";

  const [afficherDeuxFacteurs, setAfficherDeuxFacteurs] = useState(false);
  const [erreur, setErreur] = useState<string | undefined>("");
  const [succes, setSucces] = useState<string | undefined>("");
  const [enCours, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setErreur("");
    setSucces("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setErreur(data.error);
          }

          if (data?.success) {
            form.reset();
            setSucces(data.success);
          }

          if (data?.twoFactor) {
            setAfficherDeuxFacteurs(true);
          }
        })
        .catch(() => setErreur("Quelque chose a mal tourné"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Bienvenue"
      backButtonLabel="Vous n'avez pas de compte?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {afficherDeuxFacteurs && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code à deux facteurs</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={enCours}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!afficherDeuxFacteurs && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={enCours}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Mot de passe oublié?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={erreur || urlError} />
          <FormSuccess message={succes} />
          <Button disabled={enCours} type="submit" className="w-full">
            {afficherDeuxFacteurs ? "Confirmer" : "Se connecter"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};