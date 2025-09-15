import * as number from "../../src/modules/Number"
import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Applicative } from "../../src/typeclasses/Applicative"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { identity } from "../../src/modules/Identity"
import { Equivalence } from "../../src/typeclasses/Equivalence"
import { pipe } from "../../src/utils/flow"

export const describeApplicativeLaws: {
  <F extends Hkt>(
    Applicative: Applicative<F>,
    Equivalence: Equivalence<Kind<F, number, unknown, unknown>>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
    fabs: NonEmptyReadonlyArray<Kind<F, (x: number) => number, unknown, never>>,
  ): void
} = (Applicative, Equivalence, fas, fabs) => {
  describe ("applicative", () => {
    describe ("ap", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          pipe (
            identity,
            Applicative.of,
            Applicative.ap (fa),
            Equivalence.equals (fa),
            expect,
          ).toBe (true)
        })
      })

      it ("should satisfy homomorphism law", () => {
        const ab = number.add (5)
        const x = 1

        pipe (
          ab,
          Applicative.of,
          Applicative.ap (Applicative.of (x)),
          Equivalence.equals (Applicative.of (ab (x))),
          expect,
        ).toBe (true)
      })

      it ("should satisfy interchange law", () => {
        const x = 1

        fabs.forEach (fab => {
          pipe (
            fab,
            Applicative.ap (Applicative.of (x)),
            Equivalence.equals (
              Applicative.ap (fab) (Applicative.of (ab => ab (x))),
            ),
            expect,
          ).toBe (true)
        })
      })
    })
  })
}
