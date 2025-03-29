export type Repeat = (n: number) => (s: string) => string
export const repeat: Repeat = count => string => string.repeat (count)
