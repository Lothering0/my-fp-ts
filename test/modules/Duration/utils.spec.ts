import { Duration } from '../../../src'

describe('isTemplateValid', () => {
  it('should determine invalid templates', () => {
    expect(Duration.isTemplateValid('')).toBe(false)
    expect(Duration.isTemplateValid('  ')).toBe(false)
    expect(Duration.isTemplateValid('5')).toBe(false)
    expect(Duration.isTemplateValid('5  ms')).toBe(false)
    expect(Duration.isTemplateValid('5n ms')).toBe(false)
    expect(Duration.isTemplateValid('n ms')).toBe(false)
    expect(Duration.isTemplateValid('5 string')).toBe(false)
    expect(Duration.isTemplateValid('some string')).toBe(false)
  })

  it("should determine template as a valid if in the end 's' is absent and value is 1", () => {
    expect(Duration.isTemplateValid('1 millisecond')).toBe(true)
    expect(Duration.isTemplateValid('10 millisecond')).toBe(false)
    expect(Duration.isTemplateValid('1 second')).toBe(true)
    expect(Duration.isTemplateValid('10 second')).toBe(false)
    expect(Duration.isTemplateValid('1 minute')).toBe(true)
    expect(Duration.isTemplateValid('10 minute')).toBe(false)
    expect(Duration.isTemplateValid('1 hour')).toBe(true)
    expect(Duration.isTemplateValid('10 hour')).toBe(false)
    expect(Duration.isTemplateValid('1 day')).toBe(true)
    expect(Duration.isTemplateValid('10 day')).toBe(false)
    expect(Duration.isTemplateValid('1 month')).toBe(true)
    expect(Duration.isTemplateValid('10 month')).toBe(false)
    expect(Duration.isTemplateValid('1 year')).toBe(true)
    expect(Duration.isTemplateValid('10 year')).toBe(false)
  })

  it('should correctly determine validity of mixed templates', () => {
    expect(Duration.isTemplateValid('500 milliseconds')).toBe(true)
    expect(Duration.isTemplateValid('500 ms')).toBe(true)
    expect(Duration.isTemplateValid('1 second 500 ms')).toBe(true)
    expect(Duration.isTemplateValid('500 ms 1 second')).toBe(false)
    expect(
      Duration.isTemplateValid(
        '1 year 9 months 5 days 10 hours 12 minutes 59 seconds 124 milliseconds',
      ),
    ).toBe(true)
    expect(
      Duration.isTemplateValid(
        // Months and days are swapped
        '1 year 3 days 9 months 10 hours 12 minutes 59 seconds 124 milliseconds',
      ),
    ).toBe(false)
  })

  it('should ignore trailing spaces', () => {
    expect(Duration.isTemplateValid('    500 ms    ')).toBe(true)
  })
})

describe('prettify', () => {
  it('should return duration where milliseconds no longer than 999, seconds and minutes no longer than 59 and so on', () => {
    expect(Duration.prettify({ milliseconds: 5000 })).toEqual({ seconds: 5 })
    expect(Duration.prettify({ seconds: 122, milliseconds: 5000 })).toEqual({
      minutes: 2,
      seconds: 7,
    })
    expect(Duration.prettify({ seconds: 122, milliseconds: 5500 })).toEqual({
      minutes: 2,
      seconds: 7,
      milliseconds: 500,
    })
    expect(Duration.prettify({ months: 24 })).toEqual({ years: 2 })
  })
})
