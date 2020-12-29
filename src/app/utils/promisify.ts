/**
 * Helper class that executes code asynchronously.
 */
export default class Promisify {
  /**
   * Executes the given operation asynchronously (next clock tick).
   */
  static doAsync<T>(operation: (...args: any[]) => T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(operation()));
    });
  }
}
