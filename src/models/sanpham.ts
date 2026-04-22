import { useState, useCallback } from 'react';
import { IProduct } from '@/pages/QuanLyDonHang/typing';
import { productService } from '@/pages/QuanLyDonHang/services/productService';
import { message } from 'antd';

export default () => {
	const [danhSach, setDanhSach] = useState<IProduct[]>([]);
	const [record, setRecord] = useState<IProduct | undefined>();
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
			const products = productService.getProducts();

			let filtered = products;
			if (keyword) {
				filtered = products.filter(
					(p) =>
						p.code.toLowerCase().includes(keyword.toLowerCase()) ||
						p.name.toLowerCase().includes(keyword.toLowerCase()),
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
			const result = productService.getProductById(id);
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
			const products = productService.getProducts();
			setDanhSach(products);
			return products;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi tải dữ liệu');
		}
	}, []);

	const postModel = useCallback(async (payload: any) => {
		setFormSubmiting(true);
		try {
			const id = Date.now().toString();
			const newProduct = productService.addProduct({
				id,
				...payload,
				createdAt: Date.now(),
			});
			message.success('Thêm mới sản phẩm thành công');
			setVisibleForm(false);
			getModel();
			return newProduct;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi thêm mới sản phẩm');
			throw err;
		} finally {
			setFormSubmiting(false);
		}
	}, [getModel]);

	const putModel = useCallback(async (payload: { id: string; data: any }) => {
		const { id, data } = payload;
		setFormSubmiting(true);
		try {
			const updated = productService.updateProduct(id, data);
			message.success('Cập nhật sản phẩm thành công');
			setVisibleForm(false);
			getModel();
			return updated;
		} catch (err: any) {
			message.error(err?.message || 'Lỗi cập nhật sản phẩm');
			throw err;
		} finally {
			setFormSubmiting(false);
		}
	}, [getModel]);

	const deleteModel = useCallback(async (id: string) => {
		try {
			productService.deleteProduct(id);
			message.success('Xóa sản phẩm thành công');
			getModel();
		} catch (err: any) {
			message.error(err?.message || 'Lỗi xóa sản phẩm');
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
