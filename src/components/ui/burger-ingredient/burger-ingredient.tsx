import React, { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id } = ingredient;
    const location = useLocation();

    return (
      <li className={styles.container} data-testid='ingredient-item'>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={{ background: location }}
        >
          {count ? <Counter count={count} /> : null}
          <img className={styles.img} src={image} alt='.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <AddButton
          text=''
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
          data-testid='add-ingredient-button'
        />
      </li>
    );
  }
);
