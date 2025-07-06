A clone of [fp-ts](https://github.com/gcanti/fp-ts) library.

Higher-kinded polymorphism is not implemented with URIS (as in [fp-ts v2](https://github.com/gcanti/fp-ts/blob/2.16.1/src/HKT.ts)) but in similar way as [fp-ts v3](https://github.com/gcanti/fp-ts/blob/3.0.0-new-hkt/src/HKT.ts) or [Effect](https://github.com/Effect-TS/effect/blob/effect%403.16.12/packages/effect/src/HKT.ts), via `HKT` interface and using `this` TypeScript keyword for applying types to higher-kinded constructors. However it was the case in older implementations of my pet-project, so you can find initial implementation in [the tag "uris"](https://github.com/Lothering0/fp-ts-clone/tree/uris).

Would thank to [Encoding HKTs in TypeScript](https://dev.to/effect/encoding-of-hkts-in-typescript-5c3) article by [Mike Arnaldi](https://github.com/mikearnaldi) for inspiration.
