import {
  Hkt,
  Kind,
  functor,
  equivalence,
  nonEmptyArray,
  pipe,
  identity,
  number,
} from '../../src'

export const describeFunctorLaws: {
  <F extends Hkt>(
    Functor: functor.Functor<F>,
    Equivalence: equivalence.Equivalence<Kind<F, number, unknown, unknown>>,
    fas: nonEmptyArray.NonEmptyReadonlyArray<Kind<F, number, unknown, unknown>>,
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
        const ab = number.add(5)
        const bc = number.divide(2)

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
