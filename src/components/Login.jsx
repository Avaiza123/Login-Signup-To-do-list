import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import "./Auth.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      message.error("Error logging in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      message.success("Google sign-in successful!");
      navigate("/dashboard");
    } catch (error) {
      message.error("Error with Google sign-in: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <Form name="login" onFinish={onFinish} className="auth-form">
        <h1 className="hhh1">LOGIN</h1>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            className="mb-2 btn btn-light mt-2"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Log In
          </Button>
        </Form.Item>
        <Form.Item>
            Dont have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </Form.Item>
        <Form.Item className="spp2">
          <div
            type="default"
            className="google-sign-in-btn "
            onClick={handleGoogleSignIn}
          >
            <i className="fab fa-google"></i>
            Sign Up with Google
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
