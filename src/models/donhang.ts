import { useState, useCallback } from 'react';
import { IOrder, EOrderStatus } from '@/pages/QuanLyDonHang/typing';
import { orderService } from '@/pages/QuanLyDonHang/services/orderService';
import { message } from 'antd';

export default () => {
	const [danhSach, setDanhSach] = useState<IOrder[]>([]);
	const [record, setRecord] = useState<IOrder | undefined>();
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
	const [sort, setSort] = useState<any>({});
	const [selectedIds, setSelectedIds] = useState<string[] | undefined>();
	const [keyword, setKeyword] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<EOrderStatus | undefined>();
	const [sortBy, setSortBy] = useState<'date' | 'total' | undefined>();
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const getModel = useCallback(async () => {
		setLoading(true);
		try {
			const result = orderService.getOrdersWithFilters(page, limit, {
				keyword,
				status: statusFilter,
				sortBy,
				sortOrder,
			});
			setDanhSach(result.data);
			setTotal(result.total);
		} catch (err: any) {
			message.error(err?.message || 'Lỗi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	}, [page, limit, keyword, statusFilter, sortBy, sortOrder]);

	const getByIdModel = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const result = orderService.getOrderById(id);
			setRecord(result);
			return result;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	}, []);

	const postModel = useCallback(async (payload: any) => {
		setFormSubmiting(true);
		try {
			const id = Date.now().toString();
			const newOrder = orderService.addOrder({
				id,
				...payload,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
			message.success('Thêm mới đơn hàng thành công');
			setVisibleForm(false);
			getModel();
			return newOrder;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi thêm mới đơn hàng');
			throw err;
		} finally {
			setFormSubmiting(false);
		}
	}, [getModel]);

	const putModel = useCallback(async (payload: { id: string; data: any }) => {
		const { id, data } = payload;
		setFormSubmiting(true);
		try {
			const updated = orderService.updateOrder(id, data);
			message.success('Cập nhật đơn hàng thành công');
			setVisibleForm(false);
			getModel();
			return updated;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi cập nhật đơn hàng');
			throw err;
		} finally {
			setFormSubmiting(false);
		}
	}, [getModel]);

	const deleteModel = useCallback(async (id: string) => {
		try {
			orderService.deleteOrder(id);
			message.success('Xóa đơn hàng thành công');
			getModel();
		} catch (err: any) {
			message.error(err?.message || 'Lỗi xóa đơn hàng');
			throw err;
		}
	}, [getModel]);

	const cancelOrder = useCallback(async (id: string) => {
		try {
			orderService.cancelOrder(id);
			message.success('Hủy đơn hàng thành công');
			getModel();
		} catch (err: any) {
			message.error(err?.message || 'Lỗi hủy đơn hàng');
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
		sort, setSort,
		selectedIds, setSelectedIds,
		keyword, setKeyword,
		statusFilter, setStatusFilter,
		sortBy, setSortBy,
		sortOrder, setSortOrder,
		getModel,
		getByIdModel,
		postModel,
		putModel,
		deleteModel,
		cancelOrder,
	};
};
