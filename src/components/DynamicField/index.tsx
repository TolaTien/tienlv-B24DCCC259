import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import MyDatePicker from '@/components/MyDatePicker';
import type { IFormField } from '@/models/vanbang/cauHinhBieuMauModel';

interface Props {
  field: IFormField;
}

const DynamicField: React.FC<Props> = ({ field }) => {
  const renderControl = () => {
    switch (field.kieuDuLieu) {
      case 'Number':
        return <InputNumber style={{ width: '100%' }} placeholder={`Nhập ${field.tenTruong.toLowerCase()}`} />;
      case 'Date':
        return <MyDatePicker placeholder={`Chọn ${field.tenTruong.toLowerCase()}`} format="DD/MM/YYYY" style={{ width: '100%' }} />;
      case 'String':
      default:
        return <Input placeholder={`Nhập ${field.tenTruong.toLowerCase()}`} />;
    }
  };

  return (
    <Form.Item
      name={['duLieuDong', field.maTruong]} 
      label={field.tenTruong}
      rules={[{ required: field.batBuoc, message: `Vui lòng nhập ${field.tenTruong}` }]}
    >
      {renderControl()}
    </Form.Item>
  );
};

export default DynamicField;