import React, { useState } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import type { IMember, IClub } from '@/types';
import MemberTransferModal from '@/components/Modals/MemberTransferModal';

interface MemberManagementPageProps {
  members: any;
  clb: any;
  dispatch: Dispatch;
}

const MemberManagementPage: React.FC<MemberManagementPageProps> = ({
  members,
  clb,
  dispatch,
}) => {
  const { list = [] } = members || {};
  const { list: clubs = [] } = clb || {};

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedClubIdForTransfer, setSelectedClubIdForTransfer] = useState<string>('');

  const handleDeleteMember = (id: string) => {
    dispatch({
      type: 'members/deleteMember',
      payload: id,
    });
    message.success('Đã xóa thành viên');
  };

  const handleTransferClub = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 thành viên');
      return;
    }

    // Get clubId from first selected member (assuming all selected members are from same club)
    const firstMemberId = selectedRowKeys[0];
    const firstMember = list.find((m: IMember) => m.id === firstMemberId);
    setSelectedClubIdForTransfer(firstMember?.clubId || '');
    setTransferModalVisible(true);
  };

  const handleConfirmTransfer = (newClubId: string) => {
    dispatch({
      type: 'members/bulkUpdateMember',
      payload: {
        ids: selectedRowKeys.map(String),
        updates: {
          clubId: newClubId,
          updatedAt: new Date().toISOString().split('T')[0],
        },
      },
    });
    message.success(`Đã chuyển ${selectedRowKeys.length} thành viên`);
    setSelectedRowKeys([]);
    setTransferModalVisible(false);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      sorter: (a: IMember, b: IMember) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      width: 150,
      render: (clubId: string) => {
        const club = clubs.find((c: IClub) => c.id === clubId);
        return <Tag color='blue'>{club?.name || '-'}</Tag>;
      },
    },
    {
      title: 'Sở trường',
      dataIndex: 'skills',
      key: 'skills',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      width: 120,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => role || 'Thành viên',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status === 'Active' ? 'Hoạt động' : 'Ngừng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: IMember) => (
        <Space size='small'>
          <Button
            size='small'
            icon={<EditOutlined />}
            disabled
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xóa thành viên?'
            onConfirm={() => handleDeleteMember(record.id)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button size='small' danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>
            {hasSelected
              ? `Đã chọn ${selectedRowKeys.length} thành viên`
              : `Tổng: ${list.length} thành viên`}
          </span>
          {hasSelected && (
            <Button
              type='primary'
              icon={<UndoOutlined />}
              onClick={handleTransferClub}
            >
              Chuyển CLB
            </Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns as any}
        dataSource={list}
        rowKey='id'
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <MemberTransferModal
        visible={transferModalVisible}
        selectedCount={selectedRowKeys.length}
        clubs={clubs}
        currentClubId={selectedClubIdForTransfer}
        onConfirm={handleConfirmTransfer}
        onCancel={() => setTransferModalVisible(false)}
      />
    </div>
  );
};

export default connect(({ members, clb }: any) => ({ members, clb }))(
  MemberManagementPage
);
