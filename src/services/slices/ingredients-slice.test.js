import reducer, {fetchIngredients, selectIngredient, selectIngredientError, selectIngredientLoading} from './ingredients-slice';

import { request } from '../../utils/request';

jest.mock('../../utils/request', () => ({
  request: jest.fn()
}));

describe('ingredients slice', () => {
  const initialState = {
  items: [],
  loading: false,
  error: null,
};

describe('ingredients reducer', () => {
  test('pending устанавливает соединение' , () => {
    const state = reducer(initialState,{ type: fetchIngredients.pending.type});

    expect(state).toEqual({
      items: [],
      loading: true,
      error: null
    });
  });

  test('fulfilled', () => {
    const payload = [{ _id: '1', name: 'Ingredient'}];

    const state = reducer(initialState, { type: fetchIngredients.fulfilled.type, payload});

    expect(state).toEqual({
      items: payload,
      loading: false,
      error: null,
    });
  });

  test('rejected выдает ошибку', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: 'Error message'
    });

    expect(state).toEqual({
      items: [],
      loading: false,
      error: 'Error message'
    });
  });
});

describe('fetchIngredients thunk', () => {
  test('success', async () => {
    const mockedResponse = {
      success: true,
      data: [{ _id: '1', name: 'Ingredient'}]
    };

    (request).mockResolvedValueOnce(mockedResponse);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const result = await fetchIngredients()(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({type: fetchIngredients.pending.type})
    );

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchIngredients.fulfilled.type,
        payload: mockedResponse.data
      })
    );

    expect(result.type).toBe(fetchIngredients.fulfilled.type);
    expect(result.payload).toEqual(mockedResponse.data);
  });

  test('error', async () => {
    request.mockRejectedValueOnce(new Error('Network fail'));

    const dispatch = jest.fn();
    const getState = jest.fn();

    const result = await fetchIngredients()(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({type: fetchIngredients.pending.type})
    );

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchIngredients.rejected.type,
        payload: 'Network fail'
      })
    );

    expect(result.type).toBe(fetchIngredients.rejected.type);
    expect(result.payload).toBe('Network fail');
  });
});

describe('selectors', () => {
  const mockState = {
    ingredients: {
      items: [{_id: '1'}],
      loading: true,
      error: 'err',
    }
  };

  test('selectIngredient', () => {
    expect(selectIngredient(mockState)).toEqual([{_id: '1'}]);
  });

  test('selectIngredientLoading', () => {
    expect(selectIngredientLoading(mockState)).toBe(true);
  });

  test('selectIngredientsError', () => {
    expect(selectIngredientError(mockState)).toBe('err');
  });
});

});
