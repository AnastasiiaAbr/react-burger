import logo from './logo.svg';
import './App.css';
import { API_URL } from './utils/api';
import AppHeader from './components/app-header/app-header';
import BurgerIngredients from './components/burger-ingredients/burger-ingredients';
import { useEffect, useState } from 'react';
import BurgerConstructor from './components/burger-constructor/burger-constructor';


function App() {
   const [ingredients, setIngredients] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const [bun, setBun] = useState(null);
   const [fillings, setFillings] = useState([]);


   const handleAddIngredient = (ingredient) => {
      if (ingredient.type === 'bun') {
         setBun(ingredient);
      } else {
         setFillings((prev) => [...prev, ingredient]);
      }
   }

   const handleRemoveFillings = (indexOfRemovedItem) => {
      setFillings((prev) => prev.filter((_, index) => index !== indexOfRemovedItem));
   };


   useEffect(() => {
      fetch(API_URL)
         .then((res) => {
            if (!res.ok) {
               throw new Error('Ошибка');
            }
            return res.json();
         })
         .then((data) => {
            if (data.success) {
               setIngredients(data.data);
            } else {
               throw new Error('Ошибка');
            }
         })
         .catch((err) => {
            console.error('Ошибка:', err)
            setError(err.message);
         })
         .finally(() => {
            setLoading(false);
         })
   }, []);

   if (loading) {
      return <p>Загрузка...</p>
   }


   return (
      <>
         <header>
            <AppHeader className='wrapper'/>
         </header>
         <main className='wrapper'>
            <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

            <section className='content'>
               <BurgerIngredients
                  ingredients={ingredients}
                  bun={bun}
                  fillings={fillings}
                  onAddIngredient={handleAddIngredient}
               />
               <BurgerConstructor
                  bun={bun}
                  fillings={fillings}
                  onRemoveIngredient={handleRemoveFillings}
               />
            </section>
         </main>
      </>
   );
}

export default App;
