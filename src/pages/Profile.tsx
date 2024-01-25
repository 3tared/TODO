import { ChangeEvent, useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

import useAuthenticatedQuery from '../hooks/useAuthenticatedQuery';
import Input from '../components/ui/Input';
import axiosInstance from '../config/axios.config';

const Profile = () => {
  const userKey = 'loggedInUserData';
  const userDataString = localStorage.getItem(userKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [isOpenUsername, setIsOpenUsername] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [usernameToEdit, setUsernameToEdit] = useState<string>('');
  const [queryVersion, setQueryVersion] = useState(0);

  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ['user-data', `${queryVersion}`],
    url: '/users/me',
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  // Handlers
  const onCloseUsernameModal = () => {
    setIsOpenUsername(false);
  };
  const onOpenEditModal = () => {
    setUsernameToEdit(data.username);
    setIsOpenUsername(true);
  };

  // onChange Handlers

  const onChangeEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameToEdit(e.target.value);
  };

  // Submit Handlers

  const onSubmitUsernameHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.put(
        `/users/${data.id}`,
        {
          username: usernameToEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status == 200) {
        setUsernameToEdit('');
        setQueryVersion((prev) => prev + 1);
        setIsOpenUsername(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div>you dont have data</div>;

  return (
    <div className="container flex-col md:flex-row  flex items-center justify-between space-y-6 md:space-x-4">
      <div className="border-2 max-w-xs space-y-6 p-3 text-center rounded-md  border-indigo-600 text-gray-600">
        <div className="border-b-2 border-indigo-600">
          <p className="font-semibold text-xl text-black">User ID</p>
          <p className="font-medium text-lg">{data.id}</p>
        </div>
        <div className="border-b-2 border-indigo-600">
          <p className="font-semibold text-xl text-black">Username</p>
          <p className="font-medium text-lg">{data.username}</p>
        </div>
        <div className="border-b-2 border-indigo-600">
          <p className="font-semibold text-xl text-black">Email</p>
          <p className="font-medium text-lg">{data.email}</p>
        </div>
        <div>
          <p className="font-semibold text-xl text-black">Member Since</p>
          <p className="font-medium text-lg">{data.createdAt.slice(0, 10)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onOpenEditModal}>Update Username</Button>
      </div>
      {/*Update Username Modal*/}
      <Modal
        isOpen={isOpenUsername}
        closeModal={onCloseUsernameModal}
        title="Edit Your Username"
      >
        <form className="space-y-3" onSubmit={onSubmitUsernameHandler}>
          <div className="space-y-3">
            <Input
              value={usernameToEdit}
              onChange={onChangeEditHandler}
              placeholder="Type Your New Username"
            />
            {/* {errors?.title && (
              <p className="text-red-700 font-medium ">{errors.title}</p>
            )} */}
          </div>
          <div className="flex items-center space-x-3   ">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              {isUpdating ? 'Updating' : 'Update'}
            </Button>
            <Button
              variant={'cancel'}
              onClick={onCloseUsernameModal}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
