import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Space, Modal, message } from 'antd';
import { useModel } from 'umi';
import type { Application } from './type';

export default () => {
  const { apps = [], clubs = [], updateStatusBulk } = useModel('useClubManagement');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const clubMap = (clubs || []).reduce((acc, club) => {
    acc[club.id] = club.name;
    return acc;
  }, {} as Record<string, string>);

  const onBulkReject = async (values: any) => {
    updateStatusBulk(selectedKeys as string[], 'Rejected', values.reason);
    message.success('Đã từ chối đơn thành công');
    setSelectedKeys([]);
    return true;
  };

  return (
    <ProTable<Application>
      headerTitle="Quản lý Đơn tham gia"
      dataSource={apps}
      rowKey="id"
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: (keys) => setSelectedKeys(keys),
      }}
      tableAlertRender={({ selectedRowKeys }) => (
        <Space size={16}>
          <span>Đã chọn {selectedRowKeys.length} đơn</span>
          <Button type="link" onClick={() => {
            updateStatusBulk(selectedRowKeys as string[], 'Approved');
            setSelectedKeys([]);
            message.success('Đã duyệt đơn thành công');
          }}>Duyệt hàng loạt</Button>
          
          <ModalForm
            title="Từ chối hàng loạt"
            trigger={<Button type="link" danger>Từ chối hàng loạt</Button>}
            onFinish={onBulkReject}
          >
            <ProFormTextArea 
              name="reason" 
              label="Lý do từ chối" 
              rules={[{ required: true, message: 'Vui lòng nhập lý do' }]} 
            />
          </ModalForm>
        </Space>
      )}
      columns={[
        { title: 'Họ tên', dataIndex: 'fullName' },
        { 
          title: 'Câu lạc bộ', 
          dataIndex: 'clubId',
          render: (id) => clubMap[id as string] || id
        },
        { 
          title: 'Trạng thái', 
          dataIndex: 'status',
          valueEnum: {
            Pending: { text: 'Chờ duyệt', status: 'Processing' },
            Approved: { text: 'Đã duyệt', status: 'Success' },
            Rejected: { text: 'Từ chối', status: 'Error' },
          }
        },
        {
          title: 'Lịch sử',
          render: (_, record) => (
            <a onClick={() => Modal.info({
              title: 'Lịch sử thao tác',
              content: record.history?.length > 0 ? (
                record.history.map(h => (
                  <div key={h.id} style={{ marginBottom: 8 }}>
                    <strong>{h.time}</strong>: {h.admin} - {h.action} {h.reason && `(${h.reason})`}
                  </div>
                ))
              ) : 'Chưa có lịch sử'
            })}>Xem</a>
          )
        }
      ]}
    />
  );
};