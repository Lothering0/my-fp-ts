type BinaryTree<A> = Leaf | Branch<A>

interface Leaf {
  readonly _tag: "Leaf"
}

interface Branch<A> {
  readonly _tag: "Tree"
  readonly left: BinaryTree<A>
  readonly value: A
  readonly right: BinaryTree<A>
}

const leaf: BinaryTree<never> = {
  _tag: "Leaf",
}

const binaryTree = <A>(
  left: BinaryTree<A>,
  value: A,
  right: BinaryTree<A>,
): BinaryTree<A> => ({
  _tag: "Tree",
  left,
  value,
  right,
})

type IsLeaf = (x: BinaryTree<unknown>) => x is Leaf
const isLeaf: IsLeaf = x => x._tag === "Leaf"

type SumTree = (x: BinaryTree<number>) => number
const sumTree: SumTree = x =>
  isLeaf (x) ? 0 : sumTree (x.left) + x.value + sumTree (x.right)

type BuildBinaryTree = (ns: Array<number>) => BinaryTree<number>
const buildBinaryTree: BuildBinaryTree = ns => {
  type Aux = (n: number) => (x: BinaryTree<number>) => BinaryTree<number>
  const aux: Aux = n => x =>
    isLeaf (x)
      ? binaryTree (leaf, n, leaf)
      : x.value === n
        ? x
        : x.value > n
          ? binaryTree (aux (n) (x.left), x.value, x.right)
          : binaryTree (x.left, x.value, aux (n) (x.right))

  return ns.reduceRight ((prev, curr) => aux (curr) (prev), leaf)
}
