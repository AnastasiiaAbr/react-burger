import styles from './home.module.css';
import BurgerConstructor from '../../components/burger-constructor/burger-constructor';
import BurgerIngredients from '../../components/burger-ingredients/burger-ingredients';
import useMediaQuery from '../../hooks/useMedia';

function Home(): React.JSX.Element {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <main className={styles.wrapper}>
      {isMobile ? (
        <div className={styles.mobileContent}>
          <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
          <BurgerIngredients />
        </div>
      ) : (
        <>
          <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

          <section className={styles.content}>
            <BurgerIngredients />
            <BurgerConstructor />
          </section>
        </>
      )}
    </main>
  );
}

export default Home;