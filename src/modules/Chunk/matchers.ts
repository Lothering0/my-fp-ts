import * as Chunk from './chunk'
import { LazyArg } from '../../types/utils'
import { isNonEmpty } from './refinements'
import { headNonEmpty, initNonEmpty, lastNonEmpty, tailNonEmpty } from './utils'

export interface Matchers<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (chunk: Chunk.NonEmpty<A>) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (chunk: Chunk.Chunk<A>) => B | C
} = matchers => chunk =>
  isNonEmpty(chunk) ? matchers.onNonEmpty(chunk) : matchers.onEmpty()

export interface MatchersLeft<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (head: A, tail: Chunk.Chunk<A>) => C
}

export const matchLeft: {
  <A, B, C = B>(
    matchers: MatchersLeft<A, B, C>,
  ): (chunk: Chunk.Chunk<A>) => B | C
} = matchers => chunk =>
  isNonEmpty(chunk)
    ? matchers.onNonEmpty(headNonEmpty(chunk), tailNonEmpty(chunk))
    : matchers.onEmpty()

export interface MatchersRight<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (init: Chunk.Chunk<A>, last: A) => C
}

export const matchRight: {
  <A, B, C = B>(
    matchers: MatchersRight<A, B, C>,
  ): (chunk: Chunk.Chunk<A>) => B | C
} = matchers => chunk =>
  isNonEmpty(chunk)
    ? matchers.onNonEmpty(initNonEmpty(chunk), lastNonEmpty(chunk))
    : matchers.onEmpty()
