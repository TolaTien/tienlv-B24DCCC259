import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

interface RejectionModalProps {
  visible: boolean;
  title?: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  visible,
  title = 'Xác nhận từ chối',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [reason, setReason] = useState('');

  React.useEffect(() => {
    if (!visible) {
      setReason('');
      form.resetFields();
    }
  }, [visible, form]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key='back' onClick={onCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' danger onClick={handleConfirm} loading={loading}>
          Từ chối
        </Button>,
      ]}
      width={500}
    >
      <Form layout='vertical'>
        <Form.Item
          label='Lý do từ chối'
          required
        >
          <Input.TextArea
            rows={4}
            placeholder='Nhập lý do từ chối (bắt buộc)'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectionModal;
