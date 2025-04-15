"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { useInvestment } from "@/context/investment-context"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { INVESTMENT_TYPES } from "@/lib/constants"
import { TR } from "@/lib/translations"

const formSchema = z.object({
  type: z.string(),
  amount: z.coerce.number().positive({ message: "Miktar pozitif olmalıdır" }),
  purchaseDate: z.date(),
  purchasePrice: z.coerce.number().positive({ message: "Satın alma fiyatı pozitif olmalıdır" }),
  description: z.string().min(2, { message: "Açıklama en az 2 karakter olmalıdır" }),
})

export function InvestmentForm({ investment, onSuccess }: { investment?: any; onSuccess?: () => void }) {
  const { addInvestment, updateInvestment } = useInvestment()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: investment
      ? {
          type: investment.type,
          amount: investment.amount,
          purchaseDate: new Date(investment.purchaseDate),
          purchasePrice: investment.purchasePrice,
          description: investment.description,
        }
      : {
          type: "",
          amount: undefined,
          purchaseDate: new Date(),
          purchasePrice: undefined,
          description: "",
        },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (investment) {
        updateInvestment({
          ...investment,
          ...values,
        })
        toast({
          title: TR.investmentUpdated,
          description: TR.investmentUpdatedDesc,
        })
      } else {
        addInvestment({
          id: Date.now().toString(),
          ...values,
        })
        toast({
          title: TR.investmentAdded,
          description: TR.investmentAddedDesc,
        })
        form.reset({
          type: "",
          amount: undefined,
          purchaseDate: new Date(),
          purchasePrice: undefined,
          description: "",
        })
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: TR.error,
        description: TR.errorDesc,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TR.investmentType}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={TR.selectInvestmentType} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INVESTMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TR.quantity}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TR.purchasePrice} (₺)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{TR.purchaseDate}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: tr }) : <span>{TR.pickDate}</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    locale={tr}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TR.description}</FormLabel>
              <FormControl>
                <Textarea placeholder={TR.descriptionPlaceholder} className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? TR.saving : investment ? TR.updateInvestment : TR.addInvestment}
        </Button>
      </form>
    </Form>
  )
}
