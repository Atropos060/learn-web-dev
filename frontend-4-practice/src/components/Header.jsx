function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#" className="logo-link">
          <span className="logo-text">LOGO</span>
        </a>
        <nav className="main-navigation" aria-label="Основное меню">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#" className="nav-link">Услуги</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Галерея</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Команда</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Отзывы</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Контакты</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
