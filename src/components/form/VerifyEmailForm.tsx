"use client";

import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VerifyEmail } from "@/actions/verify-email";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const VerifyEmailForm = () => {
  const searhParams = useSearchParams();
  const [errror, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, startTransition] = useTransition();
  const token = searhParams.get("token");

  const onVerify = async () => {
    setError("");
    setSuccess("");

    // Call the verify email action
    startTransition(async () => {
      const res = await VerifyEmail(token);
      setError(res.error);
      setSuccess(res.success);
    });
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl mb-5 font-semibold text-center text-gray-600 border-b pb-2">
        Verify Email
      </h1>
      {errror || success ? (
        <>
          <FormError message={errror} />
          <FormSuccess message={success} />
        </>
      ) : (
        <Button onClick={onVerify} disabled={loading}>
          {loading ? "Verifying..." : "Click to Verify Email"}
        </Button>
      )}

      <p className="text-center text-sm text-gray-600 mt-5">
        Back to Sign in?{"  "}
        <Link href="/auth/signin" className="text-blue-500 hover:underline ">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmailForm;
