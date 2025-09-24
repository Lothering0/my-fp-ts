import { Sync } from "../modules/Sync"

export const now: Sync<number> = () => Date.now ()

export const isDateValid: {
  (date: Date): boolean
} = date => date.toString () !== "Invalid Date"
