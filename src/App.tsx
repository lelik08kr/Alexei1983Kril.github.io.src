import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import MainLayout from './components/Layout';
import { loginActionRequest } from './hooks/loginAction';
import { loginLoader } from './hooks/loginLoader';
import { protectedLoader } from './hooks/protectedLoader';
import LoginPage from './pages/Login';
import PublicPage from './pages/Public';
import ProtectedPage from './pages/Protected';

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader(request) {
      // Our root route always provides the user, if logged in
        console.log('MainLayout loader', request, fakeAuthProvider.username);
        return { user: fakeAuthProvider.username };
    },
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: PublicPage,
      },
      {
        path: "login",
        action: loginActionRequest,
        loader: loginLoader,
        Component: LoginPage,
      },
      {
        path: "protected",
        loader: protectedLoader,
        Component: ProtectedPage,
      },
    ],
    action(params) {
        console.log('MainLayout action', params)
        return { user: fakeAuthProvider.username };
    },
  },
  {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await fakeAuthProvider.signout();
      return redirect("/");
    },
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}
