import reducer, {
  setBun,
  addFilling,
  removeFilling,
  clearConstructor,
  moveFilling,
  selectConstructorBun,
  selectConstructorFillings,
  initialState
} from "./constructor-slice";

jest.mock("@reduxjs/toolkit", () => {
  const original = jest.requireActual("@reduxjs/toolkit");
  return {
    ...original,
    nanoid: () => "test-id",
  };
});

describe("constructor slice", () => {
  const bun = {
    _id: "bun1",
    name: "Булка",
    type: "bun",
    price: 100,
    image: "img",
    image_large: "img2",
    image_mobile: "img3"
  };

  const ingredient1 = {
    _id: "main1",
    name: "Котлета",
    type: "main",
    price: 200,
    image: "img",
    image_large: "img2",
    image_mobile: "img3"
  };

  const ingredient2 = {
    _id: "sauce1",
    name: "Соус",
    type: "sauce",
    price: 50,
    image: "img",
    image_large: "img2",
    image_mobile: "img3"
  };

  test("initial state", () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("setBun добавляет булку", () => {
    const state = reducer(initialState, setBun(bun));
    expect(state.bun).toEqual(bun);
  });

  test("addFilling добавляет ингредиент с _uniqueId", () => {
    const state = reducer(initialState, addFilling(ingredient1));

    expect(state.fillings.length).toBe(1);
    expect(state.fillings[0]).toEqual({
      ...ingredient1,
      _uniqueId: "test-id"
    });
  });

  test("removeFilling — удаляет по _uniqueId", () => {
    const start = {
      bun: null,
      fillings: [
        { ...ingredient1, _uniqueId: "id1" },
        { ...ingredient2, _uniqueId: "id2" },
      ]
    };

    const state = reducer(start, removeFilling("id1"));

    expect(state.fillings).toEqual([{ ...ingredient2, _uniqueId: "id2" }]);
  });

  test("clearConstructor очищает состояние", () => {
    const start = {
      bun,
      fillings: [{ ...ingredient1, _uniqueId: "id1" }]
    };

    const state = reducer(start, clearConstructor());

    expect(state).toEqual({
      bun: null,
      fillings: []
    });
  });

  test("moveFilling — перемещает ингредиенты", () => {
    const start = {
      bun: null,
      fillings: [
        { ...ingredient1, _uniqueId: "id1" },
        { ...ingredient2, _uniqueId: "id2" } 
      ]
    };

    const state = reducer(
      start,
      moveFilling({ sourceIndex: 0, targetIndex: 1 })
    );

    expect(state.fillings).toEqual([
      { ...ingredient2, _uniqueId: "id2" },
      { ...ingredient1, _uniqueId: "id1" }
    ]);
  });

  test("selectConstructorBun выбирает булку", () => {
    const state = {
      burgerConstructor: {
        bun,
        fillings: []
      }
    };

    expect(selectConstructorBun(state)).toEqual(bun);
  });

  test("selectConstructorFillings выбирает все ингредиенты", () => {
    const fillings = [
      { ...ingredient1, _uniqueId: "id1" },
      { ...ingredient2, _uniqueId: "id2" }
    ];

    const state = {
      burgerConstructor: {
        bun: null,
        fillings
      }
    };

    expect(selectConstructorFillings(state)).toEqual(fillings);
  });
});
