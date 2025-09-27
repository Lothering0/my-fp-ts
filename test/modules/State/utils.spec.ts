import { Number, State } from '../../../src'

describe('gets', () => {
  it('should correctly put formatted output to first position', () => {
    const fa = State.gets(Number.show)
    expect(fa(1)).toEqual(['1', 1])
  })
})

describe('get', () => {
  it('should correctly put state to first position', () => {
    const fa = State.get()
    expect(fa(1)).toEqual([1, 1])
  })
})

describe('modify', () => {
  it('should correctly modify state', () => {
    const fa = State.modify<number>(Number.add(1))
    expect(fa(1)).toEqual([undefined, 2])
  })
})

describe('put', () => {
  it('should correctly replace state', () => {
    const fa = State.put(2)
    expect(fa(1)).toEqual([undefined, 2])
  })
})

describe('run', () => {
  it('should return tuple', () => {
    const fa: State.State<number, string> = x => [Number.show(x), x]
    expect(State.run(1)(fa)).toEqual(['1', 1])
  })
})

describe('evaluate', () => {
  it('should return output', () => {
    const fa: State.State<number, string> = x => [Number.show(x), x]
    expect(State.evaluate(1)(fa)).toEqual('1')
  })
})

describe('execute', () => {
  it('should return state', () => {
    const fa: State.State<number, string> = x => [Number.show(x), x]
    expect(State.execute(1)(fa)).toEqual(1)
  })
})
