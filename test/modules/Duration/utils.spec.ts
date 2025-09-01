import * as duration from "../../../src/modules/Duration"

describe ("isTemplateValid", () => {
  it ("should determine invalid templates", () => {
    expect (duration.isTemplateValid ("")).toBe (false)
    expect (duration.isTemplateValid ("  ")).toBe (false)
    expect (duration.isTemplateValid ("5")).toBe (false)
    expect (duration.isTemplateValid ("5  ms")).toBe (false)
    expect (duration.isTemplateValid ("5n ms")).toBe (false)
    expect (duration.isTemplateValid ("n ms")).toBe (false)
    expect (duration.isTemplateValid ("5 string")).toBe (false)
    expect (duration.isTemplateValid ("some string")).toBe (false)
  })

  it ("should determine template as a valid if in the end 's' is absent and value is 1", () => {
    expect (duration.isTemplateValid ("1 millisecond")).toBe (true)
    expect (duration.isTemplateValid ("10 millisecond")).toBe (false)
    expect (duration.isTemplateValid ("1 second")).toBe (true)
    expect (duration.isTemplateValid ("10 second")).toBe (false)
    expect (duration.isTemplateValid ("1 minute")).toBe (true)
    expect (duration.isTemplateValid ("10 minute")).toBe (false)
    expect (duration.isTemplateValid ("1 hour")).toBe (true)
    expect (duration.isTemplateValid ("10 hour")).toBe (false)
    expect (duration.isTemplateValid ("1 day")).toBe (true)
    expect (duration.isTemplateValid ("10 day")).toBe (false)
    expect (duration.isTemplateValid ("1 month")).toBe (true)
    expect (duration.isTemplateValid ("10 month")).toBe (false)
    expect (duration.isTemplateValid ("1 year")).toBe (true)
    expect (duration.isTemplateValid ("10 year")).toBe (false)
  })

  it ("should correctly determine validity of mixed templates", () => {
    expect (duration.isTemplateValid ("500 milliseconds")).toBe (true)
    expect (duration.isTemplateValid ("500 ms")).toBe (true)
    expect (duration.isTemplateValid ("1 second 500 ms")).toBe (true)
    expect (duration.isTemplateValid ("500 ms 1 second")).toBe (false)
    expect (
      duration.isTemplateValid (
        "1 year 9 months 5 days 10 hours 12 minutes 59 seconds 124 milliseconds",
      ),
    ).toBe (true)
    expect (
      duration.isTemplateValid (
        // Months and days are swapped
        "1 year 3 days 9 months 10 hours 12 minutes 59 seconds 124 milliseconds",
      ),
    ).toBe (false)
  })

  it ("should ignore trailing spaces", () => {
    expect (duration.isTemplateValid ("    500 ms    ")).toBe (true)
  })
})

describe ("prettify", () => {
  it ("should return duration where milliseconds no longer than 999, seconds and minutes no longer than 59 and so on", () => {
    expect (duration.prettify ({ milliseconds: 5000 })).toEqual ({ seconds: 5 })
    expect (duration.prettify ({ seconds: 122, milliseconds: 5000 })).toEqual ({
      minutes: 2,
      seconds: 7,
    })
    expect (duration.prettify ({ seconds: 122, milliseconds: 5500 })).toEqual ({
      minutes: 2,
      seconds: 7,
      milliseconds: 500,
    })
    expect (duration.prettify ({ months: 24 })).toEqual ({ years: 2 })
  })
})
