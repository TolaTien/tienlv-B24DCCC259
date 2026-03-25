import React, { useState } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Button, Table, Space, Popconfirm, Image, message, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import type { IClub } from '@/types';
import ClubForm from '@/components/Forms/ClubForm';

interface CLBPageProps {
  clb: any;
  dispatch: Dispatch;
}

const CLBPage: React.FC<CLBPageProps> = ({ clb, dispatch }) => {
  const { list = [] } = clb || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Partial<IClub> | undefined>();
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<IClub | undefined>();

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

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (url: string) => (
        url ? <Image src={url} width={50} preview /> : <span>-</span>
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
        width={800}
      >
        <p>Tính năng xem danh sách thành viên sẽ được cập nhật trong Member Management page</p>
      </Modal>
    </div>
  );
};

export default connect(({ clb }: any) => ({ clb }))(CLBPage);
