export interface URIToKind<A> {}
export interface URIToKind2<E, A> {}

export type URIS = keyof URIToKind<unknown>
export type URIS2 = keyof URIToKind2<unknown, unknown>

export type Kind<URI extends URIS, A> = URIToKind<A>[URI]
export type Kind2<URI extends URIS2, A, B> = URIToKind2<A, B>[URI]
