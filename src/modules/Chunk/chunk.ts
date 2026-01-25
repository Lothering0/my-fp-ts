import * as Array from '../ReadonlyArray'
import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { NonEmptyIterable } from '../_internal'

export interface Hkt extends Hkt_ {
  readonly Type: Chunk<this['In']>
}

export interface NonEmptyHkt extends Hkt_ {
  readonly Type: NonEmpty<this['In']>
}

export type NonEmpty<A> =
  | SingletonChunk<A>
  | ConcatChunk<A>
  | SliceChunk<A>
  | ArrayChunk<A>

export type Chunk<A> = NonEmpty<A> | EmptyChunk<A>

export type Infer<F extends Chunk<any>> = F extends Chunk<infer A> ? A : never

export type With<F extends Chunk<any>, A = Infer<F>> =
  F extends NonEmpty<any> ? NonEmpty<A> : Chunk<A>

export type OrNonEmpty<
  F extends Chunk<any>,
  G extends Chunk<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? NonEmpty<A>
    : G extends NonEmpty<any>
      ? NonEmpty<A>
      : Chunk<A>

export type AndNonEmpty<
  F extends Chunk<any>,
  G extends Chunk<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? G extends NonEmpty<any>
      ? NonEmpty<A>
      : Chunk<A>
    : Chunk<A>

export interface EmptyChunk<A> extends Iterable<A> {
  readonly _id: 'Chunk'
  readonly _tag: 'EmptyChunk'
  readonly length: 0
}

interface SingletonChunk<A> extends NonEmptyIterable<A> {
  readonly _id: 'Chunk'
  readonly _tag: 'SingletonChunk'
  readonly length: 1
  readonly a: A
}

interface ArrayChunk<A> extends NonEmptyIterable<A> {
  readonly _id: 'Chunk'
  readonly _tag: 'ArrayChunk'
  readonly length: number
  readonly array: Array.NonEmpty<A>
}

interface ConcatChunk<A> extends NonEmptyIterable<A> {
  readonly _id: 'Chunk'
  readonly _tag: 'ConcatChunk'
  readonly length: number
  readonly start: NonEmpty<A>
  readonly end: NonEmpty<A>
}

interface SliceChunk<A> extends NonEmptyIterable<A> {
  readonly _id: 'Chunk'
  readonly _tag: 'SliceChunk'
  readonly length: number
  readonly skip: number
  readonly chunk: NonEmpty<A>
}
