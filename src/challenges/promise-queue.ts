// Runs async tasks strictly one after another (sequential, not parallel).
// Each task is a function returning a Promise. Results are collected in order.
export async function promiseQueue<T>(
  tasks: Array<() => Promise<T>>,
): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    const result = await task(); // await here forces sequential execution
    results.push(result);
  }
  return results;
}
