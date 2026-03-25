import React, { useState } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Button, Table, Space, Popconfirm, message, Tag, Drawer } from 'antd';
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import type { IRegistration, IClub } from '@/types';
import RegistrationForm from '@/components/Forms/RegistrationForm';
import RejectionModal from '@/components/Modals/RejectionModal';
import HistoryModal from '@/components/Modals/HistoryModal';

interface RegistrationPageProps {
  registration: any;
  clb: any;
  dispatch: Dispatch;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ registration, clb, dispatch }) => {
  const { list = [] } = registration || {};
  const { list: clubs = [] } = clb || {};

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Partial<IRegistration> | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingIds, setRejectingIds] = useState<string[]>([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any[]>([]);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IRegistration | undefined>();

  const handleAddNew = () => {
    setEditingRecord(undefined);
    setIsFormVisible(true);
  };

  const handleEditRecord = (record: IRegistration) => {
    setEditingRecord(record);
    setIsFormVisible(true);
  };

  const handleDeleteRecord = (id: string) => {
    dispatch({
      type: 'registration/deleteRegistration',
      payload: id,
    });
    message.success('Đã xóa đơn đăng ký');
  };

  const handleApprove = (id: string) => {
    const newHistory = {
      action: 'Approved',
      admin: 'Admin',
      timestamp: new Date().toLocaleString('vi-VN'),
      reason: 'Được duyệt',
    };

    dispatch({
      type: 'registration/updateRegistration',
      payload: {
        id,
        status: 'Approved',
        newHistory,
      },
    });
    message.success('Đã duyệt đơn đăng ký');
  };

  const handleBulkApprove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 đơn');
      return;
    }

    const newHistory = {
      action: 'Approved',
      admin: 'Admin',
      timestamp: new Date().toLocaleString('vi-VN'),
      reason: 'Được duyệt (hàng loạt)',
    };

    dispatch({
      type: 'registration/bulkUpdateRegistration',
      payload: {
        ids: selectedRowKeys.map(String),
        updates: {
          status: 'Approved',
          newHistory,
        },
      },
    });
    message.success(`Đã duyệt ${selectedRowKeys.length} đơn`);
    setSelectedRowKeys([]);
  };

  const handleBulkReject = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 đơn');
      return;
    }
    setRejectingIds(selectedRowKeys.map(String));
    setRejectModalVisible(true);
  };

  const handleRejectSingle = (id: string) => {
    setRejectingIds([id]);
    setRejectModalVisible(true);
  };

  const handleConfirmReject = (reason: string) => {
    const newHistory = {
      action: 'Rejected',
      admin: 'Admin',
      timestamp: new Date().toLocaleString('vi-VN'),
      reason,
    };

    dispatch({
      type: 'registration/bulkUpdateRegistration',
      payload: {
        ids: rejectingIds,
        updates: {
          status: 'Rejected',
          rejectionReason: reason,
          newHistory,
        },
      },
    });
    message.success(`Đã từ chối ${rejectingIds.length} đơn`);
    setRejectModalVisible(false);
    setRejectingIds([]);
    setSelectedRowKeys([]);
  };

  const handleViewHistory = (record: IRegistration) => {
    setSelectedHistory(record.history || []);
    setHistoryModalVisible(true);
  };

  const handleViewDetails = (record: IRegistration) => {
    setSelectedRecord(record);
    setDetailsDrawerVisible(true);
  };

  const handleSubmitForm = (values: IRegistration) => {
    if (editingRecord?.id) {
      dispatch({
        type: 'registration/updateRegistration',
        payload: values,
      });
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      dispatch({
        type: 'registration/addRegistration',
        payload: values,
      });
      message.success('Thêm mới đơn đăng ký thành công');
    }
    setIsFormVisible(false);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      sorter: (a: IRegistration, b: IRegistration) => a.fullName.localeCompare(b.fullName),
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
      width: 120,
      render: (clubId: string) => {
        const club = clubs.find((c: IClub) => c.id === clubId);
        return club?.name || '-';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Approved') color = 'green';
        if (status === 'Rejected') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_: any, record: IRegistration) => (
        <Space size='small' wrap>
          <Button
            size='small'
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Button
            size='small'
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record)}
          >
            Lịch sử
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button
                type='primary'
                size='small'
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                danger
                size='small'
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectSingle(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditRecord(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xóa đơn đăng ký?'
            onConfirm={() => handleDeleteRecord(record.id)}
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
          <Button type='primary' size='large' onClick={handleAddNew}>
            + Thêm mới đơn đăng ký
          </Button>
          {hasSelected && (
            <>
              <Button
                type='primary'
                icon={<CheckCircleOutlined />}
                onClick={handleBulkApprove}
              >
                Duyệt {selectedRowKeys.length} đơn
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleBulkReject}
              >
                Từ chối {selectedRowKeys.length} đơn
              </Button>
            </>
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
        scroll={{ x: 1500 }}
      />

      <RegistrationForm
        visible={isFormVisible}
        initialValues={editingRecord}
        clubs={clubs}
        onSubmit={handleSubmitForm}
        onCancel={() => setIsFormVisible(false)}
        isEdit={!!editingRecord?.id}
      />

      <RejectionModal
        visible={rejectModalVisible}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectModalVisible(false)}
      />

      <HistoryModal
        visible={historyModalVisible}
        title='Lịch sử thao tác'
        history={selectedHistory}
        onClose={() => setHistoryModalVisible(false)}
      />

      <Drawer
        title='Chi tiết đơn đăng ký'
        placement='right'
        onClose={() => setDetailsDrawerVisible(false)}
        visible={detailsDrawerVisible}
        width={500}
      >
        {selectedRecord && (
          <div>
            <p><strong>Họ tên:</strong> {selectedRecord.fullName}</p>
            <p><strong>Email:</strong> {selectedRecord.email}</p>
            <p><strong>SĐT:</strong> {selectedRecord.phone}</p>
            <p><strong>Giới tính:</strong> {selectedRecord.gender || '-'}</p>
            <p><strong>Địa chỉ:</strong> {selectedRecord.address || '-'}</p>
            <p><strong>Sở trường:</strong> {selectedRecord.skills}</p>
            <p>
              <strong>Câu lạc bộ:</strong> {clubs.find((c: IClub) => c.id === selectedRecord.clubId)?.name || '-'}
            </p>
            <p><strong>Lý do đăng ký:</strong></p>
            <p style={{ paddingLeft: 16, color: '#666' }}>{selectedRecord.reason}</p>
            <p><strong>Trạng thái:</strong> <Tag color={selectedRecord.status === 'Approved' ? 'green' : selectedRecord.status === 'Rejected' ? 'red' : 'blue'}>{selectedRecord.status}</Tag></p>
            {selectedRecord.rejectionReason && (
              <>
                <p><strong>Lý do từ chối:</strong></p>
                <p style={{ paddingLeft: 16, color: '#666' }}>{selectedRecord.rejectionReason}</p>
              </>
            )}
            <p><strong>Ngày đăng ký:</strong> {selectedRecord.createdAt}</p>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default connect(({ registration, clb }: any) => ({ registration, clb }))(RegistrationPage);
