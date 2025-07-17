import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { createUcpFormSchemaType } from "~/app/profile/ucp/components/forms";

export const CreateUcpFormInner = () => {
  const form = useFormContext<createUcpFormSchemaType>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <div className="space-y-4">
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={showPassword ? "text" : "password"} {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />
      </div>

      <Label className="mt-4">
        <Checkbox
          checked={showPassword}
          onCheckedChange={(checked) => setShowPassword(!!checked)}
        />
        Show Password
      </Label>
    </>
  );
};