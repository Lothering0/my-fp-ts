import { duration } from "../../../src"

describe ("Show", () => {
  describe ("show", () => {
    it ("should place units and values in right order", () => {
      expect (duration.show ({ days: 5, y: 3, years: 5 })).toBe (
        'make ("5 years 5 days")',
      )
      expect (
        duration.show ({ d: 1, h: 1, m: 1, ms: 1, mn: 1, y: 1, s: 1 }),
      ).toBe (
        'make ("1 year 1 month 1 day 1 hour 1 minute 1 second 1 millisecond")',
      )
    })
  })
})
