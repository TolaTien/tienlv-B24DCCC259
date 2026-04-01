import React, { useState } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Button, Table, Space, Popconfirm, Image, message, Modal, Avatar, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import type { IClub, IMember } from '@/types';
import ClubForm from '@/components/Forms/ClubForm';
import MemberEditModal from '@/components/Modals/MemberEditModal';

interface CLBPageProps {
  clb: any;
  members: any;
  dispatch: Dispatch;
}

const CLBPage: React.FC<CLBPageProps> = ({ clb, members, dispatch }) => {
  const { list = [] } = clb || {};
  const { list: membersList = [] } = members || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Partial<IClub> | undefined>();
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<IClub | undefined>();
  const [memberEditModalVisible, setMemberEditModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<IMember | undefined>();

  const handleAddClub = () => {
    setEditingClub(undefined);
    setIsModalVisible(true);
  };

  const handleEditClub = (club: IClub) => {
    setEditingClub(club);
    setIsModalVisible(true);
  };

  const handleDeleteClub = (clubId: string) => {
    dispatch({
      type: 'clb/deleteClub',
      payload: clubId,
    });
    message.success('Đã xóa Câu lạc bộ');
  };

  const handleSubmitClub = (values: IClub) => {
    if (editingClub?.id) {
      dispatch({
        type: 'clb/updateClub',
        payload: values,
      });
      message.success('Cập nhật Câu lạc bộ thành công');
    } else {
      dispatch({
        type: 'clb/addClub',
        payload: values,
      });
      message.success('Thêm mới Câu lạc bộ thành công');
    }
    setIsModalVisible(false);
  };

  const handleViewMembers = (club: IClub) => {
    setSelectedClub(club);
    setMemberModalVisible(true);
  };

  const handleEditMember = (member: IMember) => {
    setEditingMember(member);
    setMemberEditModalVisible(true);
  };

  const handleDeleteMember = (memberId: string) => {
    dispatch({
      type: 'members/deleteMember',
      payload: memberId,
    });
    message.success('Đã xóa thành viên');
  };

  const handleSubmitEditMember = (values: IMember) => {
    dispatch({
      type: 'members/updateMember',
      payload: values,
    });
    message.success('Cập nhật thành viên thành công');
    setMemberEditModalVisible(false);
    setEditingMember(undefined);
  };

  // Get members of selected club
  const clubMembers = selectedClub
    ? membersList.filter((m: IMember) => m.clubId === selectedClub.id)
    : [];

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (url: string, record: IClub) => (
        <Tooltip title={record.name}>
          {url ? (
            <Image src={url} width={50} height={50} preview style={{ borderRadius: 4 }} />
          ) : (
            <Avatar
              size={50}
              style={{
                backgroundColor: '#1890ff',
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {record.name.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Tooltip>
      ),
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: IClub, b: IClub) => a.name.localeCompare(b.name),
      width: 150,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
      key: 'leader',
      width: 120,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      width: 120,
    },
    {
      title: 'Thành viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: 80,
      render: (active: boolean) => (
        <span style={{ color: active ? 'green' : 'red' }}>
          {active ? 'Hoạt động' : 'Ngừng'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: IClub) => (
        <Space size='small'>
          <Button
            type='primary'
            size='small'
            icon={<TeamOutlined />}
            onClick={() => handleViewMembers(record)}
          >
            Thành viên
          </Button>
          <Button
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditClub(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xóa Câu lạc bộ?'
            onConfirm={() => handleDeleteClub(record.id)}
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
        <Button type='primary' size='large' onClick={handleAddClub}>
          + Thêm mới Câu lạc bộ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        rowKey='id'
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <ClubForm
        visible={isModalVisible}
        initialValues={editingClub}
        onSubmit={handleSubmitClub}
        onCancel={() => setIsModalVisible(false)}
        isEdit={!!editingClub?.id}
      />

      <Modal
        title={`Thành viên CLB: ${selectedClub?.name}`}
        visible={memberModalVisible}
        onCancel={() => setMemberModalVisible(false)}
        footer={null}
        width={1000}
      >
        {clubMembers.length > 0 ? (
          <Table
            dataSource={clubMembers}
            rowKey='id'
            size='small'
            pagination={{ pageSize: 8 }}
            columns={[
              {
                title: 'Họ tên',
                dataIndex: 'fullName',
                key: 'fullName',
                width: 120,
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
                width: 90,
                render: (status: string) => (
                  <span style={{ color: status === 'Active' ? 'green' : 'orange' }}>
                    {status === 'Active' ? 'Hoạt động' : 'Ngừng'}
                  </span>
                ),
              },
              {
                title: 'Thao tác',
                key: 'action',
                width: 130,
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
            ]}
          />
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Chưa có thành viên trong câu lạc bộ này
          </p>
        )}
      </Modal>

      <MemberEditModal
        visible={memberEditModalVisible}
        initialValues={editingMember}
        clubs={list}
        onSubmit={handleSubmitEditMember}
        onCancel={() => {
          setMemberEditModalVisible(false);
          setEditingMember(undefined);
        }}
      />
    </div>
  );
};

export default connect(({ clb, members }: any) => ({ clb, members }))(CLBPage);
