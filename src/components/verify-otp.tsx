import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/input-otp";

interface InputOTPFieldProps {
  onChange: (otp: string) => void;
}

export function InputOTPField({ onChange }: InputOTPFieldProps) {


  return (
    <div className="flex">
      <InputOTP maxLength={6}>
        <InputOTPGroup onChange={(otp) => {
          onChange(otp?.toString());
        }}>
          {[0, 1, 2].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup onChange={(otp) => {
          onChange(otp?.toString());
        }}>
          {[3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
