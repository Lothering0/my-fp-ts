**my-fp-ts** is a pet-project, [fp-ts](https://github.com/gcanti/fp-ts) library implemented from zero. It was made just for fun. It is not fully compatible with the original library and has a lot of things that I made in my way. There some of key differences:

- Higher-kinded polymorphism is not implemented with URIS (as in [fp-ts v2](https://github.com/gcanti/fp-ts/blob/2.16.1/src/HKT.ts)) but in similar way as [fp-ts v3](https://github.com/gcanti/fp-ts/blob/3.0.0-new-hkt/src/HKT.ts) or [Effect](https://github.com/Effect-TS/effect/blob/effect%403.16.12/packages/effect/src/HKT.ts), via `HKT` interface and using `this` TypeScript keyword for applying types to higher-kinded constructors. However it was the case in older implementations of the pet-project, so you can find initial implementation in [the tag "uris"](https://github.com/Lothering0/fp-ts-clone/tree/uris).
- File structure differs. While [fp-ts](https://github.com/gcanti/fp-ts) holds all files in a flat directory `src`, my `src` contains three sections: `modules`, `types` and `utils`. Each module in `modules` has separated for its own purpose `.ts` files (type class instance, module utils, refinements, etc). In [fp-ts](https://github.com/gcanti/fp-ts) all stuff related to a module exists in one file.
- Naming differences (original -> my implementation):
  - monad `Either` with `left` and `right` constructors -> monad `Result` with `failure` and `success` constructors;
  - monads `IO`, `IOOption` and `IOEither` -> monads `Sync`, `SyncOption` and `SyncResult`;
  - monads `Task`, `TaskOption` and `TaskEither` -> monads `Async`, `AsyncOption` and `AsyncResult`;
  - function `let` -> function `setTo`;
  - function `flatten` -> function `flat`
- My implementation has no `Array` and `NonEmptyArray` monads. Instead there are only `ReadonlyArray` and `NonEmptyReadonlyArray`. This modules don't contain `unsafe` operations.
- There are modules and type classes which I have not implemented... yet or will never do.

Would thank to [Encoding HKTs in TypeScript](https://dev.to/effect/encoding-of-hkts-in-typescript-5c3) article by [Mike Arnaldi](https://github.com/mikearnaldi) for inspiration.
