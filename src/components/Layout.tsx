import React, {
    //useState
} from 'react';
import { Flex, Layout, Menu } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import {
  Link,
  Outlet,
  useFetcher,
  useRouteLoaderData,
    useLoaderData,
    useNavigate,
    //useRevalidator,
} from "react-router-dom";
import { fakeAuthProvider } from "./../auth";


const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  //backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  //lineHeight: '120px',
  //color: '#fff',
  //backgroundColor: '#0958d9',
};

//const siderStyle: React.CSSProperties = {
  //textAlign: 'center',
  //lineHeight: '120px',
  //color: '#fff',
  //backgroundColor: '#1677ff',
//};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const layoutStyle = {
  //borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
};

//const items = new Array(15).fill(null).map((_, index) => ({
  //key: index + 1,
  //label: `nav ${index + 1}`,
//}));

//const items = [
    //{
        //key: 1,
        //label: (
            //<a href="/login" title="Login">
                //<PoweroffOutlined />
            //</a>
        //),
    //},
//];


    //useLoaderData/useRouteLoaderData
export default function MainLayout() {
    let { user } = useRouteLoaderData("root") as { user: string | null };
    console.log('MainLayout user', user);
    //const [username, setUsername] = useState('')
    //let user = useRouteLoaderData("root") as string ;
    //let { user } = useRouteLoaderData("root") as { user: string | null };
    //const {user} = useLoaderData() as { user: string | null };
    //if (user) {
        //setUsername(user)
    //}
    //const revalidator = useRevalidator();
    //const callback = () => revalidator.revalidate();

    return (
        <div>
        {/*
        //<Flex gap="middle" wrap>
            //<Layout style={layoutStyle}>

                //<Header style={headerStyle}>
            */}
                    <HeaderMenu />
        {/*
        //</Header> 

                <Content style={contentStyle}>
          */}
                    <div>
                        <h1>Auth Example using RouterProvider</h1>

                        <AuthStatus />

                        <Outlet />

                    </div>
        {/*
                </Content>
          */}

                <Footer style={footerStyle}>Footer</Footer>
        {/*
            //</Layout>
        //</Flex>
          */}
        </div>
    );
}

function HeaderMenu() {
    const navigate = useNavigate();

    let { user } = useRouteLoaderData("root") as { user: string | null };
    //let {user} = useLoaderData() as { user: string | null };

    const logout = async () => {
        await fakeAuthProvider.signout();
        navigate("/");
    };


    const getMenuItems = (user: string | null) => {
        console.log('user', user);
        let items = [
            {
                key: 1,
                label: (
                    <Link to="/login">
                        <PoweroffOutlined />
                    </Link>
                ),
            },
        ];

        if (user) {
            items = [
                {
                    key: 1,
                    label: (
                        <Link to="/">
                            Public page
                        </Link>
                    ),
                },
                {
                    key: 2,
                    label: (
                        <Link to="/protected">
                            Protected page
                        </Link>
                    ),
                },
                {
                    key: 3,
                    label: (
                        <Link to="#" onClick={logout}>
                            Logout
                        </Link>
                    ),
                },
            ];
        }
        return items;
    };


    return (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={getMenuItems(user)}
            style={{ flex: 1, minWidth: 0 }}
            />
    );
}

function AuthStatus() {
  // Get our logged in user, if they exist, from the root route loader data
  let { user } = useRouteLoaderData("root") as { user: string | null };
  let fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}
