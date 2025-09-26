import { number, state } from '../../../src'

describe('gets', () => {
  it('should correctly put formatted output to first position', () => {
    const fa = state.gets(number.show)
    expect(fa(1)).toEqual(['1', 1])
  })
})

describe('get', () => {
  it('should correctly put state to first position', () => {
    const fa = state.get()
    expect(fa(1)).toEqual([1, 1])
  })
})

describe('modify', () => {
  it('should correctly modify state', () => {
    const fa = state.modify<number>(number.add(1))
    expect(fa(1)).toEqual([undefined, 2])
  })
})

describe('put', () => {
  it('should correctly replace state', () => {
    const fa = state.put(2)
    expect(fa(1)).toEqual([undefined, 2])
  })
})

describe('run', () => {
  it('should return tuple', () => {
    const fa: state.State<number, string> = x => [number.show(x), x]
    expect(state.run(1)(fa)).toEqual(['1', 1])
  })
})

describe('evaluate', () => {
  it('should return output', () => {
    const fa: state.State<number, string> = x => [number.show(x), x]
    expect(state.evaluate(1)(fa)).toEqual('1')
  })
})

describe('execute', () => {
  it('should return state', () => {
    const fa: state.State<number, string> = x => [number.show(x), x]
    expect(state.execute(1)(fa)).toEqual(1)
  })
})
