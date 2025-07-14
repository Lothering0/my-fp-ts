import * as Tr from "../../../src/modules/Tree"
import { describeFunctor } from "../../_utils/describeFunctor"

describeFunctor (Tr, [
  Tr.make (1),
  Tr.make (1, [Tr.make (2), Tr.make (3)]),
  Tr.make (1, [Tr.make (2, [Tr.make (4)]), Tr.make (3)]),
])
