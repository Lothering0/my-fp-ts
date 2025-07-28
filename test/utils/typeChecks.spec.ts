import * as typeChecks from "../../src/utils/typeChecks"

describe ("typeChecks", () => {
  const typeByName = {
    number: 1,
    bigint: 1n,
    string: "",
    true: true,
    false: false,
    null: null,
    function: () => 0,
    array: [],
    object: {},
    undefined: undefined,
    symbol: Symbol (),
  }

  describe ("typeOf", () => {
    Object.values (typeByName).forEach (x => {
      const expected = typeof x
      it (`should correctly determine \`${expected}\` type`, () =>
        expect (typeChecks.typeOf (x)).toBe (expected))
    })
  })

  interface TestCase {
    readonly f: (...args: ReadonlyArray<unknown>) => unknown
    /** `f` should return `true` if applied with one of these values */
    readonly values: ReadonlyArray<unknown>
  }

  const testCases: ReadonlyArray<TestCase> = [
    {
      f: typeChecks.isNumber,
      values: [typeByName.number],
    },
    {
      f: typeChecks.isBigint,
      values: [typeByName.bigint],
    },
    {
      f: typeChecks.isString,
      values: [typeByName.string],
    },
    {
      f: typeChecks.isBoolean,
      values: [typeByName.true, typeByName.false],
    },
    {
      f: typeChecks.isNullableObject,
      values: [typeByName.object, typeByName.array, typeByName.null],
    },
    {
      f: typeChecks.isObject,
      values: [typeByName.object, typeByName.array],
    },
    {
      f: typeChecks.isFunction,
      values: [typeByName.function],
    },
    {
      f: typeChecks.isNull,
      values: [typeByName.null],
    },
    {
      f: typeChecks.isNullable,
      values: [typeByName.undefined, typeByName.null],
    },
    {
      f: typeChecks.isUndefined,
      values: [typeByName.undefined],
    },
    {
      f: typeChecks.isSymbol,
      values: [typeByName.symbol],
    },
    {
      f: typeChecks.isDefined,
      values: Object.values (typeByName).filter (
        x => x !== null && x !== undefined,
      ),
    },
  ]

  testCases.forEach (({ f, values }) => {
    describe (f.name, () => {
      it.each (Object.entries (typeByName)) (
        "should correctly determine %p",
        (_, x) => {
          expect (f (x)).toBe (values.includes (x))
        },
      )
    })
  })
})
