import { Number, Iterable, Array, pipe } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  Iterable.Monad,
  Iterable.getEquivalence(Number.Equivalence),
  [[], [1], [1, 2, 3]],
  [() => [], a => [a + 1], a => [a + 1, a + 2, a + 3]],
  [() => [], b => [b / 2, b / 3, b / 4]],
)

describe('gen', () => {
  it('`$` function should accept both lazy and eager versions of a iterable', () => {
    const f = jest.fn()
    const identity: <A>(a: A) => A = jest.fn(a => a)

    const FROM = 1
    const TO = 5
    const ma = Iterable.gen(function* ({ $, where }) {
      f()
      const x = yield* $(() => identity(Array.range(TO)(FROM)))
      const y = yield* $(() => identity(['a', 'b']))
      const z = yield* $([true])
      yield* where(x % 2 !== 0)
      return [x, y, z] as const
    })

    pipe(ma, Iterable.toReadonlyArray, expect).toEqual([
      [1, 'a', true],
      [1, 'b', true],
      [3, 'a', true],
      [3, 'b', true],
      [5, 'a', true],
      [5, 'b', true],
    ])
    const INITIAL_ITERATION = 1
    const COLUMNS = 3
    const UNFILTERED_RAWS = 8
    const ITERATIONS = INITIAL_ITERATION + COLUMNS * UNFILTERED_RAWS + 1
    expect(f).toHaveBeenCalledTimes(ITERATIONS)

    const RANGE_LENGTH = TO
    expect(identity).toHaveBeenCalledTimes(RANGE_LENGTH + 1)
  })
})
