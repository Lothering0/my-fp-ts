import * as ord from "../../typeclasses/Ord"
import * as ordering from "../Ordering"
import * as option from "../Option"
import * as readonlyArray from "../ReadonlyArray"
import * as number from "../Number"
import * as boolean from "../Boolean"
import { pipe } from "../../utils/flow"
import { length, lookupCharCode, toReadonlyArray } from "./utils"
import { constant } from "../../utils/constant"

export const Ord: ord.Ord<string> = {
  compare: ys => xs =>
    pipe (
      xs,
      toReadonlyArray,
      // Trying to find first index of both strings where chars are unequal
      readonlyArray.findMap ((char, i) =>
        pipe (
          option.Do,
          option.apS ("x", pipe (char, lookupCharCode (0))),
          option.apS (
            "y",
            // If there is no char in the second string then the first string should always be more than the second
            pipe (ys, lookupCharCode (i), option.orElse (option.some (-1))),
          ),
          option.flatMap (({ x, y }) =>
            pipe (
              number.compare (y) (x),
              // If both chars are the same then return `none` for `readonlyArray.findMap` and continue iterations
              number.matchZero ({
                onNonZero: (a: ordering.Ordering) => option.some (a),
                onZero: option.zero,
              }),
            ),
          ),
        ),
      ),
      // In the case when unequal chars was not found and length of the first string is less than length of the second
      // then the first string is less than the second. Otherwise both strings are the same
      option.getOrElse (() =>
        pipe (
          length (ys) > length (xs),
          boolean.match ({
            onTrue: constant (-1 as const),
            onFalse: constant (0 as const),
          }),
        ),
      ),
    ),
}

export const { compare } = Ord
