import { Number, Chunk, Array, Iterable, pipe } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  Chunk.Monad,
  Chunk.getEquivalence(Number.Equivalence),
  [Chunk.empty, Chunk.make(1), Chunk.make(1, 2, 3)],
  [
    () => Chunk.empty,
    a => Chunk.make(a + 1),
    a => Chunk.make(a + 1, a + 2, a + 3),
  ],
  [() => Chunk.empty, b => Chunk.make(b / 2, b / 3, b / 4)],
)

describe('gen', () => {
  it('`$` function should accept both lazy and eager versions of a chunk', () => {
    const f = jest.fn()
    const identity: <A>(a: A) => A = jest.fn(a => a)

    const FROM = 1
    const TO = 5
    const ma = Chunk.gen(function* ({ $, where }) {
      f()
      const x = yield* $(() =>
        pipe(FROM, Array.range(TO), Chunk.fromIterable, identity),
      )
      const y = yield* $(() => identity(Chunk.make('a', 'b')))
      const z = yield* $(Chunk.make(true))
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
