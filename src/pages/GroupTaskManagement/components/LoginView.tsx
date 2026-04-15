import React, { useState } from 'react';
import { Card, Input, Button, Form, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoginViewProps {
  onLogin: (username: string, password: string) => boolean;
  onRegister: (username: string, password: string) => boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister }) => {
  const [form] = Form.useForm();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (values: any) => {
    if (isRegistering) {
      const success = onRegister(values.username, values.password);
      if (success) setIsRegistering(false);
    } else {
      onLogin(values.username, values.password);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh' 
    }}>
      <Card style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>{isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập'}</Title>
          <Text type="secondary">Quản lý Công việc Nhóm</Text>
        </div>
        
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Hãy nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ví dụ: admin, ngoc..." size="large" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu..." size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ borderRadius: 6 }}>
              {isRegistering ? 'Đăng ký ngay' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <Text>{isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}</Text>
          <Button type="link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Đăng nhập' : 'Đăng ký ngay'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginView;
