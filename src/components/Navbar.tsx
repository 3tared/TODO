import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const userKey = 'loggedInUserData';
  const userDataString = localStorage.getItem(userKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const onSubmitHandler = () => {
    localStorage.removeItem(userKey);

    setTimeout(() => {
      location.reload();
    }, 1000);
  };

  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 bg-indigo-600 px-3 py-5 rounded-md">
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
          <div className="flex items-center space-x-3">
            <li>
              <NavLink
                className="text-white duration-200 font-semibold text-lg"
                to={'/profile'}
              >
                Profile
              </NavLink>
            </li>
            <span
              className="cursor-pointer text-white duration-200 font-semibold text-lg"
              onClick={onSubmitHandler}
            >
              Logout
            </span>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
