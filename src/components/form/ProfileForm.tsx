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

import { BasicProfileSettingsSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useCurrentUser from "@/hooks/use-current-user";
import { useState, useTransition } from "react";
import { settings } from "@/actions/basic-profile-settings";
import { useSession } from "next-auth/react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const ProfileForm = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof BasicProfileSettingsSchema>>({
    resolver: zodResolver(BasicProfileSettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof BasicProfileSettingsSchema>
  ) => {
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
        console.error(err);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
