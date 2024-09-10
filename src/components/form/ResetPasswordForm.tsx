"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { ResetPasswordFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { resetPassword } from "@/actions/reset-password";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordFormSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await resetPassword(values, token);
      setError(res.error);
      setSuccess(res.success);
    });
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl mb-5 font-semibold text-center text-gray-600 border-b pb-2">
        Forgot your password ?
      </h1>

      <Form {...form}>
        {error || success ? (
          <>
            <FormError message={error} />
            <FormSuccess message={success} />
          </>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        disabled={isPending}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                Reset Password
              </Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-5">
          Back to Sign in ?{"  "}
          <Link href="/auth/signin" className="text-blue-500 hover:underline ">
            Sign in
          </Link>
        </p>
      </Form>
    </div>
  );
}
