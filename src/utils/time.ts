import * as Effect from '../modules/Effect'
import { Sync } from '../modules/Sync'

export const nowSync: Sync<number> = () => Date.now()

export const now: Effect.Effect<number> = Effect.fromSync(nowSync)

export const isDateValid: {
  (date: Date): boolean
} = date => date.toString() !== 'Invalid Date'
