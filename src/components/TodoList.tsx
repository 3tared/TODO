import Button from './ui/Button';

import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';
import Modal from './ui/Modal';
import { useState } from 'react';
import Input from './ui/Input';
import { ITodo } from '../data';
import Textarea from './ui/Textarea';

const userKey = 'loggedInUserData';
const userDataString = localStorage.getItem(userKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const defaultTodoObj = {
  id: 0,
  title: '',
  description: '',
};

const TodoList = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodoObj);

  // Handlers
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpen(true);
  };
  const onCloseEditModal = () => {
    setTodoToEdit(defaultTodoObj);
    setIsOpen(false);
  };

  // Fetching Data By Using React Query [by Our Custom Hook]
  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ['todos'],
    url: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading) return 'Loading...';

  //Renders
  const renderTodosList = data.todos.map((todo: ITodo, idx: number) => (
    <div
      key={todo.id}
      className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
    >
      <p className="w-full font-semibold">
        {idx + 1} - {todo.title}
      </p>
      <div className="flex items-center justify-end w-full space-x-3">
        <Button size={'sm'} onClick={() => onOpenEditModal(todo)}>
          Edit
        </Button>
        <Button variant={'danger'} size={'sm'}>
          Remove
        </Button>
      </div>
    </div>
  ));

  return (
    <div className="space-y-1 ">
      {data.todos[0] ? renderTodosList : <h3>You Don't Have Todos Yet!</h3>}
      <Modal
        isOpen={isOpen}
        closeModal={onCloseEditModal}
        title="Edit The Current Todo"
      >
        <div className="space-y-4">
          <Input value={todoToEdit.title} />
          <Textarea
            // value={todoToEdit.description}
            defaultValue={todoToEdit.description}
          />

          <div className="flex items-center space-x-3 mt-4 ">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              Update
            </Button>
            <Button variant={'cancel'} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
