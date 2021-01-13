import ReactCurrentDispatcher from './ReactCurrentDispatcher'

function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return dispatcher;
}

export function useState (initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}