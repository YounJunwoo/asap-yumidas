import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="https://kamis.or.kr/customer/main/main.do" className="footer-link">한국농수산식품유통공사</a>
          <a href="https://www.nongnet.or.kr/front/index.do" className="footer-link">농넷</a>
          <a href="https://www.mafra.go.kr/sites/home/index.do" className="footer-link">농림축산식품부</a>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-copyright">
          © Copyright 2025, All Rights Reserved by ASAP
        </div>
      </div>
    </footer>
  );
};

export default Footer;