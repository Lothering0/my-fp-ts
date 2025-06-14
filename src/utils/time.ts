import { Io } from "../modules/Io"

type Now = Io<number>
export const now: Now = () => Date.now ()
