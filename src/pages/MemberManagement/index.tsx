import React, { useState } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Button, Table, Space, Popconfirm, message, Tag, Select } from 'antd';
import { DeleteOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import type { IMember, IClub } from '@/types';
import MemberTransferModal from '@/components/Modals/MemberTransferModal';
import MemberEditModal from '@/components/Modals/MemberEditModal';

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
  const [filterClubId, setFilterClubId] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<IMember | undefined>();

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

  const handleEditMember = (member: IMember) => {
    setEditingMember(member);
    setEditModalVisible(true);
  };

  const handleSubmitEditMember = (values: IMember) => {
    dispatch({
      type: 'members/updateMember',
      payload: values,
    });
    message.success('Cập nhật thành viên thành công');
    setEditModalVisible(false);
    setEditingMember(undefined);
  };

  // Filter members by club
  const filteredList = filterClubId
    ? list.filter((m: IMember) => m.clubId === filterClubId)
    : list;

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 130,
      sorter: (a: IMember, b: IMember) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 130,
      ellipsis: true,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 100,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      width: 140,
      render: (clubId: string) => {
        const club = clubs.find((c: IClub) => c.id === clubId);
        return <Tag color='blue'>{club?.name || '-'}</Tag>;
      },
    },
    {
      title: 'Sở trường',
      dataIndex: 'skills',
      key: 'skills',
      width: 130,
      ellipsis: true,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role',
      width: 90,
      render: (role: string) => role || 'Thành viên',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status === 'Active' ? 'Hoạt động' : 'Ngừng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_: any, record: IMember) => (
        <Space size='small'>
          <Button
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditMember(record)}
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

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>
            {filterClubId 
              ? `Lọc: ${clubs.find((c: IClub) => c.id === filterClubId)?.name || 'Tất cả'} - ${filteredList.length} thành viên`
              : `Tổng: ${list.length} thành viên`}
          </span>
          <Select
            style={{ width: 200 }}
            placeholder='Lọc theo Câu lạc bộ'
            allowClear
            value={filterClubId || undefined}
            onChange={(value) => {
              setFilterClubId(value || '');
              setSelectedRowKeys([]);
            }}
          >
            {clubs.map((club: IClub) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>
            {selectedRowKeys.length > 0
              ? `Đã chọn ${selectedRowKeys.length} thành viên`
              : ''}
          </span>
          {selectedRowKeys.length > 0 && (
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
        dataSource={filteredList}
        rowKey='id'
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
      />

      <MemberTransferModal
        visible={transferModalVisible}
        selectedCount={selectedRowKeys.length}
        clubs={clubs}
        currentClubId={selectedClubIdForTransfer}
        onConfirm={handleConfirmTransfer}
        onCancel={() => setTransferModalVisible(false)}
      />

      <MemberEditModal
        visible={editModalVisible}
        initialValues={editingMember}
        clubs={clubs}
        onSubmit={handleSubmitEditMember}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingMember(undefined);
        }}
      />
    </div>
  );
};

export default connect(({ members, clb }: any) => ({ members, clb }))(
  MemberManagementPage
);
