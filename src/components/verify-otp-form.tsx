"use client";

import { Button } from "@/components/new-button";
import { InputOTPField } from "@/components/verify-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../hooks/use-toast";


const formSchema = z.object({
    otp: z
        .string()
        .min(6, { message: "OTP must be 6 digits." })
        .max(6, { message: "OTP must be 6 digits." }),
});

export default function VerifyOtp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { otp: "" },
    });

    const { register, handleSubmit, watch, formState } = form;
    const { errors } = formState;

    // const otpValue = watch("otp");

    // Enable the verify button when OTP is complete
    const handleOtpChange = (value: string) => {
        setDisabledBtn(typeof value == 'string' && value?.length !== 6);
    };

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);

        setTimeout(() => {
            if (data.otp === "123456") {
                toast({
                    title: "Success",
                    description: "OTP verified successfully!",
                });
                router.push("/");
            } else {
                toast({
                    title: "Error",
                    description: "Invalid OTP. Please try again.",
                });
            }
            setIsLoading(false);
        }, 1000);
    }

    return (
        <div className="flex h-screen bg-transparent flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <h1 className="text-xl font-bold text-center mb-4">Verify OTP</h1>
                <p className="text-center text-muted-foreground mb-6">
                    Please enter the 6-digit OTP sent to your registered mobile number.
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-center gap-4"
                >
                    <InputOTPField
                        onChange={(otp: string) => {
                            handleOtpChange(otp);
                            form.setValue("otp", otp);
                        }}
                    />



                    {errors.otp && (
                        <p className="text-red-500 text-sm">{errors.otp.message}</p>
                    )}
                    <Button
                        type="submit"
                        className="mt-2 bg-black text-white"
                        disabled={disabledBtn || isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
