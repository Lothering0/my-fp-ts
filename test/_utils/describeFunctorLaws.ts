import * as number from "../../src/modules/Number"
import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Functor } from "../../src/typeclasses/Functor"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { identity } from "../../src/modules/Identity"
import { pipe } from "../../src/utils/flow"

export const describeFunctorLaws: {
  <F extends Hkt>(
    Functor: Functor<F>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
  ): void
} = (Functor, fas) => {
  describe ("functor", () => {
    describe ("map", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          expect (Functor.map (identity) (fa)).toEqual (fa)
        })
      })

      it ("should satisfy composition law", () => {
        const ab = number.add (5)
        const bc = number.divide (2)

        fas.forEach (fa => {
          pipe (
            fa,
            Functor.map (a => bc (ab (a))),
            expect,
          ).toEqual (Functor.map (bc) (Functor.map (ab) (fa)))
        })
      })
    })
  })
}
