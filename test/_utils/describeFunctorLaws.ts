import {
  Hkt,
  Kind,
  Functor,
  Equivalence,
  NonEmptyArray,
  pipe,
  identity,
  Number,
} from '../../src'

export const describeFunctorLaws: {
  <F extends Hkt>(
    Functor: Functor.Functor<F>,
    Equivalence: Equivalence.Equivalence<Kind<F, number, unknown, unknown>>,
    fas: NonEmptyArray.NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
  ): void
} = (Functor, Equivalence, fas) => {
  describe('functor', () => {
    describe('map', () => {
      it('should satisfy identity law', () => {
        fas.forEach(fa => {
          pipe(fa, Functor.map(identity), Equivalence.equals(fa), expect).toBe(
            true,
          )
        })
      })

      it('should satisfy composition law', () => {
        const ab = Number.add(5)
        const bc = Number.divide(2)

        fas.forEach(fa => {
          pipe(
            fa,
            Functor.map(a => bc(ab(a))),
            Equivalence.equals(pipe(fa, Functor.map(ab), Functor.map(bc))),
            expect,
          ).toBe(true)
        })
      })
    })
  })
}
