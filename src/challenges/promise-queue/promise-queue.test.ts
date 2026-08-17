import { describe, it, expect } from 'vitest'
import { promiseQueue, promiseQueueSettled } from './promise-queue'

describe('promiseQueue', () => {
  it('runs tasks in order and collects results', async () => {
    const tasks = [
      () => Promise.resolve('Task 1'),
      () => Promise.resolve('Task 2'),
      () => Promise.resolve('Task 3'),
    ]
    expect(await promiseQueue(tasks)).toEqual(['Task 1', 'Task 2', 'Task 3'])
  })

  it('preserves execution order regardless of timing', async () => {
    const order: number[] = []
    const tasks = [
      () => new Promise<void>((r) => setTimeout(() => { order.push(1); r() }, 30)),
      () => new Promise<void>((r) => setTimeout(() => { order.push(2); r() }, 10)),
    ]
    await promiseQueue(tasks)
    expect(order).toEqual([1, 2]) // sequential, not by timer speed
  })
})

describe('promiseQueueSettled', () => {
  it('continues after a rejection and records every outcome', async () => {
    const tasks = [
      () => Promise.resolve('Task 1'),
      () => Promise.reject('Task 2 Error'),
      () => Promise.resolve('Task 3'),
    ]
    expect(await promiseQueueSettled(tasks)).toEqual([
      { status: 'fulfilled', value: 'Task 1' },
      { status: 'rejected', reason: 'Task 2 Error' },
      { status: 'fulfilled', value: 'Task 3' },
    ])
  })
})