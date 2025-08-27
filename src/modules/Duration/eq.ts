import * as eq from "../../types/Eq"
import { Duration } from "./duration"
import { equals } from "./utils"

export const Eq: eq.Eq<Duration> = {
  equals,
}
