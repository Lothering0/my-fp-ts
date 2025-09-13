import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Monad } from "../../src/typeclasses/Monad"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { pipe, flow } from "../../src/utils/flow"
import { Eq } from "../../src/typeclasses/Eq"

export const describeMonadLaws: {
  <F extends Hkt>(
    Monad: Monad<F>,
    Eq: Eq<Kind<F, number, unknown, unknown>>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
    afbs: NonEmptyReadonlyArray<
      (x: number) => Kind<F, number, unknown, unknown>
    >,
    bfcs: NonEmptyReadonlyArray<
      (x: number) => Kind<F, number, unknown, unknown>
    >,
  ): void
} = (Monad, Eq, fas, afbs, bfcs) => {
  describe ("monad", () => {
    describe ("flatMap", () => {
      it ("should satisfy left identity law", () => {
        const x = 1
        afbs.forEach (afb => {
          pipe (x, Monad.of, Monad.flatMap (afb), Eq.equals (afb (x)), expect).toBe (
            true,
          )
        })
      })

      it ("should satisfy right identity law", () => {
        fas.forEach (fa => {
          pipe (fa, Monad.flatMap (Monad.of), Eq.equals (fa), expect).toBe (true)
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
              pipe (result1, Eq.equals (result2), expect).toBe (true)
            })
          })
        })
      })
    })
  })
}
