import {
    useActionData,
    useLocation,
    useNavigation,
    useFetcher,
} from "react-router-dom";
import {
    Button,
    Checkbox,
    Form,
    Input
} from 'antd';
import type { FormProps } from 'antd';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
    redirectTo?: string;
};

import './Login.css';

export default function LoginPage() {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let redirectTo = params.get("from") || '/';

    let navigation = useNavigation();
    let isLoggingIn = navigation.formData?.get("username") != null;

    let actionData = useActionData() as { error: string } | undefined;
    const fetcher = useFetcher();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        fetcher.submit(
            values,
            { method: "post", action: "/login" }
        );
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <p>Login</p>

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
                    <input type="hidden" value={redirectTo} />
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

                <Form.Item>
                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                        noStyle
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

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
    );
}
