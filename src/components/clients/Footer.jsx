import React from 'react';
import './Footer.css'; // tách CSS ra file riêng nếu muốn

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <div className="logo">🎬 Movie<span>Galaxy</span></div>
          <p>Nền tảng xem phim trực tuyến với hàng ngàn bộ phim và series đa thể loại, cập nhật liên tục mỗi ngày.</p>
          <div className="social-links">
            <a className="social-btn" href="#">f</a>
            <a className="social-btn" href="#">▶</a>
            <a className="social-btn" href="#">✈</a>
            <a className="social-btn" href="#">◈</a>
          </div>
        </div>

        {/* Danh mục */}
        <div className="footer-section">
          <h4>Danh Mục</h4>
          <ul>
            {['Phim Lẻ','Phim Bộ','Phim Chiếu Rạp','Hoạt Hình','TV Show','Phim 18+'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Quốc gia */}
        <div className="footer-section">
          <h4>Quốc Gia</h4>
          <ul>
            {['Việt Nam','Hàn Quốc','Trung Quốc','Nhật Bản','Mỹ','Thái Lan'].map(q => (
              <li key={q}><a href="#">Phim {q}</a></li>
            ))}
          </ul>
        </div>

        {/* Thể loại */}
        <div className="footer-section">
          <h4>Thể Loại Hot</h4>
          <p className="genre-desc">Khám phá phim theo thể loại yêu thích</p>
          <div className="genre-tags">
            {['Chính kịch','Tâm lý','Tình cảm','Phiêu lưu','Hài hước','Kinh dị','Hành động','Viễn tưởng'].map(g => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="disclaimer">
        ⚠️ MovieGalaxy không lưu trữ bất kỳ nội dung phim nào trên máy chủ. Tất cả nội dung được nhúng từ các nguồn bên thứ ba. Nếu có vi phạm bản quyền, vui lòng liên hệ để được xử lý.
      </div>

      <div className="footer-bottom">
        <p>© 2026 <span>MovieGalaxy</span>. Tất cả quyền được bảo lưu.</p>
        <div className="bottom-links">
          <a href="#">Điều khoản</a>
          <a href="#">Chính sách</a>
          <a href="#">Liên hệ</a>
          <a href="#">Báo lỗi</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;