import PropTypes from 'prop-types';

export const ingredientPropType = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_large: PropTypes.string,
  calories: PropTypes.number,
  proteins: PropTypes.number,
  fat: PropTypes.number,
  carbohydrates: PropTypes.number,
});