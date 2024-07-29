import { NextPage } from 'next';
import TodoList from '../app/components/TodoList';
import styles from './page.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.body}>
      <div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </div>
      <TodoList />
    </div>
  );
};

export default Home;
