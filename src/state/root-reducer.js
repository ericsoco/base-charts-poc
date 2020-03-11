// @flow
import { type State } from './';
import { type Action } from 'redux';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

export default function rootReducer(state: State, action: Action<*>): State {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        root: state.root + 1,
      };
    case DECREMENT:
      return {
        ...state,
        root: state.root - 1,
      };
    default:
      return state;
  }
}
