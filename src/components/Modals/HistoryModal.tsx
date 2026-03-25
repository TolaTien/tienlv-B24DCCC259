import React from 'react';
import { Modal, Timeline, Tag, Empty } from 'antd';
import type { IHistoryLog } from '@/types';

interface HistoryModalProps {
  visible: boolean;
  title?: string;
  history?: IHistoryLog[];
  onClose: () => void;
}

const statusColorMap: Record<string, string> = {
  'Approved': 'green',
  'Rejected': 'red',
  'Edited': 'blue',
};

const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  title = 'Lịch sử thao tác',
  history = [],
  onClose,
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {history && history.length > 0 ? (
        <Timeline>
          {history.map((item: IHistoryLog) => (
            <Timeline.Item
              key={`${item.action}-${item.timestamp}`}
              dot={<div style={{ backgroundColor: statusColorMap[item.action] || '#1890ff', width: 12, height: 12, borderRadius: '50%' }} />}
            >
              <div>
                <p style={{ marginBottom: 4 }}>
                  <Tag color={statusColorMap[item.action]}>{item.action}</Tag>
                  <span style={{ marginLeft: 8, fontWeight: 500 }}>{item.admin || 'Admin'}</span>
                </p>
                <p style={{ marginBottom: 4, fontSize: 12, color: '#999' }}>
                  {item.timestamp}
                </p>
                {item.reason && (
                  <p style={{ marginBottom: 4 }}>
                    <strong>Lý do:</strong> {item.reason}
                  </p>
                )}
                {item.details && (
                  <p style={{ fontSize: 12, color: '#666' }}>
                    Thông tin: {item.details}
                  </p>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty description='Không có lịch sử thao tác' />
      )}
    </Modal>
  );
};

export default HistoryModal;
