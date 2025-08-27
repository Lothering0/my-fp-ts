import * as show_ from "../../types/Show"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import * as string from "../String"
import { flow, pipe } from "../../utils/flow"
import { Duration, durationUnits } from "./duration"

export const show: {
  (self: Duration): string
} = flow (
  readonlyRecord.toEntries,
  readonlyArray.filter (([unit]) =>
    pipe (durationUnits, readonlyArray.includes (unit)),
  ),
  readonlyArray.reduce ("", (template, [unit, value]) =>
    pipe (template, string.prepend (`${unit} ${value}`)),
  ),
)

export const Show: show_.Show<Duration> = { show }
