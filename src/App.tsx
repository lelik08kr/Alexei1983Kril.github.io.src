import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { ApiAuthProvider } from "./auth";
import Layout from './components/Layout';
import loginAction from './actions/login';
import loginLoader from './loaders/login';
import protectedLoader from './loaders/protected';
import Error404 from './pages/Error404';
import LoginPage from './pages/Login';
import PublicPage from './pages/Public';
import ProtectedPage from './pages/Protected';

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        loader() {
            // Our root route always provides the user, if logged in
            return { user: ApiAuthProvider.username };
        },
        Component: Layout,
        children: [
            {
                index: true,
                Component: PublicPage,
            },
            {
                path: "login",
                action: loginAction,
                loader: loginLoader,
                Component: LoginPage,
            },
            {
                path: "protected",
                loader: protectedLoader,
                Component: ProtectedPage,
            },
        ],
        errorElement: <Error404 />,
    },
    {
        path: "/logout",
        async action() {
            // We signout in a "resource route" that we can hit from a fetcher.Form
            await ApiAuthProvider.signout();
            return redirect("/");
        },
    },
]);

export default function App() {
    return (
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    );
}
