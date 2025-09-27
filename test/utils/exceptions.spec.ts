import { raise, Result, tryDo } from '../../src'

describe('exceptions', () => {
  describe('raise', () => {
    it('should throw passed argument', () => {
      const x = 'a'
      const f = jest.fn(raise)
      expect(() => f(x)).toThrow(x)
    })
  })

  describe('tryDo', () => {
    it('should return correct `Result` instance', () => {
      const x = 'a'
      const failing = jest.fn(() => raise(x))
      const pass = jest.fn(() => x)

      expect(tryDo(failing)).toEqual(Result.fail(x))
      expect(tryDo(pass)).toEqual(Result.succeed(x))

      expect(failing).toHaveBeenCalledTimes(1)
      expect(pass).toHaveBeenCalledTimes(1)
    })
  })
})
