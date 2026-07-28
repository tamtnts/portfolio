export class CleanupTimeoutError extends Error {
  constructor(timeoutMs) {
    super(`Cleanup timed out after ${timeoutMs}ms.`);
    this.name = 'CleanupTimeoutError';
  }
}

export async function withCleanup(operation, cleanup, { timeoutMs = 5000 } = {}) {
  let result;
  let operationError;
  try {
    result = await operation();
  } catch (error) {
    operationError = error;
  }

  let cleanupError;
  let timer;
  try {
    await Promise.race([
      cleanup(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new CleanupTimeoutError(timeoutMs)), timeoutMs);
      }),
    ]);
  } catch (error) {
    cleanupError = error;
  } finally {
    clearTimeout(timer);
  }

  if (operationError) throw operationError;
  if (cleanupError) throw cleanupError;
  return result;
}
