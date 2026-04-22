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
		icon: 'AndroidOutlined',
	},
	{
		path: '/keo-bua-bao',
		name: 'KeoBuabao',
		component: './KeoBuaBao',
		icon: 'ScissorOutlined',
	},
	{
		path: '/todolist',
		name: 'Todolist',
		component: './Todolist',
		icon: 'UnorderedListOutlined',
	},
	{
		path: '/people24',
		name: 'People24',
		component: './People24',
		icon: 'UserOutlined',
	},
  {
    path: '/travel',
    name: 'Kế hoạch du lịch',
    icon: 'GlobalOutlined',
    routes: [
      {
        path: '/travel',
        redirect: '/travel/explore',
      },
      {
        path: '/travel/explore',
        name: 'Khám phá điểm đến',
        component: './Travel/Explore',
      },
      {
        path: '/travel/schedule',
        name: 'Tạo lịch trình',
        component: './Travel/Schedule',
      },
      {
        path: '/travel/admin',
        name: 'Quản trị & Thống kê',
        component: './Travel/Admin',
      },
    ],
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
            component: './Review/DanhGiaPage',
        },
    ],
},

{
    name: 'Quản lý Câu lạc bộ',
    path: '/quan-ly-clb',
    icon: 'TeamOutlined',
    routes: [
		{
			path: '/quan-ly-clb',
			redirect: '/quan-ly-clb/danh-sach',
		},
		{
			name: 'Thống kê & Báo cáo',
			path: '/quan-ly-clb/thong-ke',
			component: './QuanLyCauLacBo/ThongKePage',
		},
		{
			name: 'Danh sách CLB',
			path: '/quan-ly-clb/danh-sach',
			component: './QuanLyCauLacBo/ClubPage',
		},
		{
			name: 'Quản lý Đơn đăng ký',
			path: '/quan-ly-clb/don-dang-ky',
			component: './QuanLyCauLacBo/RegistrationPage',
		},
		{
			name: 'Danh sách Thành viên',
			path: '/quan-ly-clb/thanh-vien',
			component: './QuanLyCauLacBo/MemberPage',
		},
		],
	},

	{
		name: 'Lập kế hoạch du lịch',
		path: '/lap-ke-hoach-du-lich',
		icon: 'RocketOutlined',
		routes: [
			{
				path: '/lap-ke-hoach-du-lich',
				redirect: '/lap-ke-hoach-du-lich/kham-pha',
			},
			{
				name: 'Khám phá điểm đến',
				path: '/lap-ke-hoach-du-lich/kham-pha',
				component: './LapKeHoachDuLich/Home',
			},
			{
				name: 'Lập lịch trình',
				path: '/lap-ke-hoach-du-lich/lich-trinh',
				component: './LapKeHoachDuLich/Planner',
			},
			{
				name: 'Quản trị điểm đến',
				path: '/lap-ke-hoach-du-lich/admin',
				component: './LapKeHoachDuLich/Admin',
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
		name: 'Quản lý Công việc Nhóm',
		path: '/group-task',
		icon: 'CheckSquareOutlined',
		component: './GroupTask',
	},

	{
		name: 'Quản lý Đơn hàng',
		path: '/quanly/donhang',
		icon: 'ShoppingCartOutlined',
		component: './QuanLyDonHang/Home',
	},

	{
		path: '/notification',
		routes: [
			{
				path: '/notification/subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: '/notification/check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: '/notification',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},

	{
		path: '/',
		redirect: '/dashboard',
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
