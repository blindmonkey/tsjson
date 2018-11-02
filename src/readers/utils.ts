export function nullMap<T, OUT>(value: T|null, mapf: (val: T) => OUT): OUT|null {
  if (value != null) {
    return mapf(value);
  }
  return null;
}