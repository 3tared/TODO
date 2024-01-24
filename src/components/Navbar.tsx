import { NavLink } from 'react-router-dom';
import Button from './ui/Button';

const Navbar = () => {
  const userKey = 'loggedInUserData';
  const userDataString = localStorage.getItem(userKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const onSubmitHandler = () => {
    localStorage.removeItem(userKey);

    setTimeout(() => {
      location.replace('/');
    }, 1000);
  };

  return (
    <nav className="mx-3 max-w-3xl md:max-w-4xl md:mx-auto mt-7 mb-20 bg-indigo-600 px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-white duration-200 font-semibold text-lg">
          <NavLink to="/">Home</NavLink>
        </li>

        {!userData ? (
          <p className="flex items-center space-x-3">
            <li className="text-white duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-white duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        ) : (
          <div className="flex items-center space-x-4">
            <li>
              <NavLink
                className="text-white duration-200 font-semibold text-lg"
                to={'/todos'}
              >
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink
                className="text-white duration-200 font-semibold text-lg"
                to={'/profile'}
              >
                Profile
              </NavLink>
            </li>
            <Button
              className=" text-black duration-200 font-semibold text-lg bg-white py-1"
              onClick={onSubmitHandler}
            >
              Logout
            </Button>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
