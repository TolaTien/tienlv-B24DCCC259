import component from "@/locales/en-US/component";
import route from "mock/route";
import path from "path";
import { Redirect } from "react-router";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/doan-so',
		name: 'GuestNumber',
		component: './GuestNumber',
		icon: 'AndroidOutlined'
	},
	{
		path: '/keo-bua-bao',
		name: 'KeoBuabao',
		component: './KeoBuaBao',
		icon: 'ScissorOutlined'
	},
	{
		path: '/todolist',
		name: 'Todolist',
		component: './Todolist',
		icon: 'UnorderedListOutlined'
	},
	// {
	// 	path: '/Game',
	// 	name: 'Game',
	// },
{
        name: 'Quản lý Ngân hàng',
        path: '/bai-2',
        icon: 'DatabaseOutlined',
        routes: [
            {
                path: '/bai-2',
                redirect: '/bai-2/questions', 
            },
            {
                name: 'Khối kiến thức',
                path: '/bai-2/knowledge-blocks',
                component: './KnowledgeBlockPage',
            },
            {
                name: 'Danh mục Môn học',
                path: '/bai-2/subjects',
                component: './SubjectManagementPage',
            },
            {
                name: 'Quản lý Câu hỏi',
                path: '/bai-2/questions',
                component: './QuestionManagement',
            },
            {
                name: 'Quản lý Đề thi',
                path: '/bai-2/exams',
                component: './ExamManagementPage',
            },
        ],
    },
{
    name: 'Hệ thống Đặt lịch',
    path: '/dat-lich',
    icon: 'ScheduleOutlined',
    routes: [
        {
            path: '/dat-lich',
            redirect: '/dat-lich/lich-hen', 
        },
        // config/routes.ts
		{
		name: 'Thống kê & Báo cáo',
		path: '/dat-lich/thong-ke',
		component: './HeThongDatLich/pages/DashBoard/ThongKePage', 
		},
        {
            name: 'Quản lý Dịch vụ',
            path: '/dat-lich/dich-vu',
            component: './Nhanvienvadichvu/DichVuPage',
        },
        {
            name: 'Quản lý Nhân viên',
            path: '/dat-lich/nhan-vien',
            component: './Nhanvienvadichvu/NhanVienPage',
        },
{
    name: 'Quản lý Lịch hẹn',
    path: '/dat-lich/lich-hen',
    component: './appointments',
},
        {
            name: 'Đánh giá & Phản hồi',
            path: '/dat-lich/danh-gia',
            // component: './Reviews/DanhGiaPage',
        },
    ],
},











	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
