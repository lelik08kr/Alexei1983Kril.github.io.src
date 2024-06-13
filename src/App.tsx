import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { ApiAuthProvider } from "./providers/Auth";
import Layout from './components/Layout';
import loginAction from './actions/login';
import loginLoader from './loaders/login';
import protectedLoader from './loaders/protected';
import Error404 from './pages/Error404';
import LoginPage from './pages/Login';
import PublicPage from './pages/Public';
import ProtectedPage from './pages/Protected';


type RouterConfigVars = {};

type RouterConfig = {
    basename: string,
    vars: RouterConfigVars,
};

const routerCreator = (routerConfig: RouterConfig): any => {
    return createBrowserRouter([
        {
            id: "root",
            path: "/",
            async loader() {
                // Our root route always provides the user, if logged in
                ApiAuthProvider.init();
                if (await ApiAuthProvider.isAuthenticated()) {
                    return { user: ApiAuthProvider.username };
                } else {
                    return {};
                }
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
                    element: <ProtectedPage />,
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
    ],{
        basename: routerConfig.basename,
    });
};

let routerBasename = '/';

export default function App() {
    const routerConfig: RouterConfig = {
        basename: routerBasename,
        vars: {
        },
    };

    return (
        <RouterProvider router={routerCreator(routerConfig)} fallbackElement={<p>Initial Load...</p>} />
    );
}
