<<<<<<< HEAD
import component from "@/locales/en-US/component";
import route from "mock/route";
import path from "path";
import { Redirect } from "react-router";

export default [
=======
﻿export default [
>>>>>>> f20ce78d87911c983c0fd78dc6ffe66c230a00bf
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
<<<<<<< HEAD
	},
	{
		path: '/people24',
		name: 'People24',
		component: './People24',
		icon: 'UserOutlined',
=======
>>>>>>> f20ce78d87911c983c0fd78dc6ffe66c230a00bf
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
<<<<<<< HEAD
        // config/routes.ts
=======
        
>>>>>>> f20ce78d87911c983c0fd78dc6ffe66c230a00bf
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
<<<<<<< HEAD

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

=======
{
    path: '/clb-va-dang-ky',
    name: 'Hệ thống CLB',
    icon: 'TeamOutlined',
    routes: [
        {
            path: '/clb-va-dang-ky',
            redirect: '/clb-va-dang-ky/clb',
        },
        {
            name: 'Quản lý Câu lạc bộ',
            path: '/clb-va-dang-ky/clb',
            component: './CLB',
        },
        {
            name: 'Quản lý Đơn đăng ký',
            path: '/clb-va-dang-ky/dang-ky',
            component: './Registration',
        },
        {
            name: 'Quản lý Thành viên',
            path: '/clb-va-dang-ky/thanh-vien',
            component: './MemberManagement',
        },
        {
            name: 'Thống kê & Báo cáo',
            path: '/clb-va-dang-ky/thong-ke',
            component: './Dashboard',
            hideInMenu: false,
        },
    ],
},
{
    path: '/quan-ly-van-bang',
    name: 'Quản lý văn bằng',
    icon: 'book',
    routes: [
      {
        path: '/quan-ly-van-bang/so-van-bang',
        name: 'Sổ văn bằng',
        component: './QuanLyVanBang/SoVanBang',
      },
      {
        path: '/quan-ly-van-bang/quyet-dinh',
        name: 'Quyết định tốt nghiệp',
        component: './QuanLyVanBang/QuyetDinh',
      },
      {
        path: '/quan-ly-van-bang/cau-hinh-bieu-mau',
        name: 'Cấu hình biểu mẫu',
        component: './QuanLyVanBang/CauHinhBieuMau',
      },
      {
        path: '/quan-ly-van-bang/thong-tin',
        name: 'Thông tin văn bằng',
        component: './QuanLyVanBang/ThongTinVanBang',
      },
      {
        path: '/quan-ly-van-bang/tra-cuu',
        name: 'Tra cứu văn bằng',
        component: './TraCuuVanBang',
      },
    ],
  },
>>>>>>> f20ce78d87911c983c0fd78dc6ffe66c230a00bf
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
