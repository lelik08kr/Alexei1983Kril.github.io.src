import {
  //Form,
  useActionData,
  useLocation,
  useNavigation,
    //useNavigate,
    useSubmit,
} from "react-router-dom";
import { fakeAuthProvider } from "./../auth";


//export default function LoginPage() {
  //let location = useLocation();
  //let params = new URLSearchParams(location.search);
  //let from = params.get("from") || "/";

  //let navigation = useNavigation();
  //let isLoggingIn = navigation.formData?.get("username") != null;

  //let actionData = useActionData() as { error: string } | undefined;

  //return (
    //<div>
      //<p>You must log in to view the page at {from}</p>

      //<Form method="post" replace>
        //<input type="hidden" name="redirectTo" value={from} />
        //<label>
          //Username: <input name="username" />
        //</label>{" "}
        //<button type="submit" disabled={isLoggingIn}>
          //{isLoggingIn ? "Logging in..." : "Login"}
        //</button>
        //{actionData && actionData.error ? (
          //<p style={{ color: "red" }}>{actionData.error}</p>
        //) : null}
      //</Form>
    //</div>
  //);
//}


import React from 'react';
import type { FormProps } from 'antd';
import {
    Button,
    Checkbox,
    Form,
    Input
} from 'antd';

import { loginActionValues } from './../hooks/loginAction';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  forgotpass?: string;
  redirectTo?: string;
};


const LoginPage: React.FC = () => {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let from = params.get("from") || "/";

    let navigation = useNavigation();
    let isLoggingIn = navigation.formData?.get("username") != null;

    let actionData = useActionData() as { error: string } | undefined;

    //let navigate = useNavigate();
    let submit = useSubmit();


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        loginActionValues(values).then((result) => {
            if (result.error == null) {
                let redirectTo = values.redirectTo || '/';
                console.log('navigate', redirectTo,  fakeAuthProvider.username);
                return submit(redirectTo, {replace: true});
            }
        });
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
    <div>
        <p>You must log in to view the page at {from}</p>

        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            method="post"
        >
            <Form.Item<FieldType>
                label="redirectTo"
                name="redirectTo"
                hidden={true}
                rules={[{ required: false, message: 'Please input your username!' }]}
            >
                <input type="hidden" value={from} />
            </Form.Item>

            <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item<FieldType>
                name="forgotpass"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
            >
                <a className="login-form-forgot" href="{() => false}">
                    Forgot password
                </a>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? "Logging in..." : "Login"}
                </Button>

                {actionData && actionData.error ? (
                    <p style={{ color: "red" }}>{actionData.error}</p>
                ) : null}
            </Form.Item>
        </Form>
    </div>
    )
};

export default LoginPage;
