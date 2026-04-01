import React, { useState } from 'react';
import { Card, Button, Table, Space, Tag, Modal, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import FormVanBang from '../../../components/FormVanBang'; 

const ThongTinVanBang: React.FC = () => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  // Mock data
  const [dataSource] = useState([
    { id: 1, soHieu: 'VN123456', soVaoSo: 104, msv: 'B20DCCN001', hoTen: 'Nguyễn Văn A', ngaySinh: '01/01/2002', qd: '123/QĐ-ĐH' },
    { id: 2, soHieu: 'VN123457', soVaoSo: 105, msv: 'B20DCCN002', hoTen: 'Trần Thị B', ngaySinh: '15/05/2002', qd: '123/QĐ-ĐH' },
  ]);

  const handleViewDetail = (record: any) => {
    setCurrentRecord(record);
    setIsDetailVisible(true);
  };

  const columns = [
    { title: 'Số hiệu VB', dataIndex: 'soHieu', width: 120, render: (val: string) => <b>{val}</b> },
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', width: 100, align: 'center' as const, render: (val: number) => <Tag color="blue">{val}</Tag> },
    { title: 'Mã SV', dataIndex: 'msv', width: 120 },
    { title: 'Họ và tên', dataIndex: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', width: 120, align: 'center' as const },
    { title: 'Quyết định', dataIndex: 'qd', width: 120 },
    {
      title: 'Thao tác', width: 100, align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} style={{ color: '#1890ff' }} onClick={() => handleViewDetail(record)} />
        </Space>
      ),
    },
  ];

  
  const mockCauHinhDong = [
    { _id: '1', maTruong: 'dan_toc', tenTruong: 'Dân tộc', kieuDuLieu: 'String' as any, batBuoc: true },
    { _id: '2', maTruong: 'diem_tb', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number' as any, batBuoc: true },
  ];

  return (
    <Card title="Danh sách Thông tin văn bằng" extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisibleForm(true)}>
        Thêm mới văn bằng
      </Button>
    }>
      <Table dataSource={dataSource} columns={columns} rowKey="id" bordered />

      <FormVanBang 
        visible={visibleForm} 
        onClose={() => setVisibleForm(false)} 
        cauHinhDong={mockCauHinhDong} 
      />

      <Modal
        title="Thông tin chi tiết văn bằng"
        visible={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {currentRecord && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Số hiệu VB"><b>{currentRecord.soHieu}</b></Descriptions.Item>
            <Descriptions.Item label="Số vào sổ"><Tag color="blue">{currentRecord.soVaoSo}</Tag></Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{currentRecord.msv}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{currentRecord.hoTen}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{currentRecord.ngaySinh}</Descriptions.Item>
            <Descriptions.Item label="Quyết định">{currentRecord.qd}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default ThongTinVanBang;