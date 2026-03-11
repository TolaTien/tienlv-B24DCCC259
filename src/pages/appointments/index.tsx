import { Table, Button, Modal, Tag, Space } from "antd";
import { useModel } from "umi";
import { useState } from "react";
import AppointmentForm from "./components/AppointmentForm";

export default function AppointmentPage() {

  const { appointments, updateStatus, deleteAppointment } =
    useModel("appointment");

  const [open, setOpen] = useState(false);

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
    },
    {
      title: "Nhân viên",
      dataIndex: "employee",
    },
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Giờ",
      dataIndex: "time",
    },
    {
      title: "Trạng thái",
      render: (record: any) => {

        let color = "orange";

        if (record.status === "Xác nhận") color = "blue";
        if (record.status === "Hoàn thành") color = "green";
        if (record.status === "Hủy") color = "red";

        return <Tag color={color}>{record.status}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (record: any) => (
        <Space>

          <Button
            onClick={() =>
              updateStatus(record.id, "Xác nhận")
            }
          >
            Xác nhận
          </Button>

          <Button
            onClick={() =>
              updateStatus(record.id, "Hoàn thành")
            }
          >
            Hoàn thành
          </Button>

          <Button
            danger
            onClick={() => deleteAppointment(record.id)}
          >
            Xóa
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <div>

      <Button
        type="primary"
        onClick={() => setOpen(true)}
      >
        Đặt lịch
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={appointments}
      />

      <Modal
        visible ={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <AppointmentForm close={() => setOpen(false)} />
      </Modal>

    </div>
  );
}