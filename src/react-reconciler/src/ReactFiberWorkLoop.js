import { now } from './SchedulerWithReactIntegration'

let executionContext = NoContext;
let workInProgressRootRenderTargetTime = Infinity

function resetRenderTimer() {
  workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}

export function requestEventTime() {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    // We're inside React, so it's fine to read the actual time.
    return now();
  }
  // We're not inside React, so we may be in the middle of a browser event.
  if (currentEventTime !== NoTimestamp) {
    // Use the same start time for all updates until we enter React again.
    return currentEventTime;
  }
  // react 生成后的第一次更新，计算一个新的起始时间
  currentEventTime = now();
  return currentEventTime;
}

export function unbatchedUpdates (fn, a) {
  const prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;

  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // 刷新批处理时计划的立即回调
      resetRenderTimer();
      flushSyncCallbackQueue();
    }
  }
}