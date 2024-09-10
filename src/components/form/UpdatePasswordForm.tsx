"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { PasswordChangeSchema } from "@/schemas";
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
import { settings } from "@/actions/update-password";
import useCurrentUser from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

export default function UpdatePasswordForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordChangeSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await settings(values);
      if (res.error) {
        setError(res.error);
      }
      if (res.success) {
        update();
        setSuccess(res.success);
      }
    });
  };

  return (
    <div className="flex flex-col justify-center p-10 rounded-lg border-2">
      <h1 className="text-2xl mb-5 font-semibold text-center text-gray-600 border-b pb-2">
        Change your Password
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
              {user?.hasPassword && (
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
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
              )}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
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
                Change Password
              </Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-5">
          Back to Profile ?{"  "}
          <Link
            href="/profile/account"
            className="text-blue-500 hover:underline "
          >
            My Profile
          </Link>
        </p>
      </Form>
    </div>
  );
}
