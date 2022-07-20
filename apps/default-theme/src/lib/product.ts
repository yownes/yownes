interface Combination {
  __typename: string;
  id: string[];
  lowStockAlert: boolean;
  price: string;
  quantity: number;
}

function getCombination(
  options: Record<string, string | null | undefined>,
  combinations: Combination[]
): Combination | undefined {
  const opts = Object.values(options);
  let combination: Combination | undefined = undefined;
  let op = undefined;
  combinations.map((c) => {
    op = c.id.every((c) => {
      return opts.includes(c);
    });
    if (op) {
      combination = c;
    }
  });
  return combination;
}

export function getStockCombination(
  options: Record<string, string | null | undefined>,
  combinations: Combination[]
) {
  return getCombination(options, combinations)?.quantity ?? -1;
}

export function getPriceCombination(
  price: string,
  tax: number,
  options: Record<string, string | null | undefined>,
  combinations: Combination[]
) {
  const combination = getCombination(options, combinations);
  const currency = price.slice(price.length - 2);
  const priceProduct = parseFloat(price.slice(0, -2).replace(",", "."));
  const priceCombination = parseFloat(
    (combination?.price ? combination?.price : "0").replace(",", ".")
  );
  const priceWithPriceCombination = (
    priceProduct +
    priceCombination +
    priceCombination * (tax / 100)
  )
    .toFixed(2)
    .replace(".", ",");
  return `${priceWithPriceCombination}${currency}`;
}

export function isInCombinations(
  name: string,
  id: string,
  options: Record<string, string | null | undefined>,
  combinations: Combination[]
) {
  const comb = [
    ...new Set(
      combinations
        .map((c) => {
          return c.id.includes(id) && c.quantity > 0 ? c.id : [];
        })
        .reduce((a, b) => {
          return a.concat(b);
        })
    ),
  ].filter((c) => c !== id);
  let opts: (string | null | undefined)[] = [];
  Object.entries(options).forEach(([key, value]) => {
    if (key !== name) {
      opts = [...opts, value];
    }
  });
  let op = undefined;
  let isIn = false;
  opts.map((o) => {
    if (o) {
      op = comb.includes(o);
      if (op) {
        isIn = true;
      }
    }
  });
  return isIn;
}
