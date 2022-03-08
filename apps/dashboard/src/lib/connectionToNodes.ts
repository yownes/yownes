interface Node<T> {
  node: T | null;
}

interface Connection<T> {
  edges: (Node<T> | null)[];
}

export default function connectionToNodes<T>(
  connection?: Connection<T> | null
) {
  return connection?.edges.map((edge) => edge!!.node!!) ?? [];
}
