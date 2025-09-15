import * as number from "../../src/modules/Number"
import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Functor } from "../../src/typeclasses/Functor"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { identity } from "../../src/modules/Identity"
import { pipe } from "../../src/utils/flow"
import { Equivalence } from "../../src/typeclasses/Equivalence"

export const describeFunctorLaws: {
  <F extends Hkt>(
    Functor: Functor<F>,
    Equivalence: Equivalence<Kind<F, number, unknown, unknown>>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
  ): void
} = (Functor, Equivalence, fas) => {
  describe ("functor", () => {
    describe ("map", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          pipe (fa, Functor.map (identity), Equivalence.equals (fa), expect).toBe (
            true,
          )
        })
      })

      it ("should satisfy composition law", () => {
        const ab = number.add (5)
        const bc = number.divide (2)

        fas.forEach (fa => {
          pipe (
            fa,
            Functor.map (a => bc (ab (a))),
            Equivalence.equals (pipe (fa, Functor.map (ab), Functor.map (bc))),
            expect,
          ).toBe (true)
        })
      })
    })
  })
}
