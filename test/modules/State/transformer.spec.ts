import { number, option, pipe, state } from '../../../src'

describe('transformer', () => {
  const stateOption = state.transform(option.Monad)

  describe('run', () => {
    it('should return tuple lifted to transformed monad context', () => {
      const fa: state.StateT<option.OptionHkt, number, never, string, string> =
        jest.fn(s => option.some([1, s]))
      expect(stateOption.run('')(fa)).toEqual(option.some([1, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('of', () => {
    it('should correctly lift value to `Option` monad context', () => {
      const fa: state.StateT<option.OptionHkt, number, never, string, unknown> =
        stateOption.of(1)
      expect(stateOption.run('')(fa)).toEqual(option.some([1, '']))
    })
  })

  describe('fromState', () => {
    it('should correctly lift state to transformed monad context', () => {
      const fa: state.StateT<option.OptionHkt, number, never, string, unknown> =
        jest.fn(stateOption.fromState(s => [1, s]))
      expect(stateOption.run('')(fa)).toEqual(option.some([1, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('fromKind', () => {
    it('should correctly lift state to transformed monad context', () => {
      const fa: state.StateT<option.OptionHkt, number, never, string, unknown> =
        stateOption.fromKind(option.some(1))
      expect(stateOption.run('')(fa)).toEqual(option.some([1, '']))
    })
  })

  describe('evaluate', () => {
    it('should return output lifted to transformed monad context', () => {
      const fa = jest.fn(stateOption.of(1))
      expect(stateOption.evaluate('')(fa)).toEqual(option.some(1))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('execute', () => {
    it('should return state lifted to transformed monad context', () => {
      const fa = jest.fn(stateOption.of(1))
      expect(stateOption.execute('')(fa)).toEqual(option.some(''))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('map', () => {
    it('should correctly lift function to transformed monad context', () => {
      const fa = jest.fn(stateOption.of(1))
      const result_ = pipe(
        fa,
        stateOption.map(number.add(1)),
        stateOption.run(''),
      )
      expect(result_).toEqual(option.some([2, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })

  describe('flat', () => {
    it('should correctly remove one layer of transformed monad context', () => {
      const fa = jest.fn(stateOption.of(1))
      const result_ = pipe(
        fa,
        stateOption.of,
        stateOption.flat,
        stateOption.run(''),
      )
      expect(result_).toEqual(option.some([1, '']))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
