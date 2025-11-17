import { TIngredientProps } from "./ingredient-types";

export type TOrder = {
  number: number;
  name: string;
  status: 'created' | 'pending' | 'done';
  createdAt: string;
  ingredients: TIngredientProps[];
  _id?: number;
};

export type TOrderProps = {
  order: TOrder;
  onClick?: () => void;
  showStatus: boolean;
}