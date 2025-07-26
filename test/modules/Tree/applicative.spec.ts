import * as Tr from "../../../src/modules/Tree"
import * as N from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  Tr.Applicative,
  [
    Tr.make (1),
    Tr.make (1, [Tr.make (2), Tr.make (3)]),
    Tr.make (1, [Tr.make (2, [Tr.make (4)]), Tr.make (3)]),
  ],
  [
    Tr.make (N.add (1)),
    Tr.make (N.add (1), [Tr.make (N.add (2)), Tr.make (N.add (3))]),
    Tr.make (N.add (1), [
      Tr.make (N.add (2), [Tr.make (N.add (4))]),
      Tr.make (N.add (3)),
    ]),
  ],
)
