import {
  Hkt,
  Kind,
  Applicative,
  Equivalence,
  Array,
  pipe,
  identity,
  Number,
} from '../../src'

export const describeApplicativeLaws: {
  <F extends Hkt>(
    Applicative: Applicative.Applicative<F>,
    Equivalence: Equivalence.Equivalence<Kind<F, number, unknown, unknown>>,
    fas: Array.NonEmpty<Kind<F, number, unknown, unknown>>,
    fabs: Array.NonEmpty<Kind<F, (x: number) => number, unknown, never>>,
  ): void
} = (Applicative, Equivalence, fas, fabs) => {
  describe('applicative', () => {
    describe('apply', () => {
      it('should satisfy identity law', () => {
        fas.forEach(fa => {
          pipe(
            identity,
            Applicative.of,
            Applicative.apply(fa),
            Equivalence.equals(fa),
            expect,
          ).toBe(true)
        })
      })

      it('should satisfy homomorphism law', () => {
        const ab = Number.add(5)
        const x = 1

        pipe(
          ab,
          Applicative.of,
          Applicative.apply(Applicative.of(x)),
          Equivalence.equals(Applicative.of(ab(x))),
          expect,
        ).toBe(true)
      })

      it('should satisfy interchange law', () => {
        const x = 1

        fabs.forEach(fab => {
          pipe(
            fab,
            Applicative.apply(Applicative.of(x)),
            Equivalence.equals(
              Applicative.apply(fab)(Applicative.of(ab => ab(x))),
            ),
            expect,
          ).toBe(true)
        })
      })
    })
  })
}
