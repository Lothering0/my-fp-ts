import * as show_ from "../../types/Show"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import * as string from "../String"
import { flow, pipe } from "../../utils/flow"
import { Duration, durationUnits } from "./duration"
import { prettify } from "./utils"

export const show: {
  (self: Duration): string
} = flow (
  prettify,
  readonlyRecord.toEntries,
  readonlyArray.filter (([unit]) =>
    pipe (durationUnits, readonlyArray.includes (unit)),
  ),
  readonlyArray.map (([unit, value]) =>
    value === 1 ? [pipe (unit, string.slice (0, -1)), value] : [unit, value],
  ),
  readonlyArray.map (([unit, value]) => `${value} ${unit}`),
  readonlyArray.join (" "),
  string.prepend ('make ("'),
  string.append ('")'),
)

export const Show: show_.Show<Duration> = { show }
