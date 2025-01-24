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
import { onBoardingSchema } from "@/lib/actions/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormSchema = z.infer<typeof onBoardingSchema>;

export function CompanyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(onBoardingSchema),
    defaultValues: {
      industry: "",
      logo: undefined,
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log("Form Data:", data);
    toast.success("Form submitted successfully");
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("logo", file); // Set file in the form state
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-fit m-auto items-center justify-center",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Company Information</CardTitle>
          <CardDescription>
            Enter your company details and add team members if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6">
              {/* Industry Field */}
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare"
                  {...form.register("industry")}
                />
                {form.formState.errors.industry && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.industry.message}
                  </p>
                )}
              </div>

              {/* Logo Field */}
              <div className="grid gap-2">
                <Label htmlFor="logo">Company Logo (Optional)</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={154}
                    height={154}
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
                {form.formState.errors.logo && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.logo.message}
                  </p>
                )}
              </div>

              {/* Team Members Section */}
              <div className="grid gap-2">
                <Label>Team Members</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-2 border p-4 rounded">
                    <div className="grid gap-2">
                      <Label htmlFor={`teamMembers.${index}.name`}>Name</Label>
                      <Input
                        id={`teamMembers.${index}.name`}
                        placeholder="e.g., Jane Doe"
                        {...form.register(`teamMembers.${index}.name`)}
                      />
                      {form.formState.errors.teamMembers?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors.teamMembers[index]?.name
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`teamMembers.${index}.email`}>
                        Email
                      </Label>
                      <Input
                        id={`teamMembers.${index}.email`}
                        placeholder="e.g., jane.doe@example.com"
                        {...form.register(`teamMembers.${index}.email`)}
                      />
                      {form.formState.errors.teamMembers?.[index]?.email && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors.teamMembers[index]?.email
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      Remove Member
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => append({ name: "", email: "" })}
                >
                  Add Team Member
                </Button>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
