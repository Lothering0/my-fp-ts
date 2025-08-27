import { Group } from "../../types/Group"
import { Duration } from "./duration"
import { MonoidSum } from "./monoid"
import { multiply } from "./utils"

export const GroupSum: Group<Duration> = {
  ...MonoidSum,
  inverse: multiply (-1),
}
