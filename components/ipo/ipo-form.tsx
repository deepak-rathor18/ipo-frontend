"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { ipoService } from "@/services/ipo.service"
import { normalizeApiError } from "@/lib/api-client"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { IPO_STATUS_LABELS } from "@/constants"
import type { IPO, IPOFormValues } from "@/types"

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

const ipoSchema = z.object({
  ipoName: z.string().min(1, "IPO name is required"),
  companyName: z.string().min(1, "Company name is required"),
  appliedDate: z.string().min(1, "Applied date is required"),
  dematName: z.string().min(1, "Demat name is required"),
  applicationAmount: z.coerce.number().min(0, "Must be 0 or more"),
  lotSize: z.coerce.number().int().min(1, "Must be at least 1"),
  lotsApplied: z.coerce.number().int().min(1, "Must be at least 1"),
  sharesApplied: z.coerce.number().int().min(1, "Must be at least 1"),
  applicationPrice: z.coerce.number().min(0, "Must be 0 or more"),
  status: z.enum([
    "APPLIED",
    "ALLOTTED",
    "NOT_ALLOTTED",
    "PARTIALLY_ALLOTTED",
    "LISTED",
    "REFUNDED",
  ]),
  allottedShares: z.coerce.number().int().min(0).nullable().optional(),
  allotmentPrice: z.coerce.number().min(0).nullable().optional(),
  listingDate: z.string().nullable().optional(),
  listingPrice: z.coerce.number().min(0).nullable().optional(),
  currentPrice: z.coerce.number().min(0).nullable().optional(),
  notes: z.string().nullable().optional(),
})

type IpoFormSchema = z.infer<typeof ipoSchema>

function toFormDefaults(ipo?: IPO): IpoFormSchema {
  if (!ipo) {
    return {
      ipoName: "",
      companyName: "",
      appliedDate: "",
      dematName: "",
      applicationAmount: 0,
      lotSize: 1,
      lotsApplied: 1,
      sharesApplied: 0,
      applicationPrice: 0,
      status: "APPLIED",
      allottedShares: null,
      allotmentPrice: null,
      listingDate: null,
      listingPrice: null,
      currentPrice: null,
      notes: "",
    }
  }
  return {
    ipoName: ipo.ipoName,
    companyName: ipo.companyName,
    appliedDate: ipo.appliedDate?.slice(0, 10) ?? "",
    dematName: ipo.dematName,
    applicationAmount: ipo.applicationAmount,
    lotSize: ipo.lotSize,
    lotsApplied: ipo.lotsApplied,
    sharesApplied: ipo.sharesApplied,
    applicationPrice: ipo.applicationPrice,
    status: ipo.status,
    allottedShares: ipo.allottedShares,
    allotmentPrice: ipo.allotmentPrice,
    listingDate: ipo.listingDate?.slice(0, 10) ?? null,
    listingPrice: ipo.listingPrice,
    currentPrice: ipo.currentPrice,
    notes: ipo.notes ?? "",
  }
}

export function IpoForm({ ipo }: { ipo?: IPO }) {
  const router = useRouter()
  const isOnline = useOnlineStatus()
  const isEdit = !!ipo
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<IpoFormSchema>({
    resolver: zodResolver(ipoSchema),
    defaultValues: toFormDefaults(ipo),
  })

  const status = watch("status")
  const showAllotmentFields =
    status === "ALLOTTED" || status === "PARTIALLY_ALLOTTED" || status === "LISTED"
  const showListingFields = status === "LISTED"

  const onSubmit = async (values: IpoFormSchema) => {
    setIsSubmitting(true)
    try {
      const payload = { ...values, notes: values.notes || null } as unknown as IPOFormValues
      if (isEdit && ipo) {
        await ipoService.update(ipo.id, payload)
        toast.success("IPO updated")
        router.push(`/ipos/${ipo.id}`)
      } else {
        const created = await ipoService.create(payload)
        toast.success("IPO added")
        router.push(`/ipos/${created.id}`)
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
          <CardTitle>Application details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="IPO Name" error={errors.ipoName?.message}>
            <Input {...register("ipoName")} aria-invalid={!!errors.ipoName} />
          </Field>
          <Field label="Company Name" error={errors.companyName?.message}>
            <Input {...register("companyName")} aria-invalid={!!errors.companyName} />
          </Field>
          <Field label="Applied Date" error={errors.appliedDate?.message}>
            <Input type="date" {...register("appliedDate")} aria-invalid={!!errors.appliedDate} />
          </Field>
          <Field label="Demat Name" error={errors.dematName?.message}>
            <Input
              {...register("dematName")}
              placeholder="e.g. Deepak, Aman, Rahul"
              aria-invalid={!!errors.dematName}
            />
          </Field>
          <Field label="Application Amount (₹)" error={errors.applicationAmount?.message}>
            <Input type="number" step="0.01" {...register("applicationAmount")} />
          </Field>
          <Field label="Application Price (₹)" error={errors.applicationPrice?.message}>
            <Input type="number" step="0.01" {...register("applicationPrice")} />
          </Field>
          <Field label="Lot Size" error={errors.lotSize?.message}>
            <Input type="number" {...register("lotSize")} />
          </Field>
          <Field label="Lots Applied" error={errors.lotsApplied?.message}>
            <Input type="number" {...register("lotsApplied")} />
          </Field>
          <Field label="Shares Applied" error={errors.sharesApplied?.message}>
            <Input type="number" {...register("sharesApplied")} />
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(IPO_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </CardContent>
      </Card>

      {showAllotmentFields && (
        <Card>
          <CardHeader>
            <CardTitle>Allotment</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Allotted Shares">
              <Input type="number" {...register("allottedShares")} />
            </Field>
            <Field label="Allotment Price (₹)">
              <Input type="number" step="0.01" {...register("allotmentPrice")} />
            </Field>
          </CardContent>
        </Card>
      )}

      {showListingFields && (
        <Card>
          <CardHeader>
            <CardTitle>Listing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Listing Date">
              <Input type="date" {...register("listingDate")} />
            </Field>
            <Field label="Listing Price (₹)">
              <Input type="number" step="0.01" {...register("listingPrice")} />
            </Field>
            <Field label="Current Price (₹)">
              <Input type="number" step="0.01" {...register("currentPrice")} />
            </Field>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register("notes")}
            rows={3}
            className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            placeholder="Optional notes about this application"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isOnline}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isEdit ? "Save Changes" : "Add IPO"}
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
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
