

import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';

type FieldType = {
    name?: string;
    password?: string;
    email?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Register: React.FC = () => {
    return (
        <>
       <h3> регистрация</h3>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >

            <Form.Item<FieldType>
                label="email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
                label="name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
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




            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            <></>
        </Form>
        </>
    );
}










export default Register
