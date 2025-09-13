import * as number from "../../src/modules/Number"
import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Applicative } from "../../src/typeclasses/Applicative"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { identity } from "../../src/modules/Identity"
import { Eq } from "../../src/typeclasses/Eq"
import { pipe } from "../../src/utils/flow"

export const describeApplicativeLaws: {
  <F extends Hkt>(
    Applicative: Applicative<F>,
    Eq: Eq<Kind<F, number, unknown, unknown>>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
    fabs: NonEmptyReadonlyArray<Kind<F, (x: number) => number, unknown, never>>,
  ): void
} = (Applicative, Eq, fas, fabs) => {
  describe ("applicative", () => {
    describe ("ap", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          pipe (
            identity,
            Applicative.of,
            Applicative.ap (fa),
            Eq.equals (fa),
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
          Eq.equals (Applicative.of (ab (x))),
          expect,
        ).toBe (true)
      })

      it ("should satisfy interchange law", () => {
        const x = 1

        fabs.forEach (fab => {
          pipe (
            fab,
            Applicative.ap (Applicative.of (x)),
            Eq.equals (Applicative.ap (fab) (Applicative.of (ab => ab (x)))),
            expect,
          ).toBe (true)
        })
      })
    })
  })
}
