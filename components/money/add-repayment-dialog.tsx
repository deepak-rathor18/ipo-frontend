"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { moneyService } from "@/services/money.service"
import { normalizeApiError } from "@/lib/api-client"
import { formatCurrency } from "@/lib/format"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function buildSchema(remaining: number) {
  return z.object({
    amount: z.coerce
      .number()
      .positive("Amount must be greater than 0")
      .max(remaining, `Amount cannot exceed the remaining balance of ${formatCurrency(remaining)}`),
    paymentDate: z.string().min(1, "Payment date is required"),
    notes: z.string().optional(),
  })
}

export function AddRepaymentDialog({
  open,
  onOpenChange,
  transactionId,
  originalAmount,
  alreadyPaid,
  remaining,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionId: string
  originalAmount: number
  alreadyPaid: number
  remaining: number
  onSuccess: () => void
}) {
  const schema = React.useMemo(() => buildSchema(remaining), [remaining])
  type FormValues = z.infer<typeof schema>
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, paymentDate: new Date().toISOString().slice(0, 10), notes: "" },
  })

  React.useEffect(() => {
    if (open) {
      reset({ amount: 0, paymentDate: new Date().toISOString().slice(0, 10), notes: "" })
    }
  }, [open, reset])

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await moneyService.addRepayment(transactionId, {
        amount: values.amount,
        paymentDate: values.paymentDate,
        notes: values.notes || undefined,
      })
      toast.success("Repayment recorded")
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(normalizeApiError(error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Repayment</DialogTitle>
          <DialogDescription>
            Record a payment against this transaction. The backend remains the final authority
            on balances.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/30 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">Original</p>
            <p className="font-medium text-foreground">{formatCurrency(originalAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Already Paid</p>
            <p className="font-medium text-foreground">{formatCurrency(alreadyPaid)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className="font-medium text-foreground">{formatCurrency(remaining)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="repayAmount">Amount (₹)</Label>
            <Input
              id="repayAmount"
              type="number"
              step="0.01"
              max={remaining}
              aria-invalid={!!errors.amount}
              {...register("amount")}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="repayDate">Payment Date</Label>
            <Input
              id="repayDate"
              type="date"
              aria-invalid={!!errors.paymentDate}
              {...register("paymentDate")}
            />
            {errors.paymentDate && (
              <p className="text-xs text-destructive">{errors.paymentDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="repayNotes">Notes</Label>
            <Input id="repayNotes" placeholder="Optional" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || remaining <= 0}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Add Repayment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
