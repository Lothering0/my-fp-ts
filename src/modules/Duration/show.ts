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
  readonlyArray.map (([unit, value]) => `${value} ${unit}`),
  readonlyArray.join (" "),
  string.prepend ('make ("'),
  string.append ('")'),
)

export const Show: show_.Show<Duration> = { show }
