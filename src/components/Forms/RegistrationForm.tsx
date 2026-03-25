import React from 'react';
import { Modal, Form, Input, Select, Button, Space, Row, Col } from 'antd';
import type { IRegistration, IClub } from '@/types';

interface RegistrationFormProps {
  visible: boolean;
  loading?: boolean;
  initialValues?: Partial<IRegistration>;
  clubs?: IClub[];
  onSubmit: (values: IRegistration) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  visible,
  loading = false,
  initialValues,
  clubs = [],
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, form, initialValues]);

  const handleSubmit = async (values: any) => {
    try {
      const submitValues: IRegistration = {
        ...initialValues,
        ...values,
        id: initialValues?.id || Date.now().toString(),
        history: initialValues?.history || [],
        createdAt: initialValues?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onSubmit(submitValues);
      form.resetFields();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa Đơn đăng ký' : 'Thêm mới Đơn đăng ký'}
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Họ và tên'
              name='fullName'
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder='Nhập họ và tên' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder='Nhập email' type='email' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Số điện thoại'
              name='phone'
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input placeholder='Nhập số điện thoại' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Giới tính'
              name='gender'
            >
              <Select placeholder='Chọn giới tính'>
                <Select.Option value='Male'>Nam</Select.Option>
                <Select.Option value='Female'>Nữ</Select.Option>
                <Select.Option value='Other'>Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Địa chỉ'
          name='address'
        >
          <Input placeholder='Nhập địa chỉ' />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Sở trường'
              name='skills'
              rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
            >
              <Input placeholder='Nhập sở trường' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Câu lạc bộ'
              name='clubId'
              rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}
            >
              <Select placeholder='Chọn CLB'>
                {clubs.map((club) => (
                  <Select.Option key={club.id} value={club.id}>
                    {club.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Lý do đăng ký'
          name='reason'
          rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
        >
          <Input.TextArea rows={3} placeholder='Nhập lý do đăng ký' />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit' loading={loading}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegistrationForm;
