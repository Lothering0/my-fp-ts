import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isBigInt, isNumber } from "../../utils/typeChecks"
import { Schema } from "./schema"
import { constValid, invalid } from "./validation"

export const number: Schema<number> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isNumber,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a number`]),
      }),
    ),
}

export const integer: Schema<number> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      Number.isInteger,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not an integer`]),
      }),
    ),
}

export const bigInt: Schema<bigint> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isBigInt,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a BigInt`]),
      }),
    ),
}
