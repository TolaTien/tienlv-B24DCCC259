import { Button, Form, Input, DatePicker, Select } from "antd";
import { useModel } from "umi";

export default function AppointmentForm({ close }: any) {

  const { addAppointment } = useModel("appointment");

  const onFinish = (values: any) => {

    addAppointment({
      customer: values.customer,
      employee: values.employee,
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
        name="employee"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "Nhân viên A", value: "A" },
            { label: "Nhân viên B", value: "B" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Ngày"
        name="date"
        rules={[{ required: true }]}
      >
        <DatePicker />
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