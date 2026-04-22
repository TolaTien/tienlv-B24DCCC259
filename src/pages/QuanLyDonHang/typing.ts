// Order Status Enum
export enum EOrderStatus {
	PENDING = 'PENDING', // Chờ xác nhận
	SHIPPING = 'SHIPPING', // Đang giao
	COMPLETED = 'COMPLETED', // Hoàn thành
	CANCELLED = 'CANCELLED', // Hủy
}

export const OrderStatusLabels: Record<EOrderStatus, string> = {
	[EOrderStatus.PENDING]: 'Chờ xác nhận',
	[EOrderStatus.SHIPPING]: 'Đang giao',
	[EOrderStatus.COMPLETED]: 'Hoàn thành',
	[EOrderStatus.CANCELLED]: 'Hủy',
};

// Customer Type
export interface ICustomer {
	id: string;
	code: string; // Mã khách hàng (unique)
	name: string;
	phone?: string;
	email?: string;
	address?: string;
	createdAt: number; // timestamp
}

// Product Type
export interface IProduct {
	id: string;
	code: string; // Mã sản phẩm
	name: string;
	price: number;
	quantity?: number;
	description?: string;
	createdAt: number; // timestamp
}

// Order Item Type (Product trong Order)
export interface IOrderItem {
	productId: string;
	productCode: string;
	productName: string;
	quantity: number;
	price: number; // giá tại thời điểm tạo order
	total: number; // quantity * price
}

// Order Type
export interface IOrder {
	id: string;
	code: string; // Mã đơn hàng (unique)
	customerId: string;
	customerCode: string;
	customerName: string;
	orderDate: number; // timestamp
	items: IOrderItem[];
	totalAmount: number; // tổng tiền
	status: EOrderStatus;
	notes?: string;
	createdAt: number;
	updatedAt: number;
}
