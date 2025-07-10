import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { createUcpFormSchemaType } from "~/app/profile/forms";

export const CreateUcpFormInner = () => {
  const form = useFormContext<createUcpFormSchemaType>();

  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};