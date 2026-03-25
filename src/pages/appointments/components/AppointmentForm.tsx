import { Button, Form, Input, DatePicker, Select } from "antd";
import { useModel } from "umi";

export default function AppointmentForm({ close }: any) {
  const { addAppointment } = useModel("appointment");
  const { nhanVienList } = useModel("nhanVienModel");
  const { dichVuList } = useModel("dichVuModel");

  const onFinish = (values: any) => {
    addAppointment({
      customer: values.customer,
      employeeId: values.employeeId, // Lưu ID nhân viên
      serviceId: values.serviceId,   // Lưu ID dịch vụ
      date: values.date.format("YYYY-MM-DD"),
      time: values.time,
    });
    close();
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Tên khách hàng"
        name="customer"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Nhân viên"
        name="employeeId"
        rules={[{ required: true }]}
      >
        <Select
          options={(nhanVienList || []).map((nv: any) => ({
            label: nv.hoTen,
            value: nv.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Dịch vụ"
        name="serviceId"
        rules={[{ required: true }]}
      >
        <Select
          options={(dichVuList || []).map((dv: any) => ({
            label: `${dv.tenDichVu} - ${dv.gia.toLocaleString('vi-VN')}đ`,
            value: dv.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Ngày"
        name="date"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Giờ"
        name="time"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "09:00", value: "09:00" },
            { label: "10:00", value: "10:00" },
            { label: "11:00", value: "11:00" },
            { label: "14:00", value: "14:00" },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Đặt lịch
      </Button>
    </Form>
  );
}