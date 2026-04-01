import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TravelService } from '../service';
import { TravelPlan } from '../typing';
import { ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea } from '@ant-design/pro-form';

const DestinationAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<TravelPlan.Destination | undefined>();

  const columns: ProColumns<TravelPlan.Destination>[] = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (text: string) => <img src={text} alt="destination" style={{ width: 50 }} />,
      hideInSearch: true,
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      valueEnum: {
        beach: { text: 'Biển', status: 'Processing' },
        mountain: { text: 'Núi', status: 'Success' },
        city: { text: 'Thành phố', status: 'Default' },
      },
      render: (_, record) => {
        const colors = { beach: 'cyan', mountain: 'green', city: 'blue' };
        return <Tag color={colors[record.type]}>{record.type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      valueType: 'money',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      hideInSearch: true,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setEditingDestination(record);
            setModalVisible(true);
          }}
        >
          Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => {
            TravelService.deleteDestination(record.id);
            message.success('Xóa thành công');
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: 'red' }}>Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TravelPlan.Destination>
        headerTitle="Quản lý điểm đến"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingDestination(undefined);
              setModalVisible(true);
            }}
          >
            Thêm mới
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const allDestinations = TravelService.getDestinations();
          let data = [...allDestinations];
          if (params.name) {
            data = data.filter((d) => d.name.toLowerCase().includes(params.name.toLowerCase()));
          }
          if (params.type) {
            data = data.filter((d) => d.type === params.type);
          }
          return { data, success: true };
        }}
        columns={columns}
      />

      <ModalForm<TravelPlan.Destination>
        title={editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm mới điểm đến'}
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        initialValues={editingDestination}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (values) => {
          if (editingDestination) {
            TravelService.updateDestination({ ...values, id: editingDestination.id });
            message.success('Cập nhật thành công');
          } else {
            TravelService.addDestination({ ...values, id: Date.now().toString() });
            message.success('Thêm mới thành công');
          }
          setModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="name" label="Tên địa điểm" rules={[{ required: true }]} />
        <ProFormText name="image" label="Link hình ảnh" rules={[{ required: true }]} />
        <ProFormText name="location" label="Địa chỉ" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="Loại hình"
          valueEnum={{
            beach: 'Biển',
            mountain: 'Núi',
            city: 'Thành phố',
          }}
          rules={[{ required: true }]}
        />
        <ProFormTextArea name="description" label="Mô tả" />
        <ProFormDigit name="visitTime" label="Thời gian tham quan (giờ)" min={0} />
        <ProFormDigit name="costFood" label="Chi phí ăn uống" min={0} />
        <ProFormDigit name="costStay" label="Chi phí lưu trú" min={0} />
        <ProFormDigit name="costTravel" label="Chi phí di chuyển" min={0} />
        <ProFormDigit name="price" label="Giá trung bình/người" min={0} />
        <ProFormDigit name="rating" label="Đánh giá (1-5)" min={1} max={5} />
      </ModalForm>
    </PageContainer>
  );
};

export default DestinationAdmin;
