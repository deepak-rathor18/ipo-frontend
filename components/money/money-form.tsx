"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { moneyService } from "@/services/money.service"
import { normalizeApiError } from "@/lib/api-client"
import { useOnlineStatus } from "@/hooks/use-online-status"
import type { MoneyFormValues, MoneyTransaction } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const moneySchema = z.object({
  personName: z.string().min(1, "Person name is required"),
  phone: z.string().nullable().optional(),
  type: z.enum(["GIVEN", "BORROWED"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  transactionDate: z.string().min(1, "Transaction date is required"),
  dueDate: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

type MoneyFormSchema = z.infer<typeof moneySchema>

function toFormDefaults(t?: MoneyTransaction): MoneyFormSchema {
  if (!t) {
    return {
      personName: "",
      phone: "",
      type: "GIVEN",
      amount: 0,
      transactionDate: "",
      dueDate: null,
      reason: "",
      notes: "",
    }
  }
  return {
    personName: t.personName,
    phone: t.phone ?? "",
    type: t.type,
    amount: t.amount,
    transactionDate: t.transactionDate?.slice(0, 10) ?? "",
    dueDate: t.dueDate?.slice(0, 10) ?? null,
    reason: t.reason ?? "",
    notes: t.notes ?? "",
  }
}

export function MoneyForm({ transaction }: { transaction?: MoneyTransaction }) {
  const router = useRouter()
  const isOnline = useOnlineStatus()
  const isEdit = !!transaction
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MoneyFormSchema>({
    resolver: zodResolver(moneySchema),
    defaultValues: toFormDefaults(transaction),
  })

  const onSubmit = async (values: MoneyFormSchema) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        phone: values.phone || null,
        dueDate: values.dueDate || null,
        reason: values.reason || null,
        notes: values.notes || null,
      } as unknown as MoneyFormValues

      if (isEdit && transaction) {
        await moneyService.update(transaction.id, payload)
        toast.success("Transaction updated")
        router.push(`/money/${transaction.id}`)
      } else {
        const created = await moneyService.create(payload)
        toast.success("Transaction added")
        router.push(`/money/${created.id}`)
      }
      router.refresh()
    } catch (error) {
      toast.error(normalizeApiError(error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Transaction details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Person Name" error={errors.personName?.message}>
            <Input {...register("personName")} aria-invalid={!!errors.personName} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="Optional" />
          </Field>
          <Field label="Type" error={errors.type?.message}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GIVEN">Given — we gave money, we&apos;ll receive it</SelectItem>
                    <SelectItem value="BORROWED">Borrowed — we borrowed money, we&apos;ll pay it</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Amount (₹)" error={errors.amount?.message}>
            <Input type="number" step="0.01" {...register("amount")} aria-invalid={!!errors.amount} />
          </Field>
          <Field label="Transaction Date" error={errors.transactionDate?.message}>
            <Input type="date" {...register("transactionDate")} aria-invalid={!!errors.transactionDate} />
          </Field>
          <Field label="Due Date" error={errors.dueDate?.message}>
            <Input type="date" {...register("dueDate")} />
          </Field>
          <Field label="Reason" error={errors.reason?.message} className="sm:col-span-2">
            <Input {...register("reason")} placeholder="e.g. Medical expense, home renovation" />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register("notes")}
            rows={3}
            className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            placeholder="Optional notes"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isOnline}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isEdit ? "Save Changes" : "Add Transaction"}
        </Button>
      </div>
      {!isOnline && (
        <p className="text-right text-xs text-warning">
          You&apos;re offline. Please reconnect to continue.
        </p>
      )}
    </form>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
