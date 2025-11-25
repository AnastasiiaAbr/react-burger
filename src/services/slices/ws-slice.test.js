import { createWsSlice, initialState } from "./ws-slice";

describe('createWsSlice', () => {
test('works for feedOrderSlice', () => {
  const {slice, actions} = createWsSlice('feedOrders');
  const reducer = slice.reducer;

  expect(reducer(initialState, actions.onConnecting())).toEqual({
    ...initialState,
    loading: true,
  });
});

test('actions have correct names', () => {
  const { actions } = createWsSlice('profileOrders');

  expect(actions.onOpen.type).toBe('profileOrders/onOpen');
  expect(actions.onMessage.type).toBe('profileOrders/onMessage');
});
});