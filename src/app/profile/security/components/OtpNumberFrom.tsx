import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/components/ui/input-otp";
import type { OtpSchemaType } from "~/app/profile/security/components/forms";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

type InputOtpNumberFormProps = { onInputOtpNumber: (values: OtpSchemaType) => void; isLoading?: boolean};

export const CreateInputOtpFrom = (props: InputOtpNumberFormProps) => {
  const form = useFormContext<OtpSchemaType>();
  return (
    <form
      onSubmit={form.handleSubmit(props.onInputOtpNumber)}
      className="flex flex-col gap-y-1"
    >
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Kode OTP</FormLabel>
              <FormControl>
                    <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          containerClassName="w-full"
                        >
                          <InputOTPGroup className="w-full justify-between">
                            <InputOTPSlot index={0} autoFocus className="flex-1" />
                            <InputOTPSlot index={1} className="flex-1" />
                            <InputOTPSlot index={2} className="flex-1" />
                            <InputOTPSlot index={3} className="flex-1" />
                            <InputOTPSlot index={4} className="flex-1" />
                            <InputOTPSlot index={5} className="flex-1" />
                          </InputOTPGroup>
                        </InputOTP>
                    </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={props.isLoading } className="w-full">
            {props.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Verifikasi</span>
        </Button>
      </div>
    </form>
  );
};