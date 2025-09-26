import { array } from '../../../src'

describe('extend', () => {
  it('should correctly extend an array', () =>
    expect(array.extend(array.join(','))(['a', 'b', 'c'])).toEqual([
      'a,b,c',
      'b,c',
      'c',
    ]))
})
