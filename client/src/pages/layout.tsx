import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="layout-container">
            <header className="layout-header">
                <h1>Fitness Tracker - Your Personal Trainer</h1>
                <nav className="layout-nav">
                    <ul className="layout-nav-list">
                        <li className="layout-nav-item">
                            <Link to="/" className="layout-nav-link">
                                Dashboard
                            </Link>
                        </li>
                        <li className="layout-nav-item">
                            <Link to="/profile" className="layout-nav-link">
                                Profile
                            </Link>
                        </li>
                        <li className="layout-nav-item">
                            <Link to="/food-log" className="layout-nav-link">
                                Food Log
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="layout-main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
