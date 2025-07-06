import { Sync } from "../modules/Sync"

export const now: Sync<number> = () => Date.now ()
