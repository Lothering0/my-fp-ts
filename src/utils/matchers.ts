import * as readonlyArray from "../modules/ReadonlyArray"
import * as option from "../modules/Option"
import * as eq from "../types/Eq"
import { LazyArg } from "../types/utils"
import { pipe } from "./flow"
import { uncurry } from "./currying"

interface Matchers<Pattern, A> {
  <B>(ab: (a: A) => B): (a: A) => B
  <B, C = B>(ab: (a: A) => B, c: [Pattern, LazyArg<C>]): (a: A) => B | C
  <B, C = B, D = C>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
  ): (a: A) => B | C | D
  <B, C = B, D = C, E = D>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
  ): (a: A) => B | C | D | E
  <B, C = B, D = C, E = D, F = E>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
  ): (a: A) => B | C | D | E | F
  <B, C = B, D = C, E = D, F = E, G = F>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
  ): (a: A) => B | C | D | E | F | G
  <B, C = B, D = C, E = D, F = E, G = F, H = G>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
  ): (a: A) => B | C | D | E | F | G | H
  <B, C = B, D = C, E = D, F = E, G = F, H = G, I = H>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
  ): (a: A) => B | C | D | E | F | G | H | I
  <B, C = B, D = C, E = D, F = E, G = F, H = G, I = H, J = I>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
  ): (a: A) => B | C | D | E | F | G | H | I | J
  <B, C = B, D = C, E = D, F = E, G = F, H = G, I = H, J = I, K = J>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K
  <B, C = B, D = C, E = D, F = E, G = F, H = G, I = H, J = I, K = J, L = K>(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L | M
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L | M | N
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
    O = N,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
    o: [Pattern, LazyArg<O>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L | M | N | O
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
    O = N,
    P = O,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
    o: [Pattern, LazyArg<O>],
    p: [Pattern, LazyArg<P>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L | M | N | O | P
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
    O = N,
    P = O,
    Q = P,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
    o: [Pattern, LazyArg<O>],
    p: [Pattern, LazyArg<P>],
    q: [Pattern, LazyArg<Q>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
    O = N,
    P = O,
    Q = P,
    R = Q,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
    o: [Pattern, LazyArg<O>],
    p: [Pattern, LazyArg<P>],
    q: [Pattern, LazyArg<Q>],
    r: [Pattern, LazyArg<R>],
  ): (a: A) => B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
    O = N,
    P = O,
    Q = P,
    R = Q,
    S = R,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
    o: [Pattern, LazyArg<O>],
    p: [Pattern, LazyArg<P>],
    q: [Pattern, LazyArg<Q>],
    r: [Pattern, LazyArg<R>],
    s: [Pattern, LazyArg<S>],
  ): (
    a: A,
  ) => B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S
  <
    B,
    C = B,
    D = C,
    E = D,
    F = E,
    G = F,
    H = G,
    I = H,
    J = I,
    K = J,
    L = K,
    M = L,
    N = M,
    O = N,
    P = O,
    Q = P,
    R = Q,
    S = R,
    T = S,
  >(
    ab: (a: A) => B,
    c: [Pattern, LazyArg<C>],
    d: [Pattern, LazyArg<D>],
    e: [Pattern, LazyArg<E>],
    f: [Pattern, LazyArg<F>],
    g: [Pattern, LazyArg<G>],
    h: [Pattern, LazyArg<H>],
    i: [Pattern, LazyArg<I>],
    j: [Pattern, LazyArg<J>],
    k: [Pattern, LazyArg<K>],
    l: [Pattern, LazyArg<L>],
    m: [Pattern, LazyArg<M>],
    n: [Pattern, LazyArg<N>],
    o: [Pattern, LazyArg<O>],
    p: [Pattern, LazyArg<P>],
    q: [Pattern, LazyArg<Q>],
    r: [Pattern, LazyArg<R>],
    s: [Pattern, LazyArg<S>],
    t: [Pattern, LazyArg<T>],
  ): (
    a: A,
  ) => B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T
  <B>(
    ab: (a: A) => B,
    ...matchers: readonly [Pattern, LazyArg<B>][]
  ): (a: A) => B
}

export const matchOn: {
  <Pattern, A>(p: (pattern: Pattern, a: A) => boolean): Matchers<Pattern, A>
} =
  <Pattern, A>(p: (pattern: Pattern, a: A) => boolean) =>
  <B>(ab: (a: A) => B, ...matchers: readonly [Pattern, LazyArg<B>][]) =>
  (a: A): B =>
    pipe (
      matchers,
      readonlyArray.find (([pattern]) => p (pattern, a)),
      option.match (
        () => ab (a),
        ([, f]) => f (),
      ),
    )

export const matchEq: {
  <A>(Eq: eq.Eq<A>): Matchers<A, A>
} = Eq => pipe (Eq.equals, uncurry, matchOn)

export const match = <A>() => matchEq<A> (eq.EqStrict)

export const matchInstance: {
  <A, B>(
    ab: (a: A) => B,
    ...matchers: readonly [new (...args: unknown[]) => A, LazyArg<B>][]
  ): (a: A) => B
} = matchOn ((pattern, a) => a instanceof (pattern as never))
