import { IProduct } from '../typing';

const PRODUCTS_KEY = 'order_products';

const INITIAL_PRODUCTS: IProduct[] = [
	{
		id: '1',
		code: 'SP001',
		name: 'Laptop Dell XPS 13',
		price: 25000000,
		quantity: 50,
		description: 'Laptop mỏng nhẹ hiệu năng cao',
		createdAt: Date.now(),
	},
	{
		id: '2',
		code: 'SP002',
		name: 'Chuột Logitech MX Master',
		price: 1500000,
		quantity: 200,
		description: 'Chuột không dây chuyên nghiệp',
		createdAt: Date.now(),
	},
	{
		id: '3',
		code: 'SP003',
		name: 'Bàn phím Mechanical RGB',
		price: 2500000,
		quantity: 100,
		description: 'Bàn phím cơ gaming',
		createdAt: Date.now(),
	},
	{
		id: '4',
		code: 'SP004',
		name: 'Monitor LG 27 inch',
		price: 5000000,
		quantity: 30,
		description: 'Màn hình 4K UltraHD',
		createdAt: Date.now(),
	},
	{
		id: '5',
		code: 'SP005',
		name: 'Webcam Logitech 4K',
		price: 800000,
		quantity: 150,
		description: 'Webcam chất lượng cao',
		createdAt: Date.now(),
	},
];

export const productService = {
	getProducts: (): IProduct[] => {
		const data = localStorage.getItem(PRODUCTS_KEY);
		if (!data) {
			localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
			return INITIAL_PRODUCTS;
		}
		return JSON.parse(data);
	},

	saveProducts: (products: IProduct[]) => {
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
	},

	getProductById: (id: string): IProduct | undefined => {
		return productService.getProducts().find((p) => p.id === id);
	},

	getProductByCode: (code: string): IProduct | undefined => {
		return productService.getProducts().find((p) => p.code === code);
	},

	addProduct: (product: IProduct): IProduct => {
		if (productService.getProductByCode(product.code)) {
			throw new Error(`Mã sản phẩm "${product.code}" đã tồn tại`);
		}
		const products = productService.getProducts();
		products.push(product);
		productService.saveProducts(products);
		return product;
	},

	updateProduct: (id: string, updates: Partial<IProduct>): IProduct => {
		const products = productService.getProducts();
		const index = products.findIndex((p) => p.id === id);
		if (index === -1) throw new Error('Sản phẩm không tồn tại');

		// Check if changing code to duplicate
		if (updates.code && updates.code !== products[index].code) {
			if (productService.getProductByCode(updates.code)) {
				throw new Error(`Mã sản phẩm "${updates.code}" đã tồn tại`);
			}
		}

		products[index] = { ...products[index], ...updates, updatedAt: Date.now() } as any;
		productService.saveProducts(products);
		return products[index];
	},

	deleteProduct: (id: string): void => {
		const products = productService.getProducts();
		const filtered = products.filter((p) => p.id !== id);
		productService.saveProducts(filtered);
	},

	searchProducts: (
		keyword: string,
		page: number = 1,
		limit: number = 10,
	): { data: IProduct[]; total: number } => {
		const products = productService.getProducts();
		const filtered = products.filter(
			(p) =>
				p.code.toLowerCase().includes(keyword.toLowerCase()) ||
				p.name.toLowerCase().includes(keyword.toLowerCase()),
		);
		const start = (page - 1) * limit;
		const end = start + limit;
		return {
			data: filtered.slice(start, end),
			total: filtered.length,
		};
	},
};
