"use client"

import { GlobeIcon } from "lucide-react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"

const timezones = [
  {
    value: "Pacific",
    items: [
      { label: "(GMT-10) Honolulu", value: "Pacific/Honolulu" },
      { label: "(GMT-8) Los Angeles", value: "America/Los_Angeles" },
      { label: "(GMT-8) Vancouver", value: "America/Vancouver" },
      { label: "(GMT-8) San Francisco", value: "America/Los_Angeles" },
    ],
  },
  {
    value: "Mountain",
    items: [
      { label: "(GMT-7) Denver", value: "America/Denver" },
      { label: "(GMT-7) Phoenix", value: "America/Phoenix" },
      { label: "(GMT-7) Calgary", value: "America/Edmonton" },
    ],
  },
  {
    value: "Central",
    items: [
      { label: "(GMT-6) Chicago", value: "America/Chicago" },
      { label: "(GMT-6) Mexico City", value: "America/Mexico_City" },
    ],
  },
  {
    value: "Eastern",
    items: [
      { label: "(GMT-5) New York", value: "America/New_York" },
      { label: "(GMT-5) Toronto", value: "America/Toronto" },
      { label: "(GMT-5) Miami", value: "America/New_York" },
    ],
  },
  {
    value: "Atlantic",
    items: [
      { label: "(GMT-4) Santiago", value: "America/Santiago" },
      { label: "(GMT-4) Halifax", value: "America/Halifax" },
    ],
  },
  {
    value: "South America",
    items: [
      { label: "(GMT-3) São Paulo", value: "America/Sao_Paulo" },
      {
        label: "(GMT-3) Buenos Aires",
        value: "America/Argentina/Buenos_Aires",
      },
    ],
  },
  {
    value: "Europe",
    items: [
      { label: "(GMT+0) London", value: "Europe/London" },
      { label: "(GMT+0) Dublin", value: "Europe/Dublin" },
      { label: "(GMT+0) Lisbon", value: "Europe/Lisbon" },
      { label: "(GMT+1) Paris", value: "Europe/Paris" },
      { label: "(GMT+1) Berlin", value: "Europe/Berlin" },
      { label: "(GMT+1) Rome", value: "Europe/Rome" },
      { label: "(GMT+1) Madrid", value: "Europe/Madrid" },
      { label: "(GMT+1) Amsterdam", value: "Europe/Amsterdam" },
      { label: "(GMT+1) Brussels", value: "Europe/Brussels" },
      { label: "(GMT+1) Vienna", value: "Europe/Vienna" },
      { label: "(GMT+2) Cairo", value: "Africa/Cairo" },
      { label: "(GMT+2) Athens", value: "Europe/Athens" },
      { label: "(GMT+2) Istanbul", value: "Europe/Istanbul" },
      { label: "(GMT+2) Warsaw", value: "Europe/Warsaw" },
      { label: "(GMT+2) Kyiv", value: "Europe/Kyiv" },
    ],
  },
  {
    value: "Middle East",
    items: [
      { label: "(GMT+3) Moscow", value: "Europe/Moscow" },
      { label: "(GMT+3) Riyadh", value: "Asia/Riyadh" },
      { label: "(GMT+3) Baghdad", value: "Asia/Baghdad" },
      { label: "(GMT+3) Dubai", value: "Asia/Dubai" },
      { label: "(GMT+4) Baku", value: "Asia/Baku" },
    ],
  },
  {
    value: "South Asia",
    items: [
      { label: "(GMT+5) Karachi", value: "Asia/Karachi" },
      { label: "(GMT+5) Tashkent", value: "Asia/Tashkent" },
      { label: "(GMT+5:30) Mumbai", value: "Asia/Kolkata" },
      { label: "(GMT+5:30) New Delhi", value: "Asia/Kolkata" },
      { label: "(GMT+5:30) Colombo", value: "Asia/Colombo" },
      { label: "(GMT+6) Dhaka", value: "Asia/Dhaka" },
      { label: "(GMT+6) Almaty", value: "Asia/Almaty" },
    ],
  },
  {
    value: "East Asia",
    items: [
      { label: "(GMT+7) Bangkok", value: "Asia/Bangkok" },
      { label: "(GMT+7) Jakarta", value: "Asia/Jakarta" },
      { label: "(GMT+8) Shanghai", value: "Asia/Shanghai" },
      { label: "(GMT+8) Singapore", value: "Asia/Singapore" },
      { label: "(GMT+8) Hong Kong", value: "Asia/Hong_Kong" },
      { label: "(GMT+8) Perth", value: "Australia/Perth" },
      { label: "(GMT+9) Tokyo", value: "Asia/Tokyo" },
      { label: "(GMT+9) Seoul", value: "Asia/Seoul" },
      { label: "(GMT+9) Osaka", value: "Asia/Tokyo" },
    ],
  },
  {
    value: "Oceania",
    items: [
      { label: "(GMT+10) Sydney", value: "Australia/Sydney" },
      { label: "(GMT+10) Melbourne", value: "Australia/Melbourne" },
      { label: "(GMT+11) Noumea", value: "Pacific/Noumea" },
      { label: "(GMT+12) Auckland", value: "Pacific/Auckland" },
      { label: "(GMT+12) Fiji", value: "Pacific/Fiji" },
    ],
  },
] as const

interface TimezoneSelectProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimezoneSelect({
  value,
  onChange,
  placeholder = "Select a timezone",
  className,
}: TimezoneSelectProps) {
  return (
    <Combobox
      value={value}
      onValueChange={(val) => onChange?.(val || "")}
      items={timezones as unknown as readonly string[]}
    >
      <ComboboxInput placeholder={placeholder} className={className}>
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent alignOffset={-28} className="w-60">
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>
          {(group) => (
            <ComboboxGroup
              key={group.value}
              items={group.items as unknown as readonly string[]}
            >
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem key={item.value} value={item.value}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
