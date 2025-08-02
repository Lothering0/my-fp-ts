import * as number from "../../src/modules/Number"
import { HKT, Kind } from "../../src/types/HKT"
import { Applicative } from "../../src/types/Applicative"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { identity } from "../../src/modules/Identity"

export const describeApplicativeLaws: {
  <F extends HKT>(
    Applicative: Applicative<F>,
    fas: NonEmptyReadonlyArray<Kind<F, unknown, unknown, number>>,
    fabs: NonEmptyReadonlyArray<Kind<F, never, unknown, (x: number) => number>>,
  ): void
} = (Applicative, fas, fabs) => {
  describe ("applicative", () => {
    describe ("ap", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          expect (Applicative.ap (fa) (Applicative.of (identity))).toEqual (fa)
        })
      })

      it ("should satisfy homomorphism law", () => {
        const ab = number.add (5)
        const x = 1

        expect (Applicative.ap (Applicative.of (x)) (Applicative.of (ab))).toEqual (
          Applicative.of (ab (x)),
        )
      })

      it ("should satisfy interchange law", () => {
        const x = 1

        fabs.forEach (fab => {
          expect (Applicative.ap (Applicative.of (x)) (fab)).toEqual (
            Applicative.ap (fab) (Applicative.of (ab => ab (x))),
          )
        })
      })
    })
  })
}
