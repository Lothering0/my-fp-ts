export const not: {
  <A extends boolean>(a: A): A extends true ? false : true
} = <A>(a: A) => !a as A extends true ? false : true

export const or: {
  (y: boolean): (x: boolean) => boolean
} = y => x => x || y

export const xor: {
  (y: boolean): (x: boolean) => boolean
} = y => x => (x || y) && !(x && y)

export const and: {
  (y: boolean): (x: boolean) => boolean
} = y => x => x && y
