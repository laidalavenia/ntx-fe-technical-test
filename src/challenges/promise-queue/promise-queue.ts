// BAB 01: Promise Queue
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

// BAB 02: Review AI Output
type SettledResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: unknown };

// Resilient version: a failing task no longer stops the queue.
// Every task's outcome is recorded, and all results are returned.
export async function promiseQueueSettled<T>(
  tasks: Array<() => Promise<T>>,
): Promise<SettledResult<T>[]> {
  const results: SettledResult<T>[] = [];
  for (const task of tasks) {
    try {
      const value = await task();
      results.push({ status: "fulfilled", value });
    } catch (reason) {
      results.push({ status: "rejected", reason }); // log & continue
    }
  }
  return results;
}
