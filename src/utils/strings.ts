type ToLowerCase = (x: string) => string
export const toLowerCase: ToLowerCase = x => x.toLowerCase ()

type ToUppperCase = (x: string) => string
export const toUpperCase: ToUppperCase = x => x.toUpperCase ()

type Repeat = (n: number) => (s: string) => string
export const repeat: Repeat = count => string => string.repeat (count)
