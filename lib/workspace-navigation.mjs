export function navigateWorkspace(state, action) {
  if (action.type === 'open') {
    if (state.current === action.panel) return state;
    return {current: action.panel, history: state.current ? [...state.history, state.current] : state.history};
  }
  if (action.type === 'back') {
    return {current: state.history.at(-1) ?? null, history: state.history.slice(0, -1)};
  }
  if (action.type === 'home' || action.type === 'close') return {current: null, history: []};
  return state;
}
