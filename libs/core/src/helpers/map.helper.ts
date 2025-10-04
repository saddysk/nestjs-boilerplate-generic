export function projectMap<K, V, T>(map: ReadonlyMap<K, V>, mapper: (v: V) => T): T[] {
  const result: T[] = [];

  if (map == null) {
    return result;
  }

  map.forEach((value) => result.push(mapper(value)));
  return result;
}

export function toMap<K, V>(array: readonly V[], key: (value: V) => K): Map<K, V> {
  return array.reduce((map, value) => map.set(key(value), value), new Map<K, V>());
}

export function getMapValues<K, V>(map: ReadonlyMap<K, V>): V[] {
  return mapReduce(
    map,
    (arr, value) => {
      arr.push(value);
      return arr;
    },
    [] as V[]
  );
}

export function mapReduce<K, V, R>(
  map: ReadonlyMap<K, V>,
  reducer: (accumulator: R, currentValue: V, currentKey?: K, sourceMap?: ReadonlyMap<K, V>) => R,
  initialValue: R
): R {
  map.forEach((value, key) => {
    initialValue = reducer(initialValue, value, key, map);
  });
  return initialValue;
}

export function mapSetIf<K, T>(
  map: Map<K, T>,
  key: K,
  value: T,
  condition: (currentValue: T, newValue: T) => boolean
): void {
  const current = map.get(key);
  if (current == null) {
    map.set(key, value);
  } else if (condition(current, value)) {
    map.set(key, value);
  }
}
