import * as result from '../Result'
import * as boolean from '../Boolean'
import * as equivalence from '../../typeclasses/Equivalence'
import { flow, pipe } from '../../utils/flow'
import { isUndefined } from '../../utils/typeChecks'
import { create, Schema, SchemaOptional } from './schema'
import { message } from './process'
import { LazyArg } from '../../types/utils'
import { hole } from '../../utils/hole'

export const equals =
  <A>(Equivalence: equivalence.Equivalence<A>) =>
  (a: A): Schema<A> =>
    create(x =>
      pipe(
        x,
        Equivalence.equals(a),
        boolean.match({
          onTrue: () => result.succeed(x as A),
          onFalse: () =>
            result.fail([message`value ${x} is not equal to ${a}`]),
        }),
      ),
    )

export const exact = <const A>(a: A): Schema<A> =>
  pipe(a, equals<A>(equivalence.EquivalenceStrict))

export const lazy = <A>(schema: LazyArg<Schema<A>>): Schema<A> => {
  const finalSchema: Schema<A> = create(x => {
    const currentSchema = schema()
    const writableSchema: {
      -readonly [K in keyof Schema<unknown>]: Schema<unknown>[K]
    } = finalSchema
    writableSchema.isOptional = currentSchema.isOptional
    writableSchema.schemasByKey = currentSchema.schemasByKey
    return currentSchema.proceed(x)
  })

  return finalSchema
}

export const optional: {
  <In, Out = In>(schema: Schema<In, Out>): SchemaOptional<In, Out | undefined>
} = schema => ({
  In: hole(),
  Type: hole(),
  isOptional: true,
  schemasByKey: schema.schemasByKey,
  proceed: x => {
    if (isUndefined(x)) {
      return result.succeed(x)
    }

    return schema.proceed(x)
  },
})

export const instanceOf: {
  <A>(constructor: new (...args: unknown[]) => A): Schema<A>
} = constructor =>
  create(x => {
    if (x instanceof constructor) {
      return result.succeed(x)
    }

    return result.fail([
      message`value ${x} is not an instance of ${constructor.name}`,
    ])
  })

export const union: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A | B>
} = that => self =>
  create(x => {
    const selfResult = self.proceed(x)
    const thatResult = that.proceed(x)
    const isValid = result.isSuccess(selfResult) || result.isSuccess(thatResult)

    if (!isValid) {
      return result.fail([
        ...result.failureOf(selfResult),
        ...result.failureOf(thatResult),
      ])
    }

    return pipe(thatResult, result.orElse(selfResult))
  })

export const minLength =
  (min: number) =>
  <A extends ReadonlyArray<unknown> | string>(self: Schema<A>): Schema<A> =>
    create(x => {
      const processResult = self.proceed(x)

      if (result.isFailure(processResult)) {
        return processResult
      }

      const { length } = x as { length: number }
      if (length < min) {
        return result.fail([
          `value length should not be less than ${min}, got ${length}`,
        ])
      }
      return result.succeed(x as A)
    })

export const maxLength =
  (max: number) =>
  <A extends ReadonlyArray<unknown> | string>(self: Schema<A>): Schema<A> =>
    create(x => {
      const processResult = self.proceed(x)

      if (result.isFailure(processResult)) {
        return processResult
      }

      const { length } = x as { length: number }
      if (length > max) {
        return result.fail([
          `value length should not be greater than ${max}, got ${length}`,
        ])
      }
      return result.succeed(x as A)
    })

export const transformIn: {
  <In, In1 = unknown, Out = In1>(
    f: (a: unknown) => Out,
  ): (Schema: Schema<In, Out>) => Schema<In1, Out>
} = f => Schema => create(flow(f, Schema.proceed))

export const transformOut: {
  <Out1, In, Out2>(
    f: (a: Out1) => Out2,
  ): (Schema: Schema<In, Out1>) => Schema<In, Out2>
} = f => Schema => create(flow(Schema.proceed, result.map(f)))
