import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Monad } from "../../src/typeclasses/Monad"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { pipe, flow } from "../../src/utils/flow"

export const describeMonadLaws: {
  <F extends Hkt>(
    Monad: Monad<F>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
    afbs: NonEmptyReadonlyArray<
      (x: number) => Kind<F, number, unknown, unknown>
    >,
    bfcs: NonEmptyReadonlyArray<
      (x: number) => Kind<F, number, unknown, unknown>
    >,
  ): void
} = (Monad, fas, afbs, bfcs) => {
  describe ("monad", () => {
    describe ("flatMap", () => {
      it ("should satisfy left identity law", () => {
        const x = 1
        afbs.forEach (afb => {
          expect (Monad.flatMap (afb) (Monad.of (x))).toEqual (afb (x))
        })
      })

      it ("should satisfy right identity law", () => {
        fas.forEach (fa => {
          expect (pipe (fa, Monad.flatMap (Monad.of))).toEqual (fa)
        })
      })

      it ("should satisfy associativity law", () => {
        fas.forEach (fa => {
          afbs.forEach (afb => {
            bfcs.forEach (bfc => {
              const result1 = pipe (fa, Monad.flatMap (afb), Monad.flatMap (bfc))
              const result2 = pipe (
                fa,
                Monad.flatMap (flow (afb, Monad.flatMap (bfc))),
              )
              expect (result1).toEqual (result2)
            })
          })
        })
      })
    })
  })
}
