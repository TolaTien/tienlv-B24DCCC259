import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Select, Modal } from 'antd';
import { useModel } from 'umi'; 
import MyDatePicker from '@/components/MyDatePicker';



import type { IFormField } from '@/models/vanbang/cauHinhBieuMauModel';
import type { IVanBang } from '@/models/vanbang/thongTinVanBangModel';
import DynamicField from './DynamicField';

interface Props {
  visible: boolean;
  onClose: () => void;
  cauHinhDong: IFormField[]; 
}

const FormVanBang: React.FC<Props> = ({ visible, onClose, cauHinhDong }) => {
  const [form] = Form.useForm();
  const { getNextSoVaoSo } = useModel('vanbang.thongTinVanBangModel');


  useEffect(() => {
    if (visible) {
  
      getNextSoVaoSo('id_so_hien_tai').then((nextNumber: number) => {
        form.setFieldsValue({ soVaoSo: nextNumber });
      });
    } else {
      form.resetFields();
    }
  }, [visible, form]);

  const onFinish = (values: IVanBang) => {
    console.log('Dữ liệu lưu văn bằng:', values);
    onClose();
  };

  return (
<Modal title="Thêm mới văn bằng" visible={visible} onCancel={onClose} onOk={() => form.submit()} width={800}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="idQuyetDinh" label="Quyết định tốt nghiệp" rules={[{ required: true }]}>
              <Select placeholder="Chọn quyết định" options={[{ label: 'QĐ 123/2024', value: 'qd123' }]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="soVaoSo" label="Số vào sổ (Tự động)">
              <InputNumber disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
              <MyDatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {cauHinhDong.map(field => (
            <Col span={12} key={field._id}>
              <DynamicField field={field} />
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default FormVanBang;