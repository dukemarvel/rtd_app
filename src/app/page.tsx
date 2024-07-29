import { NextPage } from 'next';
import TodoList from '../app/components/TodoList';

const Home: NextPage = () => {
  return (
    <div>
      <TodoList />
    </div>
  );
};

export default Home;
