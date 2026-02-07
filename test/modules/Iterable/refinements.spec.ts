import { pipe, Iterable, Chunk, List } from '../../../src'

describe('isNonEmpty', () => {
  it('should correctly define is iterable a non-empty', () => {
    pipe(Iterable.empty, Iterable.isNonEmpty, expect).toBe(false)
    pipe(Iterable.of(1), Iterable.isNonEmpty, expect).toBe(true)
  })

  it('should correctly define is array a non-empty', () => {
    pipe([], Iterable.isNonEmpty, expect).toBe(false)
    pipe([1, 2, 3], Iterable.isNonEmpty, expect).toBe(true)
  })

  it('should correctly define is string a non-empty', () => {
    pipe('', Iterable.isNonEmpty, expect).toBe(false)
    pipe('123', Iterable.isNonEmpty, expect).toBe(true)
  })

  it('should correctly define is chunk a non-empty', () => {
    pipe(Chunk.empty, Iterable.isNonEmpty, expect).toBe(false)
    pipe(Chunk.make(1, 2, 3), Iterable.isNonEmpty, expect).toBe(true)
  })

  it('should correctly define is list a non-empty', () => {
    pipe(List.empty, Iterable.isNonEmpty, expect).toBe(false)
    pipe(List.make(1, 2, 3), Iterable.isNonEmpty, expect).toBe(true)
  })
})
