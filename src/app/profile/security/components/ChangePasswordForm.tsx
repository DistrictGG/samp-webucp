import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type ChangePasswordSchemaType } from "~/app/profile/security/components/forms";
import { useState } from "react";

type ChangePasswordInnerProps = { onCanghePassword: (values: ChangePasswordSchemaType) => void; isLoading?: boolean; showPassword?: boolean};
export const ChangePasswordFormInner = (props: ChangePasswordInnerProps) => {
  const form = useFormContext<ChangePasswordSchemaType>();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form
      onSubmit={form.handleSubmit(props.onCanghePassword)}
      className="flex flex-col gap-y-1"
    >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type={showPassword ? "text" : "password"} {...field} value={field.value ?? ""} autoComplete="current-password" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={showPassword ? "text" : "password"} {...field} value={field.value ?? ""} autoComplete="new-password" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type={showPassword ? "text" : "password"} {...field} value={field.value ?? ""} autoComplete="new-password" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <Label className="mt-4 flex items-center gap-2">
          <Checkbox
            checked={showPassword}
            onCheckedChange={(checked) => setShowPassword(!!checked)}
          />
          Show Password
        </Label>

      <Button disabled={props.isLoading} size="lg" className="mt-4 w-full">
        {props.isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};
