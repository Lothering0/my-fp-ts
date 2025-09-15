import { Hkt, Kind } from "../../src/typeclasses/Hkt"
import { Monad } from "../../src/typeclasses/Monad"
import { NonEmptyReadonlyArray } from "../../src/modules/NonEmptyReadonlyArray"
import { pipe, flow } from "../../src/utils/flow"
import { Equivalence } from "../../src/typeclasses/Equivalence"

export const describeMonadLaws: {
  <F extends Hkt>(
    Monad: Monad<F>,
    Equivalence: Equivalence<Kind<F, number, unknown, unknown>>,
    fas: NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
    afbs: NonEmptyReadonlyArray<
      (x: number) => Kind<F, number, unknown, unknown>
    >,
    bfcs: NonEmptyReadonlyArray<
      (x: number) => Kind<F, number, unknown, unknown>
    >,
  ): void
} = (Monad, Equivalence, fas, afbs, bfcs) => {
  describe ("monad", () => {
    describe ("flatMap", () => {
      it ("should satisfy left identity law", () => {
        const x = 1
        afbs.forEach (afb => {
          pipe (
            x,
            Monad.of,
            Monad.flatMap (afb),
            Equivalence.equals (afb (x)),
            expect,
          ).toBe (true)
        })
      })

      it ("should satisfy right identity law", () => {
        fas.forEach (fa => {
          pipe (
            fa,
            Monad.flatMap (Monad.of),
            Equivalence.equals (fa),
            expect,
          ).toBe (true)
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
              pipe (result1, Equivalence.equals (result2), expect).toBe (true)
            })
          })
        })
      })
    })
  })
}
