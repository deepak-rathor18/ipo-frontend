"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/providers/auth-provider"
import { APP_USERS } from "@/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const loginSchema = z.object({
  user: z.enum(["Deepak", "Aman"], { message: "Select a user" }),
  authCode: z.string().min(1, "Enter your auth code"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { user: "Deepak", authCode: "" },
  })

  const selectedUser = watch("user")

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true)
    try {
      await login({ user: values.user, authCode: values.authCode })
    } catch (error) {
      const err = error as { message?: string }
      toast.error(err.message ?? "Login failed. Check your auth code and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="user">User</Label>
        <Select
          value={selectedUser}
          onValueChange={(value) => setValue("user", value as LoginValues["user"])}
        >
          <SelectTrigger id="user" className="w-full">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {APP_USERS.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.user && (
          <p className="text-xs text-destructive">{errors.user.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="authCode">Auth Code</Label>
        <Input
          id="authCode"
          type="password"
          autoComplete="off"
          placeholder="••••••••"
          aria-invalid={!!errors.authCode}
          {...register("authCode")}
        />
        {errors.authCode && (
          <p className="text-xs text-destructive">{errors.authCode.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Logging in…
          </>
        ) : (
          <>
            <Lock /> Login
          </>
        )}
      </Button>
    </form>
  )
}
