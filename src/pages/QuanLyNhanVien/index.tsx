import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Space, Popconfirm, Modal, Form, message, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import type { IEmployee, EmployeeStatus } from '@/models/quanLyNhanVienModel';

const { Option } = Select;

const POSITIONS = ['Giám đốc', 'Trưởng phòng', 'Nhân viên', 'Thực tập sinh'];
const DEPARTMENTS = ['Phòng Giám đốc', 'Phòng Kỹ thuật', 'Phòng Nhân sự', 'Phòng Kinh doanh', 'Phòng Kế toán'];
const STATUSES: EmployeeStatus[] = ['Thử việc', 'Đã ký hợp đồng', 'Nghỉ phép', 'Đã thôi việc'];

const STATUS_COLORS: Record<EmployeeStatus, string> = {
  'Thử việc': 'orange',
  'Đã ký hợp đồng': 'green',
  'Nghỉ phép': 'blue',
  'Đã thôi việc': 'red',
};

const QuanLyNhanVien = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useModel('quanLyNhanVienModel');

  const [searchText, setSearchText] = useState('');
  const [filterPosition, setFilterPosition] = useState<string | undefined>(undefined);
  const [filterDepartment, setFilterDepartment] = useState<string | undefined>(undefined);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
  const [form] = Form.useForm();

 
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.code.toLowerCase().includes(lowerSearch) || emp.fullName.toLowerCase().includes(lowerSearch),
      );
    }

    if (filterPosition) {
      result = result.filter((emp) => emp.position === filterPosition);
    }

    if (filterDepartment) {
      result = result.filter((emp) => emp.department === filterDepartment);
    }

    
    result.sort((a, b) => b.salary - a.salary);

    return result;
  }, [employees, searchText, filterPosition, filterDepartment]);

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: IEmployee) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: IEmployee) => {
    if (record.status !== 'Thử việc' && record.status !== 'Đã thôi việc') {
      message.error('Chỉ được phép xóa nhân viên ở trạng thái Thử việc hoặc Đã thôi việc');
      return;
    }
    deleteEmployee(record.code);
    message.success('Xóa nhân viên thành công!');
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingEmployee) {
          updateEmployee(editingEmployee.code, values);
          message.success('Cập nhật thông tin nhân viên thành công!');
        } else {
          addEmployee(values as Omit<IEmployee, 'code'>);
          message.success('Thêm mới nhân viên thành công!');
        }
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const columns: ColumnsType<IEmployee> = [
    {
      title: 'Mã NV',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      width: 180,
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      width: 150,
      render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: EmployeeStatus) => (
        <Tag color={STATUS_COLORS[status]} key={status}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record)}
            okText="Đồng ý"
            cancelText="Hủy"
            disabled={record.status !== 'Thử việc' && record.status !== 'Đã thôi việc'}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.status !== 'Thử việc' && record.status !== 'Đã thôi việc'}
              title={record.status !== 'Thử việc' && record.status !== 'Đã thôi việc' ? 'Chỉ được xóa khi Thử việc hoặc Đã thôi việc' : ''}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Nhân viên" bordered={false}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, họ tên"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo chức vụ"
            style={{ width: 180 }}
            allowClear
            value={filterPosition}
            onChange={setFilterPosition}
          >
            {POSITIONS.map((pos) => (
              <Option key={pos} value={pos}>
                {pos}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo phòng ban"
            style={{ width: 180 }}
            allowClear
            value={filterDepartment}
            onChange={setFilterDepartment}
          >
            {DEPARTMENTS.map((dep) => (
              <Option key={dep} value={dep}>
                {dep}
              </Option>
            ))}
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="code"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm mới nhân viên'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { max: 50, message: 'Họ tên tối đa 50 ký tự!' },
              {
                pattern: /^[\p{L}\s]+$/u,
                message: 'Họ tên không được chứa ký tự đặc biệt hoặc số!',
              },
            ]}
          >
            <Input placeholder="Nhập họ tên nhân viên" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức vụ"
            rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
          >
            <Select placeholder="Chọn chức vụ">
              {POSITIONS.map((pos) => (
                <Option key={pos} value={pos}>
                  {pos}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="Phòng ban"
            rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
          >
            <Select placeholder="Chọn phòng ban">
              {DEPARTMENTS.map((dep) => (
                <Option key={dep} value={dep}>
                  {dep}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="salary"
            label="Lương"
            rules={[{ required: true, message: 'Vui lòng nhập lương!' }]}
          >
            <InputNumber<number>
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number((value || '').replace(/\$\s?|(,*)/g, ''))}
              placeholder="Nhập mức lương"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {STATUSES.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyNhanVien;
