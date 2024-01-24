import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { IAddTodo, ITodo } from '../data';
import Textarea from './ui/Textarea';
import { TodoSchema } from '../validation';
import TodoSkeleton from './TodoSkeleton';

import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';
import { useState } from 'react';

import axiosInstance from '../config/axios.config';
import { faker } from '@faker-js/faker';
import toast from 'react-hot-toast';

const userKey = 'loggedInUserData';
const userDataString = localStorage.getItem(userKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const defaultTodoObj = {
  id: 0,
  title: '',
  description: '',
};

const defaultAddTodoObj = {
  title: '',
  description: '',
};

const defaultErrorsObj = {
  title: '',
  description: '',
};
const TodoList = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodoObj);
  const [todoToAdd, setTodoToAdd] = useState<IAddTodo>(defaultAddTodoObj);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState(defaultErrorsObj);
  const [queryKey, setQueryKey] = useState(1);

  // Handlers

  //Edit Hanlder
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setErrors(defaultErrorsObj);
    setIsOpen(true);
  };
  const onCloseEditModal = () => {
    setErrors(defaultErrorsObj);
    setTodoToEdit(defaultTodoObj);
    setIsOpen(false);
  };
  // Edit onChange
  const onChangeEditHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };
  // Edit Submit
  const onSubmitEditHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { id, title, description } = todoToEdit;
    try {
      const errors = TodoSchema({
        title,
        description,
      });

      const detectErrMsg =
        Object.values(errors).some((value) => value === '') &&
        Object.values(errors).every((value) => value === '');

      if (!detectErrMsg) {
        setErrors(errors);
        return;
      }

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
        toast.success('Edit Successfully!');
        setQueryKey((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  //Remove Hanlder
  const onOpenRemoveModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsRemoveOpen(true);
  };
  const onCloseReomveModal = () => {
    setTodoToEdit(defaultTodoObj);
    setIsRemoveOpen(false);
  };
  // Remove Submit
  const onRemoveHandler = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        setQueryKey((prev) => prev + 1);
        onCloseReomveModal();
        toast.success('Deleted Successfully!');
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Add Hanlder
  const onOpenAddModal = () => {
    setIsAddOpen(true);
  };
  const onCloseAddModal = () => {
    setTodoToAdd(defaultAddTodoObj);
    setIsAddOpen(false);
  };
  // Add onChange
  const onChangeAddHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };
  // Add Submit
  const onSubmitAddHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToAdd;
    try {
      const errors = TodoSchema({
        title,
        description,
      });

      const detectErrMsg =
        Object.values(errors).some((value) => value === '') &&
        Object.values(errors).every((value) => value === '');

      if (!detectErrMsg) {
        setErrors(errors);
        return;
      }

      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData.user.id] } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseAddModal();
        toast.success('Adding Successfully!');
        setQueryKey((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate Handler
  const onGenerateTodo = async () => {
    try {
      for (let i = 0; i < 100; i++) {
        await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.lorem.words(5),
              description: faker.lorem.paragraph(2),
              user: [userData.user.id],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetching Data By Using React Query [by Our Custom Hook]
  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ['todoList', `${queryKey}`],
    url: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading)
    return (
      <div>
        <div role="status" className="p-3 space-y-2   animate-pulse mb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-[110px] h-3 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-700 w-[127.88px]"></div>
              <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-700 w-[125.08px]"></div>
            </div>
          </div>
        </div>

        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

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
    <div className="space-y-1 mb-5">
      <div className="flex items-center justify-between mb-16">
        <p className="text-[23px] font-semibold ">
          Your <span className="text-indigo-700 ml-[-5px]">Todos</span>
        </p>
        <div className="flex items center space-x-1">
          <Button size={'sm'} onClick={onOpenAddModal}>
            Add New ToDo
          </Button>
          <Button size={'sm'} variant={'outline'} onClick={onGenerateTodo}>
            Generate Todo
          </Button>
        </div>
      </div>

      {data.todos[0] ? renderTodosList : <h3>You Don't Have Todos Yet!</h3>}
      {/*Add Modal*/}
      <Modal
        isOpen={isAddOpen}
        closeModal={onCloseAddModal}
        title="Add New Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitAddHandler}>
          <div className="space-y-3">
            <Input
              value={todoToAdd.title}
              onChange={onChangeAddHandler}
              name="title"
              placeholder="Type Your Todo Title"
            />
            {errors?.title && (
              <p className="text-red-700 font-medium ">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Textarea
              value={todoToAdd.description}
              onChange={onChangeAddHandler}
              name="description"
              placeholder="Type Your Todo Description"
            />
            {errors?.description && (
              <p className="text-red-700 font-medium">{errors.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3   ">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              {isUpdating ? 'Adding' : 'Add'}
            </Button>
            <Button variant={'cancel'} onClick={onCloseAddModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/*Edit Modal*/}
      <Modal
        isOpen={isOpen}
        closeModal={onCloseEditModal}
        title="Edit The Current Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitEditHandler}>
          <div className="space-y-3">
            <Input
              value={todoToEdit.title}
              onChange={onChangeEditHandler}
              name="title"
              placeholder="Type Your Todo Title"
            />
            {errors?.title && (
              <p className="text-red-700 font-medium ">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Textarea
              value={todoToEdit.description}
              onChange={onChangeEditHandler}
              name="description"
              placeholder="Type Your Todo Description"
            />
            {errors?.description && (
              <p className="text-red-700 font-medium">{errors.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3   ">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              {isUpdating ? 'Updating' : 'Update'}
            </Button>
            <Button variant={'cancel'} onClick={onCloseEditModal} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/*Remove Modal*/}
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
          <Button variant={'cancel'} onClick={onCloseReomveModal} type="button">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
