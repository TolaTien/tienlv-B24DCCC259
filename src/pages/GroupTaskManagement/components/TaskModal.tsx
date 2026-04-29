import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { Task, TaskPriority, TaskStatus } from '../../../models/groupTask';
import moment from 'moment';

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Omit<Task, 'id'>) => void;
  editingTask?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onCancel, onOk, editingTask }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingTask) {
        form.setFieldsValue({
          ...editingTask,
          deadline: moment(editingTask.deadline),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 'Chưa làm',
          priority: 'Trung bình',
        });
      }
    }
  }, [visible, editingTask, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({
        ...values,
        deadline: values.deadline.toISOString(),
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Ví dụ: Thiết kế UI" />
        </Form.Item>
        <Form.Item
          name="assignee"
          label="Người được giao"
          rules={[{ required: true, message: 'Vui lòng nhập người được giao!' }]}
        >
          <Input placeholder="Tên người nhận" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Thấp">Thấp</Select.Option>
            <Select.Option value="Trung bình">Trung bình</Select.Option>
            <Select.Option value="Cao">Cao</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Thời hạn hoàn thành"
          rules={[{ required: true, message: 'Vui lòng chọn thời hạn!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Chưa làm">Chưa làm</Select.Option>
            <Select.Option value="Đang làm">Đang làm</Select.Option>
            <Select.Option value="Đã xong">Đã xong</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
