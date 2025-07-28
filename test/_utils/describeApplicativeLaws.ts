import * as number from "../../src/modules/Number"
import { HKT, Kind } from "../../src/types/HKT"
import { Applicative } from "../../src/types/Applicative"
import { identity } from "../../src/modules/Identity"

export const describeApplicativeLaws: {
  <F extends HKT>(
    A: Applicative<F>,
    fas: Kind<F, unknown, unknown, number>[],
    fabs: Kind<F, unknown, unknown, (x: number) => number>[],
  ): void
} = (A, fas, fabs) => {
  describe ("applicative", () => {
    describe ("ap", () => {
      it ("should satisfy identity law", () => {
        fas.forEach (fa => {
          expect (A.ap (fa) (A.of (identity))).toEqual (fa)
        })
      })

      it ("should satisfy homomorphism law", () => {
        const ab = number.add (5)
        const x = 1

        expect (A.ap (A.of (x)) (A.of (ab))).toEqual (A.of (ab (x)))
      })

      it ("should satisfy interchange law", () => {
        const x = 1

        fabs.forEach (fab => {
          expect (A.ap (A.of (x)) (fab)).toEqual (A.ap (fab) (A.of (ab => ab (x))))
        })
      })
    })
  })
}
