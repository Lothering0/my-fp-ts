import { Tagged } from '../types/Tag'
import { raise } from '../utils/exceptions'

const getTaggedError: {
  <E extends new (...args: any[]) => any>(
    ErrorConstructor: E,
  ): <A extends string>(
    tag: A,
  ) => new (...args: ConstructorParameters<E>) => InstanceType<E> &
    Tagged<A> & {
      readonly _id: 'Error'
    }
} = ErrorConstructor => tag =>
  class extends ErrorConstructor {
    readonly _id = 'Error'
    readonly _tag = tag
    constructor(...args: any[]) {
      super(...args)
      this.name = tag
    }
  }

export const TaggedError = getTaggedError(Error)
export const TaggedAggregateError = getTaggedError(AggregateError)
export const TaggedEvalError = getTaggedError(EvalError)
export const TaggedRangeError = getTaggedError(RangeError)
export const TaggedReferenceError = getTaggedError(ReferenceError)
export const TaggedSuppressedError =
  typeof SuppressedError === 'undefined'
    ? () => raise('`SuppressedError` is not supported')
    : getTaggedError(SuppressedError)
export const TaggedSyntaxError = getTaggedError(SyntaxError)
export const TaggedTypeError = getTaggedError(TypeError)
export const TaggedUriError = getTaggedError(URIError)

export class UnknownException extends TaggedError('UnknownException') {
  constructor(public readonly exception?: unknown) {
    super()
  }
}
