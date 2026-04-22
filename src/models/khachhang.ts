import { useState, useCallback } from 'react';
import { ICustomer } from '@/pages/QuanLyDonHang/typing';
import { customerService } from '@/pages/QuanLyDonHang/services/customerService';
import { message } from 'antd';

export default () => {
	const [danhSach, setDanhSach] = useState<ICustomer[]>([]);
	const [record, setRecord] = useState<ICustomer | undefined>();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [edit, setEdit] = useState(false);
	const [isView, setIsView] = useState(true);
	const [filters, setFilters] = useState<any[]>([]);
	const [condition, setCondition] = useState<any>({});
	const [selectedIds, setSelectedIds] = useState<string[] | undefined>();
	const [keyword, setKeyword] = useState<string>('');

	const getModel = useCallback(async () => {
		setLoading(true);
		try {
			const customers = customerService.getCustomers();

			let filtered = customers;
			if (keyword) {
				filtered = customers.filter(
					(c) =>
						c.code.toLowerCase().includes(keyword.toLowerCase()) ||
						c.name.toLowerCase().includes(keyword.toLowerCase()),
				);
			}

			const start = (page - 1) * limit;
			const end = start + limit;

			setDanhSach(filtered.slice(start, end));
			setTotal(filtered.length);
		} catch (err: any) {
			message.error(err?.message || 'Lỗi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	}, [page, limit, keyword]);

	const getByIdModel = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const result = customerService.getCustomerById(id);
			setRecord(result);
			return result;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	}, []);

	const getAllModel = useCallback(async () => {
		try {
			const customers = customerService.getCustomers();
			setDanhSach(customers);
			return customers;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi tải dữ liệu');
		}
	}, []);

	const postModel = useCallback(async (payload: any) => {
		setFormSubmiting(true);
		try {
			const id = Date.now().toString();
			const newCustomer = customerService.addCustomer({
				id,
				...payload,
				createdAt: Date.now(),
			});
			message.success('Thêm mới khách hàng thành công');
			setVisibleForm(false);
			getModel();
			return newCustomer;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi thêm mới khách hàng');
			throw err;
		} finally {
			setFormSubmiting(false);
		}
	}, [getModel]);

	const putModel = useCallback(async (payload: { id: string; data: any }) => {
		const { id, data } = payload;
		setFormSubmiting(true);
		try {
			const updated = customerService.updateCustomer(id, data);
			message.success('Cập nhật khách hàng thành công');
			setVisibleForm(false);
			getModel();
			return updated;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi cập nhật khách hàng');
			throw err;
		} finally {
			setFormSubmiting(false);
		}
	}, [getModel]);

	const deleteModel = useCallback(async (id: string) => {
		try {
			customerService.deleteCustomer(id);
			message.success('Xóa khách hàng thành công');
			getModel();
		} catch (err: any) {
			message.error(err?.message || 'Lỗi xóa khách hàng');
			throw err;
		}
	}, [getModel]);

	return {
		danhSach, setDanhSach,
		record, setRecord,
		page, setPage,
		limit, setLimit,
		total, setTotal,
		loading, setLoading,
		formSubmiting, setFormSubmiting,
		visibleForm, setVisibleForm,
		edit, setEdit,
		isView, setIsView,
		filters, setFilters,
		condition, setCondition,
		selectedIds, setSelectedIds,
		keyword, setKeyword,
		getModel,
		getByIdModel,
		getAllModel,
		postModel,
		putModel,
		deleteModel,
	};
};
