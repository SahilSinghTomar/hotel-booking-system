"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { AccountSettingsSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useCurrentUser from "@/hooks/use-current-user";
import { useState, useTransition } from "react";
import { settings } from "@/actions/account-settings";
import { useSession } from "next-auth/react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import Link from "next/link";

const AccountForm = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AccountSettingsSchema>>({
    resolver: zodResolver(AccountSettingsSchema),
    defaultValues: {
      email: user?.email || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof AccountSettingsSchema>) => {
    startTransition(async () => {
      setError("");
      setSuccess("");

      try {
        const res = await settings(values);

        if (res.error) {
          setError(res.error);
        } else if (res.success) {
          update();
          setSuccess(res.success);
        }
      } catch (err) {
        setError("Something went wrong");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="sahil@gmail.com"
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />
        <div className="flex items-center gap-5">
          <span className="text-sm text-gray-400">
            Want to change your password ?
          </span>
          <Link href="/update-password">
            <Button className="flex" variant="outline">
              Update Password
            </Button>
          </Link>
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

export default AccountForm;
