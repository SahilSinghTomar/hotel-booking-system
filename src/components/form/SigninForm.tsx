"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { SigninSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Socials from "../Socials";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { signin } from "@/actions/signin";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function SigninForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const clearQueryParams = useCallback(() => {
    // Get the current URL without query parameters
    const currentPath = window.location.pathname;

    // Replace the current URL with the same path, but without any search parameters
    router.replace(currentPath, { scroll: false });
  }, [router]);

  useEffect(() => {
    // Check if the error is different from "OAuthAccountNotLinked"
    if (error && error !== "OAuthAccountNotLinked") {
      clearQueryParams();
    }
  }, [clearQueryParams, error]);

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already use with different provider"
      : "";

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SigninSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await signin(values);
      setError(res.error);
      setSuccess(res.success);
      if (res.twoFactor) {
        setShowTwoFactor(true);
      }
    });
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl mb-5 font-semibold text-center text-gray-600 border-b pb-2">
        Sign in to your account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the two factor code sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="sahil@mail.com"
                          {...field}
                          disabled={isPending}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Sign in"}
          </Button>
        </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <Socials />

        <p className="text-center text-sm text-gray-600 mt-5">
          If you don&apos;t have an account, please&nbsp;
          <Link href="/auth/signup" className="text-blue-500 hover:underline ">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
}
