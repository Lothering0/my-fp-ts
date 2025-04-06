export interface Kind<A> {}
export interface Kind2<E, A> {}

export type URIS = keyof Kind<unknown>
export type URIS2 = keyof Kind2<unknown, unknown>
