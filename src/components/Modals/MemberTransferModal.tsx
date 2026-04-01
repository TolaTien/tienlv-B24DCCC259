import React, { useState } from 'react';
import { Modal, Select, Button, message, Alert } from 'antd';
import type { IClub } from '@/types';

interface MemberTransferModalProps {
  visible: boolean;
  selectedCount: number;
  clubs?: IClub[];
  currentClubId?: string;
  onConfirm: (clubId: string) => void;
  onCancel: () => void;
}

const MemberTransferModal: React.FC<MemberTransferModalProps> = ({
  visible,
  selectedCount,
  clubs = [],
  currentClubId,
  onConfirm,
  onCancel,
}) => {
  const [selectedClubId, setSelectedClubId] = useState<string>('');

  const handleConfirm = () => {
    if (!selectedClubId) {
      message.error('Vui lòng chọn Câu lạc bộ');
      return;
    }
    if (selectedClubId === currentClubId) {
      message.warning('Vui lòng chọn CLB khác');
      return;
    }
    onConfirm(selectedClubId);
    setSelectedClubId('');
  };

  const availableClubs = clubs.filter((club) => club.id !== currentClubId);

  return (
    <Modal
      title='Chuyển Câu lạc bộ'
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key='back' onClick={onCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleConfirm}>
          Xác nhận
        </Button>,
      ]}
      width={500}
    >
      <div style={{ marginBottom: 16 }}>
        <Alert
          type='info'
          message={`Bạn sắp chuyển ${selectedCount} thành viên sang Câu lạc bộ khác`}
          showIcon
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Chọn Câu lạc bộ đích:
        </label>
        <Select
          placeholder='Chọn CLB'
          style={{ width: '100%' }}
          value={selectedClubId || undefined}
          onChange={setSelectedClubId}
        >
          {availableClubs.map((club) => (
            <Select.Option key={club.id} value={club.id}>
              {club.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default MemberTransferModal;
