import { ICustomer } from '../typing';

const CUSTOMERS_KEY = 'order_customers';

const INITIAL_CUSTOMERS: ICustomer[] = [
	{
		id: '1',
		code: 'KH001',
		name: 'Công ty ABC Ltd',
		phone: '0912345678',
		email: 'abc@company.com',
		address: 'Số 1, Đường Lê Lợi, Hà Nội',
		createdAt: Date.now(),
	},
	{
		id: '2',
		code: 'KH002',
		name: 'Cửa hàng XYZ',
		phone: '0987654321',
		email: 'xyz@shop.com',
		address: 'Số 10, Đường Trần Hưng Đạo, TP.HCM',
		createdAt: Date.now(),
	},
	{
		id: '3',
		code: 'KH003',
		name: 'Tập đoàn Tech Vietnam',
		phone: '0901234567',
		email: 'tech@vietnam.com',
		address: 'Số 5, Đường Nguyễn Huệ, Đà Nẵng',
		createdAt: Date.now(),
	},
	{
		id: '4',
		code: 'KH004',
		name: 'Nhân viên bán hàng',
		phone: '0909876543',
		email: 'sales@company.com',
		address: 'Số 20, Đường Hoàng Văn Thụ, Hà Nội',
		createdAt: Date.now(),
	},
	{
		id: '5',
		code: 'KH005',
		name: 'Khách hàng cá nhân',
		phone: '0908765432',
		email: 'customer@email.com',
		address: 'Số 15, Đường Đinh Bộ Lĩnh, TP.HCM',
		createdAt: Date.now(),
	},
];

export const customerService = {
	getCustomers: (): ICustomer[] => {
		const data = localStorage.getItem(CUSTOMERS_KEY);
		if (!data) {
			localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
			return INITIAL_CUSTOMERS;
		}
		return JSON.parse(data);
	},

	saveCustomers: (customers: ICustomer[]) => {
		localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
	},

	getCustomerById: (id: string): ICustomer | undefined => {
		return customerService.getCustomers().find((c) => c.id === id);
	},

	getCustomerByCode: (code: string): ICustomer | undefined => {
		return customerService.getCustomers().find((c) => c.code === code);
	},

	addCustomer: (customer: ICustomer): ICustomer => {
		if (customerService.getCustomerByCode(customer.code)) {
			throw new Error(`Mã khách hàng "${customer.code}" đã tồn tại`);
		}
		const customers = customerService.getCustomers();
		customers.push(customer);
		customerService.saveCustomers(customers);
		return customer;
	},

	updateCustomer: (id: string, updates: Partial<ICustomer>): ICustomer => {
		const customers = customerService.getCustomers();
		const index = customers.findIndex((c) => c.id === id);
		if (index === -1) throw new Error('Khách hàng không tồn tại');

		// Check if changing code to duplicate
		if (updates.code && updates.code !== customers[index].code) {
			if (customerService.getCustomerByCode(updates.code)) {
				throw new Error(`Mã khách hàng "${updates.code}" đã tồn tại`);
			}
		}

		customers[index] = { ...customers[index], ...updates } as any;
		customerService.saveCustomers(customers);
		return customers[index];
	},

	deleteCustomer: (id: string): void => {
		const customers = customerService.getCustomers();
		const filtered = customers.filter((c) => c.id !== id);
		customerService.saveCustomers(filtered);
	},

	searchCustomers: (
		keyword: string,
		page: number = 1,
		limit: number = 10,
	): { data: ICustomer[]; total: number } => {
		const customers = customerService.getCustomers();
		const filtered = customers.filter(
			(c) =>
				c.code.toLowerCase().includes(keyword.toLowerCase()) ||
				c.name.toLowerCase().includes(keyword.toLowerCase()),
		);
		const start = (page - 1) * limit;
		const end = start + limit;
		return {
			data: filtered.slice(start, end),
			total: filtered.length,
		};
	},
};
