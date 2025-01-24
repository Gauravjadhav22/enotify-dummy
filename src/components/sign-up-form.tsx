"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Label } from "@/components/label";
import { Button } from "@/components/new-button";
import { Input } from "@/components/new-input";
import { PasswordInput } from "@/components/password-input";
import { PhoneNumberInput } from "@/components/phone-input";
import { registerAction } from "@/lib/actions/register-action";
import { registerSchema } from "@/lib/actions/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      password: "",
      name: "",
      email: "",
      companyName: "",
    },
  });

  const router = useRouter()
  const password = watch("password");

  const { executeAsync } = useAction(registerAction, {
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/auth/verify-otp");
      console.log("success");
    },
    onExecute: () => {
      console.log("onExecute");
    },
    onError: (error) => {
      if (error.error.validationErrors?._errors?.length) {
        error.error.validationErrors._errors.forEach((err) => {
          toast.error(err);
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      console.log("onSubmit", data);
      console.log("execute", await executeAsync(data));
    } catch (error) {
      console.log("error", error);
      console.error("Submission failed:", error);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-fit m-auto", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Your company name"
                  aria-invalid={!!errors.companyName}
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneNumberInput
                  className="custom-phone"
                  placeholder="91xxxxxxxxxx"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="phone"
                  autoCorrect="off"
                  aria-invalid={!!errors.phone}
                  onChange={(value: string) => {
                    const formattedValue = value.replace(/\+/g, "");
                    setValue("phone", formattedValue, { shouldValidate: true });
                  }}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) =>
                    setValue("password", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href={"/auth/login"}
                  className="underline underline-offset-4"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By creating an account, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}
