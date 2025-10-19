import styles from './home.module.css';
import BurgerConstructor from '../../components/burger-constructor/burger-constructor';
import BurgerIngredients from '../../components/burger-ingredients/burger-ingredients';

function Home() {
  return (
    <main className={styles.wrapper}>
            <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

        <section className={styles.content}>
          <BurgerIngredients />
          <BurgerConstructor />
        </section>
      </main>
  );
}

export default Home;