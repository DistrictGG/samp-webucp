import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { PhoneSchemaType } from "~/app/profile/security/components/forms";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

type InputNumberFormProps = { onInputPhoneNumber: (values: PhoneSchemaType) => void; isLoading?: boolean};

export const CreateInputNumberFrom = (props: InputNumberFormProps) => {
  const form = useFormContext<PhoneSchemaType>();
  return (
    <form
      onSubmit={form.handleSubmit(props.onInputPhoneNumber)}
      className="flex flex-col gap-y-1"
    >
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                        +62
                    </div>
                    <Input
                        {...field}
                        type="number"
                        placeholder="812345678"
                        className="rounded-l-none"
                    />
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