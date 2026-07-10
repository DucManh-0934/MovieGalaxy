import React from "react";
import { 
  FaChartLine, 
  FaHeart, 
  FaFolderOpen, 
  FaBolt, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCommentAlt,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";

function Comment() {
  const topComments = [
    { id: 1, user: "toan pham", content: "Ra full 81 tap di admin :((((", avatar: "https://i.pravatar.cc/100?u=1", poster: "https://via.placeholder.com/40x60" },
    { id: 2, user: "han", content: "phim ni dth vãi đúng tâm đắc", avatar: "https://i.pravatar.cc/100?u=2", poster: "https://via.placeholder.com/40x60" },
    { id: 3, user: "kien nguyen ngoc", content: "Hay", avatar: "https://i.pravatar.cc/100?u=3", poster: "https://via.placeholder.com/40x60" },
    { id: 4, user: "Miumun", content: "Cho em hỏi đây có phải 2 real ko ạ? Em thấy web này giống Rophim cũ quá ạ", avatar: "https://i.pravatar.cc/100?u=4", poster: "https://via.placeholder.com/40x60" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-6 text-gray-300 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-xl">🏆</span>
            <h2 className="text-white font-bold uppercase tracking-wider">Top Bình Luận</h2>
          </div>
          
          <div className="relative group">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {topComments.map((item) => (
                <div key={item.id} className="min-w-[300px] flex-1 bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img src={item.avatar} className="w-10 h-10 rounded-full border border-gray-600" alt="avatar" />
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          {item.user} <span className="text-yellow-500 text-xs">∞</span>
                        </p>
                      </div>
                    </div>
                    <img src={item.poster} className="w-10 h-14 rounded shadow-lg object-cover" alt="movie-poster" />
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10 italic">"{item.content}"</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <button className="flex items-center gap-1 hover:text-white"><FaThumbsUp /> 0</button>
                    <button className="flex items-center gap-1 hover:text-white"><FaThumbsDown /> 0</button>
                    <button className="flex items-center gap-1 hover:text-white"><FaCommentAlt /> 0</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute -left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full border border-white/10 hover:bg-white/10"><FaChevronLeft /></button>
            <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full border border-white/10 hover:bg-white/10"><FaChevronRight /></button>
          </div>
        </section>

        <hr className="border-white/5" />

        {/* SECTION: GRID BOTTOM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Bảng 1: Sôi nổi nhất */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-6 text-sm">
              <FaChartLine className="text-yellow-500" /> SÔI NỔI NHẤT
            </h3>
            <ul className="space-y-4">
              {[
                {id: 1, name: "Nguyệt Lân Ý Kỷ"},
                {id: 2, name: "Tiếng yêu này anh dịch được không?"},
                {id: 3, name: "Trục Ngọc"},
                {id: 4, name: "The Boys"},
                {id: 5, name: "Mộ Tư Từ"}
              ].map((m) => (
                <li key={m.id} className="flex items-center gap-3 group cursor-pointer">
                  <span className="text-gray-600 text-sm w-4">{m.id}.</span>
                  <FaChartLine className="text-green-500 text-xs" />
                  <img src="https://via.placeholder.com/30x40" className="w-7 h-9 rounded object-cover border border-white/10" alt="thumb" />
                  <span className="text-sm group-hover:text-yellow-500 transition-colors truncate">{m.name}</span>
                </li>
              ))}
            </ul>
            <button className="text-gray-500 text-xs mt-6 hover:text-white transition-colors">Xem thêm</button>
          </div>

          {/* Bảng 2: Yêu thích nhất */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-6 text-sm">
              <FaHeart className="text-yellow-500" /> YÊU THÍCH NHẤT
            </h3>
            <button className="text-gray-500 text-xs hover:text-white transition-colors">Xem thêm</button>
          </div>

          {/* Bảng 3: Thể loại hot */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-6 text-sm">
              <FaFolderOpen className="text-yellow-500" /> THỂ LOẠI HOT
            </h3>
            <div className="space-y-3">
              {[
                {n: "Chính kịch", color: "bg-pink-600/20 text-pink-400"},
                {n: "Tâm lý", color: "bg-blue-600/20 text-blue-400"},
                {n: "Tình cảm", color: "bg-purple-600/20 text-purple-400"},
                {n: "Phiêu lưu", color: "bg-green-600/20 text-green-400"},
                {n: "Hài hước", color: "bg-orange-600/20 text-orange-400"},
              ].map((tag, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm w-4">{i + 1}.</span>
                  <FaChartLine className={i === 4 ? "text-pink-500 text-xs rotate-180" : "text-green-500 text-xs"} />
                  <span className={`${tag.color} px-3 py-1 rounded-full text-[11px] font-medium min-w-[80px] text-center`}>
                    {tag.n}
                  </span>
                </div>
              ))}
            </div>
            <button className="text-gray-500 text-xs mt-6 hover:text-white transition-colors">Xem thêm</button>
          </div>

          {/* Bảng 4: Bình luận mới */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-6 text-sm">
              <FaBolt className="text-yellow-500" /> BÌNH LUẬN MỚI
            </h3>
            <div className="space-y-3">
              {[
                {u: "Cha Eun Woo", m: "Nữ Hoàng Nước Mắt", c: "hay vcl luon nha ae"},
                {u: "Khaah_ly ctee~", m: "Nguyệt Lân Ý Kỷ", c: "Hay vaio"},
                {u: "han", m: "Đội Cầu Lông Thiếu Niên", c: "phim ni dth vãi đúng tâm đắc"}
              ].map((comm, i) => (
                <div key={i} className="bg-white/[0.03] hover:bg-white/[0.08] p-3 rounded-lg border border-white/5 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={`https://i.pravatar.cc/30?u=${i+10}`} className="w-6 h-6 rounded-full" alt="avt" />
                    <span className="text-xs font-bold text-gray-200">{comm.u}</span>
                  </div>
                  <div className="pl-8">
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                      <span className="text-[8px]">▶</span> {comm.m}
                    </p>
                    <p className="text-xs text-gray-300 italic">"{comm.c}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Comment;