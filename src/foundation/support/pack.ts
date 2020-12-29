export default function pack<T extends object>(service: T): T {
  return Object.create(service);
}
