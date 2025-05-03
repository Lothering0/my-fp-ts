import { IO } from "../modules/io"

type Now = IO<number>
export const now: Now = () => Date.now ()
