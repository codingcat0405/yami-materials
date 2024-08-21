import {Button, Form, Input} from "antd";
import yamiMaterials from "../apis/yami-materials.ts";
import {useState} from "react";
import {ACCESS_TOKEN_KEY} from "../constants.ts";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

type FieldType = {
  username?: string;
  password?: string;
};
export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);
      const resp = await yamiMaterials.login(values);
      localStorage.setItem(ACCESS_TOKEN_KEY, resp.jwt);
      navigate('/');
      toast.success('Login success');
    } catch (err) {
      console.log(err);
      toast.error('Login failed');

    } finally {
      setLoading(false);

    }
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>

      <Form
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}
        >
          <Input.Password/>
        </Form.Item>


        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default Login;
