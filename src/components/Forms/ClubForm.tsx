import React from 'react';
import { Modal, Form, Input, Switch, Row, Col, Button, Space } from 'antd';
import type { IClub } from '@/types';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';

interface ClubFormProps {
  visible: boolean;
  loading?: boolean;
  initialValues?: Partial<IClub>;
  onSubmit: (values: IClub) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const ClubForm: React.FC<ClubFormProps> = ({
  visible,
  loading = false,
  initialValues,
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
      const submitValues: IClub = {
        ...initialValues,
        ...values,
        id: initialValues?.id || Date.now().toString(),
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
      title={isEdit ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm mới Câu lạc bộ'}
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
              label='Ảnh đại diện'
              name='avatar'
            >
              <UploadFile />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Tên Câu lạc bộ'
              name='name'
              rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}
            >
              <Input placeholder='Nhập tên CLB' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Chủ nhiệm CLB'
              name='leader'
              rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
            >
              <Input placeholder='Nhập tên chủ nhiệm' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Ngày thành lập'
              name='foundedDate'
            >
              <Input type='date' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Mô tả'
          name='description'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TinyEditor />
        </Form.Item>

        <Form.Item
          label='Hoạt động'
          name='active'
          valuePropName='checked'
        >
          <Switch />
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

export default ClubForm;
