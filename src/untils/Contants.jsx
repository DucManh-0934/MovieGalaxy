import { FaBell, FaChessKing, FaHandPaper, FaHeart, FaHistory, FaList, FaUser } from "react-icons/fa";
import { FaPhotoFilm } from "react-icons/fa6";
import { MdOutlineCellWifi } from "react-icons/md";
import LOGO from "../assets/logo.png";

export const logo = LOGO;
export const LISTMENU = [
  {
    icon: <FaPhotoFilm />,
    title: "Media Management",
    subMenu: [
      {
        name: "Movies",
        path: "/admin/movies",
      },
      {
        name: "Episodes",
        path: "/admin/episodes",
      },
      {
        name: "Sections",
        path: "/admin/sections",
      },
    ],
  },
  {
    icon: <FaChessKing />,
    title: "Vip",
    subMenu: [
      {
        name: "Packages",
        path: "/admin/packages",
      },
      {
        name: "Features",
        path: "/admin/features",
      },
      {
        name: "Plans",
        path: "/admin/plans",
      },
    ],
  },
  {
    icon: <FaHandPaper />,
    title: "MetaData",
    subMenu: [
      {
        name: "Categories",
        path: "/admin/categories",
      },
      {
        name: "Movie_type",
        path: "/admin/movie_type",
      },
    ],
  },
  {
    icon: <MdOutlineCellWifi />,
    title: "Cast & Crew",
    subMenu: [
      {
        name: "Authors",
        path: "/admin/authors",
      },
      {
        name: "Characters",
        path: "/admin/characters",
      },
      {
        name: "Actors",
        path: "/admin/actors",
      },
    ],
  },
];
export const initialOptions = {
  "client-id": "Ae1gNvniG4xbGsr_e5joj0m5WGau5kisTS_4VWlz82K9c4FnKE-kE-OhXYyEbBk-8IM_k3BGrNisndJm",
  currency: "USD",
  intent: "capture"
};
export const upload_preset = "GalaxyMovie";
export const cloud_name = "dffgluvky";

export const demoMovie = [
  "https://dep.com.vn/wp-content/uploads/2019/12/phim-dien-anh-avengers-endgame.jpg",
  "https://static2.vieon.vn/vieplay-image/carousel_web_v4_ntc/2022/02/16/oqyx9dae_1920x1080-songdu-khongtitle_1920_1080.webp?w=1920&q=38",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAmozF09E10yaLGMhDiUYQuPS58B5tJ2q4QA&s",
  "https://bcp.cdnchinhphu.vn/334894974524682240/2023/4/19/nguyen-tac-phan-loai-phim-1681809768732597109738-113-0-762-1038-crop-16818097747631607022540-1681869948152579212044.jpg",
  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_2_18_638438969275402700_poster-phim.jpg",
  "https://dep.com.vn/wp-content/uploads/2019/12/phim-dien-anh-avengers-endgame.jpg",
  "https://static2.vieon.vn/vieplay-image/carousel_web_v4_ntc/2022/02/16/oqyx9dae_1920x1080-songdu-khongtitle_1920_1080.webp?w=1920&q=38",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAmozF09E10yaLGMhDiUYQuPS58B5tJ2q4QA&s",
  "https://bcp.cdnchinhphu.vn/334894974524682240/2023/4/19/nguyen-tac-phan-loai-phim-1681809768732597109738-113-0-762-1038-crop-16818097747631607022540-1681869948152579212044.jpg",
  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_2_18_638438969275402700_poster-phim.jpg",
];
export const countries = [
  "Việt Nam",
  "Mỹ",
  "Anh",
  "Hàn Quốc",
  "Nhật Bản",
  "Trung Quốc",
  "Ấn Độ",
  "Thái Lan",
  "Pháp",
  "Tây Ban Nha",
];
export const card = [
  "Sci-Fi",
  "Thailand",
  "Horror",
  "Theatrical",
  "Historical",
  "War",
];
export const LISTINFOR = [
  {
    Icon: <FaHeart />,
    title: "Yêu Thích",
    name: "YeuThich",
    path: "/auinformation/favourite",
  },
  {
    Icon: <FaList/>,
    title: "Danh Sách",
    name: "DanhSach",
    path: "/auinformation/listMovie",
  },
  {
    Icon: <FaHistory/>,
    title: "Xem Tiếp",
    name: "XemTiep",
    path: "/auinformation/continued",
  },
  {
    Icon: <FaBell/>,
    title: "Thông Báo",
    name: "ThongBao",
    path: "/auinformation/notification",
  },
  {
    Icon: <FaUser/>,
    title: "Phim Đang Thuê",
    name: "phimthue",
    path: "/auinformation/filmrent",
  },
  {
    Icon: <FaUser/>,
    title: "Tài Khoản",
    name: "TaiKHoan",
    path: "/auinformation",
  },
];
export const ROLES = {
  ADMIN: 'admin',        // Quản trị viên cấp cao
  MODERATOR: 'moderator', // Quản trị viên cấp trung (người kiểm duyệt)
  USER: 'user',          // Người dùng thông thường
};