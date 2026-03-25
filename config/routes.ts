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
        path: '/quan-ly-van-bang/tra-cuu', // Đã chuyển vào trong Quản lý
        name: 'Tra cứu văn bằng',
        component: './TraCuuVanBang',
      },
    ],
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
