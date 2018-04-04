export function unreachable<T>(message: T|null): never {
  let msg = 'FATAL ERROR (UNREACHABLE)' + (message && (': ' + message) || '');
  throw Error(msg);
}