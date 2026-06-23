"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Source: wireframes.md §Page 9 — Book Step 2 (client component)
// All form inputs have associated label elements per accessibility requirements.

interface AddressScheduleFormClientProps {
  serviceTypeId: string;
  bedrooms: number;
  bathrooms: number;
}

export function AddressScheduleFormClient({
  serviceTypeId,
  bedrooms,
  bathrooms,
}: AddressScheduleFormClientProps) {
  const router = useRouter();
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputClass = (field: string) =>
    cn(
      "w-full min-h-[44px] px-3 py-2.5 rounded-md border text-sm text-text-primary bg-surface-white transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light",
      errors[field]
        ? "border-destructive"
        : "border-border hover:border-primary-light"
    );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!street.trim()) newErrors.street = "Street address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!zip.trim()) newErrors.zip = "ZIP code is required";
    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedTime) newErrors.time = "Please select a time slot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    const address = [street, apt, city, zip].filter(Boolean).join(", ");
    const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
    const params = new URLSearchParams({
      serviceTypeId,
      bedrooms: bedrooms.toString(),
      bathrooms: bathrooms.toString(),
      address,
      scheduledAt,
      notes,
    });
    router.push(`/book/confirm?${params.toString()}`);
  };

  // Generate time slots for selected date
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
  ];

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6" noValidate>
      {/* Address section */}
      <fieldset className="space-y-4">
        <legend className="text-display-h4 font-semibold text-text-on-dark">
          Service Address
        </legend>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-text-on-dark mb-1.5">
            Street Address <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={inputClass("street")}
            placeholder="123 Main Street"
            autoComplete="street-address"
            aria-required="true"
            aria-describedby={errors.street ? "street-error" : undefined}
          />
          {errors.street && (
            <p id="street-error" className="mt-1 text-xs text-destructive" role="alert">
              {errors.street}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="apt" className="block text-sm font-medium text-text-on-dark mb-1.5">
            Apt / Unit <span className="text-text-muted-dark text-xs">(optional)</span>
          </label>
          <input
            id="apt"
            type="text"
            value={apt}
            onChange={(e) => setApt(e.target.value)}
            className={inputClass("apt")}
            placeholder="Apt 4B"
            autoComplete="address-line2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-text-on-dark mb-1.5">
              City <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass("city")}
              autoComplete="address-level2"
              aria-required="true"
              aria-describedby={errors.city ? "city-error" : undefined}
            />
            {errors.city && (
              <p id="city-error" className="mt-1 text-xs text-destructive" role="alert">
                {errors.city}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-text-on-dark mb-1.5">
              ZIP <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              id="zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className={inputClass("zip")}
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="[0-9]{5}"
              aria-required="true"
              aria-describedby={errors.zip ? "zip-error" : undefined}
            />
            {errors.zip && (
              <p id="zip-error" className="mt-1 text-xs text-destructive" role="alert">
                {errors.zip}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Schedule section */}
      <fieldset className="space-y-4">
        <legend className="text-display-h4 font-semibold text-text-on-dark">
          Date and Time
        </legend>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text-on-dark mb-1.5">
            Date <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            className={inputClass("date")}
            aria-required="true"
            aria-describedby={errors.date ? "date-error" : undefined}
          />
          {errors.date && (
            <p id="date-error" className="mt-1 text-xs text-destructive" role="alert">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-text-on-dark mb-1.5">
            Preferred Time <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className={cn(inputClass("time"), "bg-surface-white")}
            aria-required="true"
            aria-describedby={errors.time ? "time-error" : undefined}
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => {
              const [h, m] = slot.split(":").map(Number);
              const ampm = h >= 12 ? "PM" : "AM";
              const hour12 = h % 12 || 12;
              return (
                <option key={slot} value={slot}>
                  {hour12}:{m.toString().padStart(2, "0")} {ampm}
                </option>
              );
            })}
          </select>
          {errors.time && (
            <p id="time-error" className="mt-1 text-xs text-destructive" role="alert">
              {errors.time}
            </p>
          )}
        </div>
      </fieldset>

      {/* Access notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-text-on-dark mb-1.5">
          Access Notes <span className="text-text-muted-dark text-xs">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={cn(inputClass("notes"), "min-h-[80px] resize-y")}
          placeholder="Gate code, parking info, key location..."
          rows={3}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col gap-3">
        <Button type="submit" variant="primary-dark" size="full">
          Continue
        </Button>
        <Button
          type="button"
          variant="ghost-dark"
          size="full"
          onClick={() => router.back()}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}
