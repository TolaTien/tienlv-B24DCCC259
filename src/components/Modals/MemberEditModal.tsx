import React from 'react';
import { Modal, Form, Input, Select, Button, Row, Col } from 'antd';
import type { IMember, IClub } from '@/types';

interface MemberEditModalProps {
  visible: boolean;
  loading?: boolean;
  initialValues?: Partial<IMember>;
  clubs?: IClub[];
  onSubmit: (values: IMember) => void;
  onCancel: () => void;
}

const MemberEditModal: React.FC<MemberEditModalProps> = ({
  visible,
  loading = false,
  initialValues,
  clubs = [],
  onSubmit,
  onCancel,
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
      const submitValues: IMember = {
        ...initialValues,
        ...values,
        id: initialValues?.id || Date.now().toString(),
        createdAt: initialValues?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      } as IMember;
      onSubmit(submitValues);
      form.resetFields();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      title='Chỉnh sửa Thông tin Thành viên'
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key='back' onClick={onCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' loading={loading} onClick={() => form.submit()}>
          Cập nhật
        </Button>,
      ]}
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
              label='Chức vụ'
              name='role'
            >
              <Select placeholder='Chọn chức vụ'>
                <Select.Option value='Leader'>Chủ tịch</Select.Option>
                <Select.Option value='Vice Leader'>Phó chủ tịch</Select.Option>
                <Select.Option value='Member'>Thành viên</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
          <Col xs={24} sm={12}>
            <Form.Item
              label='Trạng thái'
              name='status'
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder='Chọn trạng thái'>
                <Select.Option value='Active'>Hoạt động</Select.Option>
                <Select.Option value='Inactive'>Ngừng hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Ngày tham gia'
          name='joinedDate'
        >
          <Input type='date' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemberEditModal;
