import { Array } from '../../../src'

describe('extend', () => {
  it('should correctly extend an array', () =>
    expect(Array.extend(Array.join(','))(['a', 'b', 'c'])).toEqual([
      'a,b,c',
      'b,c',
      'c',
    ]))
})
