import Main from "./components/main/main";
import Login from "./components/login/login";

const AppRoutes = [
  {
    index: true,
    element: <Main />
  },
  {
    path: '/login',
    element: <Login />
  }
];

export default AppRoutes;
