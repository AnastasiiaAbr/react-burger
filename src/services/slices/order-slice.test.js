import { request } from '../../utils/request';
import reducer, {
  createOrder,
  clearOrder,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
  initialState
} from './order-slice';

jest.mock('../../utils/request', () => ({
  request: jest.fn()
}));

describe('order slice', () => {
  describe('order reducer', () => {
    test('pending', () => {
      const state = reducer(initialState, { type: createOrder.pending.type });

      expect(state).toEqual({
        currentOrder: null,
        loading: true,
        error: null,
      });
    });

    test('fulfilled', () => {
      const payload = { number: 1 };

      const state = reducer(initialState, {
        type: createOrder.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        currentOrder: payload,
        loading: false,
        error: null,
      });
    });

    test('rejected', () => {
      const state = reducer(initialState, {
        type: createOrder.rejected.type,
        payload: 'Error message'
      });

      expect(state).toEqual({
        currentOrder: null,
        loading: false,
        error: 'Error message'
      });
    });

    test('clearOrder', () => {
      const state = reducer({
        currentOrder: { number: 1 },
        loading: true,
        error: 'some error',
      }, clearOrder());

      expect(state).toEqual({
        currentOrder: null,
        loading: false,
        error: null,
      });
    });
  });


  describe('createOrder thunk', () => {

    test('success request', async () => {
      localStorage.setItem('accessToken', 'Bearer token1');

      const mockedResponse = {
        success: true,
        order: { number: 12345 }
      };

      request.mockResolvedValueOnce(mockedResponse);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await createOrder(['123', '456'])(
        dispatch,
        getState,
        undefined
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: createOrder.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: createOrder.fulfilled.type,
          payload: { number: 12345 }
        })
      );

      expect(result.type).toBe(createOrder.fulfilled.type);
      expect(result.payload).toEqual({ number: 12345 });
    });

    test('error: no accessToken', async () => {
      localStorage.removeItem('accessToken');

      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await createOrder(['1'])(
        dispatch,
        getState,
        undefined
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: createOrder.pending.type })
      );


      expect(result.type).toBe(createOrder.rejected.type);
      expect(result.error.message).toBe('Отсутствует accessToken');
    });

    test('request error', async () => {
      localStorage.setItem('accessToken', 'Bearer token123');

      request.mockRejectedValueOnce(new Error('Network fail'));

      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await createOrder(['1'])(
        dispatch,
        getState,
        undefined
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: createOrder.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: createOrder.rejected.type,
          payload: 'Network fail'
        })
      );

      expect(result.type).toBe(createOrder.rejected.type);
      expect(result.payload).toBe('Network fail');
    });
  });


  describe('selectors', () => {
    const state = {
      orders: {
        currentOrder: { number: 100 },
        loading: true,
        error: 'err'
      }
    };

    test('selectCurrentOrder', () => {
      expect(selectCurrentOrder(state)).toEqual({ number: 100 });
    });

    test('selectOrderLoading', () => {
      expect(selectOrderLoading(state)).toBe(true);
    });

    test('selectOrderError', () => {
      expect(selectOrderError(state)).toBe('err');
    });
  });
});
