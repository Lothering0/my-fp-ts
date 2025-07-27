import * as tree from "../../../src/modules/Tree"
import * as number from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  tree.Applicative,
  [
    tree.make (1),
    tree.make (1, [tree.make (2), tree.make (3)]),
    tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
  ],
  [
    tree.make (number.add (1)),
    tree.make (number.add (1), [
      tree.make (number.add (2)),
      tree.make (number.add (3)),
    ]),
    tree.make (number.add (1), [
      tree.make (number.add (2), [tree.make (number.add (4))]),
      tree.make (number.add (3)),
    ]),
  ],
)
