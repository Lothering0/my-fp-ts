import * as N from "../../src/modules/Number"
import { HKT, Kind } from "../../src/types/HKT"
import { Functor } from "../../src/types/Functor"
import { identity } from "../../src/modules/Identity"

export const describeFunctorLaws: {
  <F extends HKT>(F: Functor<F>, fas: Kind<F, unknown, unknown, number>[]): void
} = (F, fas) => {
  describe ("functor", () => {
    describe ("map", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          expect (F.map (fa, identity)).toEqual (fa)
        })
      })

      it ("should satisfy composition law", () => {
        const ab = N.add (5)
        const bc = N.divide (2)

        fas.forEach (fa => {
          expect (F.map (fa, a => bc (ab (a)))).toEqual (F.map (F.map (fa, ab), bc))
        })
      })
    })
  })
}
