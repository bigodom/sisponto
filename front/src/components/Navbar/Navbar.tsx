import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import { useAuth } from '../../auth/AuthContext';

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    // Rotas disponíveis de acordo com a role do usuário
    const availableRoutes = [
      { path: "/", label: "Home", roles: ["admin"] },
      { path: "/funcionario", label: "Funcionários", roles: ["admin"] },
      { path: "/ponto", label: "Pontos", roles: ["admin"] },
    ];

    return (
        <nav className="d-flex justify-content-center navbar2">
            {/* Botão do menu mobile */}
            <div
                className={`navbar-mobile-button ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={toggleMobileMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Lista de links filtrados */}
            <ul className={`navbar-list ${isMobileMenuOpen ? 'open' : ''}`}>
                {availableRoutes
                    .filter(route => user && route.roles.includes(user.role)) // Filtra as rotas com base na role do usuário
                    .map(route => (
                        <li key={route.path}>
                            <Link to={route.path} onClick={toggleMobileMenu}>
                                {route.label}
                            </Link>
                        </li>
                    ))}
            </ul>

            {/* Ações do usuário */}
            <div className="user-actions">
                <span>Olá, {user?.name}</span>
                <button className="btn btn-danger" onClick={logout}>
                    <Link to="/user" className="btn">
                        Sair
                    </Link>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;