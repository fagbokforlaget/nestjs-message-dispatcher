export abstract class AsyncLoggerProvider {
  abstract log(subject: string, data: Record<string, unknown>): Promise<void>;
}
