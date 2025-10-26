export type TIngredientProps = {
  _id: string;
  name: string;
  type: "bun" | "sauce" | "main";
  price: number;
  image: string;
  image_large: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
  _uniqueId?: number;
};

export type TIngredientDetailProps = {
  ingredient?: TIngredientProps;
}