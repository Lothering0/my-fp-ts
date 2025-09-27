import { Number, Option, pipe, State } from '../../../src'

describe('transformer', () => {
  const StateOption = State.transform(Option.Monad)

  describe('run', () => {
    it('should return tuple lifted to transformed monad context', () => {
      const fa: State.StateT<Option.OptionHkt, number, never, string, string> =
        jest.fn(s => Option.some([1, s]))
      expect(StateOption.run('')(fa)).toEqual(Option.some([1, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('of', () => {
    it('should correctly lift value to `Option` monad context', () => {
      const fa: State.StateT<Option.OptionHkt, number, never, string, unknown> =
        StateOption.of(1)
      expect(StateOption.run('')(fa)).toEqual(Option.some([1, '']))
    })
  })

  describe('fromState', () => {
    it('should correctly lift state to transformed monad context', () => {
      const fa: State.StateT<Option.OptionHkt, number, never, string, unknown> =
        jest.fn(StateOption.fromState(s => [1, s]))
      expect(StateOption.run('')(fa)).toEqual(Option.some([1, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('fromKind', () => {
    it('should correctly lift state to transformed monad context', () => {
      const fa: State.StateT<Option.OptionHkt, number, never, string, unknown> =
        StateOption.fromKind(Option.some(1))
      expect(StateOption.run('')(fa)).toEqual(Option.some([1, '']))
    })
  })

  describe('evaluate', () => {
    it('should return output lifted to transformed monad context', () => {
      const fa = jest.fn(StateOption.of(1))
      expect(StateOption.evaluate('')(fa)).toEqual(Option.some(1))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('execute', () => {
    it('should return state lifted to transformed monad context', () => {
      const fa = jest.fn(StateOption.of(1))
      expect(StateOption.execute('')(fa)).toEqual(Option.some(''))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('map', () => {
    it('should correctly lift function to transformed monad context', () => {
      const fa = jest.fn(StateOption.of(1))
      const result = pipe(
        fa,
        StateOption.map(Number.add(1)),
        StateOption.run(''),
      )
      expect(result).toEqual(Option.some([2, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('flat', () => {
    it('should correctly remove one layer of transformed monad context', () => {
      const fa = jest.fn(StateOption.of(1))
      const result = pipe(
        fa,
        StateOption.of,
        StateOption.flat,
        StateOption.run(''),
      )
      expect(result).toEqual(Option.some([1, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
