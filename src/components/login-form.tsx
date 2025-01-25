"use client";

import { Card, CardContent } from "@/components/card";
import { Label } from "@/components/label";
import { Button } from "@/components/new-button";
import { PasswordInput } from "@/components/password-input";
import { PhoneNumberInput } from "@/components/phone-input";
import { loginAction } from "@/lib/actions/login-action";
import { loginSchema } from "@/lib/actions/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });
  const { setValue, watch } = form;
  const password = watch("password");

  const { execute } = useAction(loginAction, {
    onSuccess: () => {
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.error.validationErrors?._errors?.[0]);
    },
    onExecute: (data) => {
      console.log("execute", data);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={form.handleSubmit((data) => execute(data))}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="PhoneNumber">Phone Number</Label>
                <PhoneNumberInput
                  id="phone_number"
                  className="custom-phone"
                  placeholder="91xxxxxxxxxx"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="phone"
                  autoCorrect="off"
                  onChange={(value: string) => {
                    const formattedValue = value.replace(/\+/g, "");
                    form.register("phone").onChange({
                      target: {
                        value: formattedValue,
                        name: "phone",
                      },
                    });
                  }}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setValue("password", e.target.value)}
                  autoComplete="new-password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={"/auth/sign-up"}
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-background md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
