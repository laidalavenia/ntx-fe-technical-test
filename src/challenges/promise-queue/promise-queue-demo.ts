import { promiseQueue, promiseQueueSettled } from "./promise-queue";

const tasks = [
  () => Promise.resolve("Task 1"),
  () => Promise.resolve("Task 2"),
  () => Promise.resolve("Task 3"),
];
console.log("promiseQueue:", await promiseQueue(tasks));

const withError = [
  () => Promise.resolve("Task 1"),
  () => Promise.reject("Task 2 Error"),
  () => Promise.resolve("Task 3"),
];
console.log("promiseQueueSettled:", await promiseQueueSettled(withError));
