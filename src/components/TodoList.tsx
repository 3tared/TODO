import Button from './ui/Button';

import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';
import Modal from './ui/Modal';
import { useState } from 'react';
import Input from './ui/Input';
import { ITodo } from '../data';
import Textarea from './ui/Textarea';
import axiosInstance from '../config/axios.config';

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
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodoObj);
  const [isUpdating, setIsUpdating] = useState(false);
  // Handlers
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpen(true);
  };
  const onCloseEditModal = () => {
    setTodoToEdit(defaultTodoObj);
    setIsOpen(false);
  };

  const onOpenRemoveModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsRemoveOpen(true);
  };
  const onCloseReomveModal = () => {
    setTodoToEdit(defaultTodoObj);
    setIsRemoveOpen(false);
  };

  const onRemoveHandler = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        onCloseReomveModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { id, title, description } = todoToEdit;
    try {
      const { status } = await axiosInstance.put(
        `/todos/${id}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseEditModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetching Data By Using React Query [by Our Custom Hook]
  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ['todoList', `${todoToEdit.id}`],
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
        <Button
          variant={'danger'}
          size={'sm'}
          onClick={() => onOpenRemoveModal(todo)}
        >
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
        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <Input
            value={todoToEdit.title}
            onChange={onChangeHandler}
            name="title"
          />
          <Textarea
            value={todoToEdit.description}
            onChange={onChangeHandler}
            name="description"
          />
          <div className="flex items-center space-x-3 mt-4 ">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              {isUpdating ? 'Updating' : 'Update'}
            </Button>
            <Button variant={'cancel'} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Attention! Are you sure you want to remove this Todo from your Todos?"
        isOpen={isRemoveOpen}
        closeModal={onCloseReomveModal}
        description="Deleting this Todo will remove it permanently from your Todos. Any associated data, ,and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-4 ">
          <Button variant={'danger'} onClick={onRemoveHandler}>
            Yes , Remove
          </Button>
          <Button variant={'cancel'} onClick={onCloseReomveModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
