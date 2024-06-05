import {
    Link,
    Outlet,
    useNavigate,
    useRouteLoaderData,
} from "react-router-dom";
import { fakeAuthProvider } from "./../auth";
import { Flex, Layout as AntLayout, Menu } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const { Header, Footer, Content } = AntLayout;

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

export default function Layout() {
  return (
    <Flex gap="middle" wrap>
        <AntLayout style={layoutStyle}>
            <Header style={headerStyle}>
                <HeaderMenu />
            </Header> 

            <Content style={contentStyle}>
                <div>
                    <h1>React RouterProvider boilerplate</h1>

                    <Outlet />
                </div>
            </Content>

            <Footer style={footerStyle}>Footer</Footer>
        </AntLayout>
    </Flex>
  );
}

function HeaderMenu() {
    const navigate = useNavigate();
    // @TODO:  <05-06-24, Evgeniy Blinov <evgeniy_blinov@mail.ru>> : Check logout redirect
    const logout = async () => {
        await fakeAuthProvider.signout();
        navigate("/");
    };

    let { user } = useRouteLoaderData("root") as { user: string | null };

    const getMenuItems = (user: string | null) => {
        let items: MenuItem[] = [
            {
                key: 1,
                label: (
                    <Link to="/login">
                        {/*
                        <PoweroffOutlined />
                        */}
                        Sign in
                    </Link>
                ),
            },
            {
                key: 2,
                disabled: true,
                label: (
                    <Link to="#">
                        {/*
                    <Link to="/register">
                        <PoweroffOutlined />
                        */}
                        Sign up
                    </Link>
                ),
            },
        ];

        if (user) {
            items = [
                {
                    key: 0,
                    disabled: true,
                    label: (
                        <Link to="#">
                            {user}
                        </Link>
                    ),
                },
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
                        <Link to="/logout" onClick={logout} >
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
