import * as number from "../../src/modules/Number"
import { HKT, Kind } from "../../src/types/HKT"
import { Functor } from "../../src/types/Functor"
import { identity } from "../../src/modules/Identity"
import { pipe } from "../../src/utils/flow"

export const describeFunctorLaws: {
  <F extends HKT>(F: Functor<F>, fas: Kind<F, unknown, unknown, number>[]): void
} = (F, fas) => {
  describe ("functor", () => {
    describe ("map", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          expect (F.map (identity) (fa)).toEqual (fa)
        })
      })

      it ("should satisfy composition law", () => {
        const ab = number.add (5)
        const bc = number.divide (2)

        fas.forEach (fa => {
          expect (
            pipe (
              fa,
              F.map (a => bc (ab (a))),
            ),
          ).toEqual (F.map (bc) (F.map (ab) (fa)))
        })
      })
    })
  })
}
