import reducer, { setIngredient, clearIngredient, initialState } from "./ingredient-details-slice";

describe('ingredient details slice', () => {
  const item = {
    _id: 'id1',
    name: 'Космическая булка',
    type: 'bun',
    price: 100,
    image: 'img1',
    image_large: 'img2',
    calories: 100,
    proteins: 1,
    fat: 20,
    carbohydrates: 10,
    _uniqueId: 'id2'
  };
  
  test('initialState', () => {
    expect(reducer(undefined, { item: undefined})).toEqual(initialState);
  });

  test('setIngredient добавляет ингредиент', () => {
    const state = reducer(initialState, setIngredient(item));
    expect(state.item).toEqual(item);
  });

  test('clearIngredient очищает ингредиент', () => {
    const start = {item};

    const state = reducer(start, clearIngredient());

    expect(state.item).toBeNull();
  })
})
