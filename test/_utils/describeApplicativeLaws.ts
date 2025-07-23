import * as N from "../../src/modules/Number"
import { HKT, Kind } from "../../src/types/HKT"
import { Applicative } from "../../src/types/Applicative"

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
          expect (
            A.ap (
              A.of (a => a),
              fa,
            ),
          ).toEqual (fa)
        })
      })

      it ("should satisfy homomorphism law", () => {
        const ab = N.add (5)
        const x = 1

        expect (A.ap (A.of (ab), A.of (x))).toEqual (A.of (ab (x)))
      })

      it ("should satisfy interchange law", () => {
        const x = 1

        fabs.forEach (fab => {
          expect (A.ap (fab, A.of (x))).toEqual (
            A.ap (
              A.of (ab => ab (x)),
              fab,
            ),
          )
        })
      })
    })
  })
}
