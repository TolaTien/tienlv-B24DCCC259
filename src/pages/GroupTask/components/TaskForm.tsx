import React, { useEffect } from 'react';
import { Modal } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import type { Task } from '@/models/groupTask';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <ProForm
        form={form}
        onFinish={async (values) => {
          onSubmit(values);
          return true;
        }}
        submitter={{
          searchConfig: {
            submitText: initialValues ? 'Cập nhật' : 'Thêm mới',
          },
        }}
      >
        <ProFormText
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        />
        <ProFormText
          name="assignee"
          label="Người được giao"
          rules={[{ required: true, message: 'Vui lòng nhập người được giao' }]}
        />
        <ProFormSelect
          name="priority"
          label="Mức độ ưu tiên"
          options={['Thấp', 'Trung bình', 'Cao'].map((v) => ({ label: v, value: v }))}
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
        />
        <ProFormDatePicker
          name="deadline"
          label="Thời hạn hoàn thành"
          rules={[{ required: true, message: 'Vui lòng chọn thời hạn' }]}
        />
        <ProFormSelect
          name="status"
          label="Trạng thái"
          options={['Chưa làm', 'Đang làm', 'Đã xong'].map((v) => ({ label: v, value: v }))}
          initialValue="Chưa làm"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        />
      </ProForm>
    </Modal>
  );
};

export default TaskForm;
