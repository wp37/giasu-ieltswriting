import { useState, useEffect } from 'react';
import {
    Lock, LogOut, Users, UserCheck, Clock, Trash2,
    CheckCircle, XCircle, Shield, Eye, EyeOff,
    CreditCard, Phone, User, Calendar
} from 'lucide-react';
import {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    validateAdminCredentials,
    getPendingRegistrations,
    getActivatedRegistrations,
    activateUser,
    rejectUser,
    deactivateUser,
    BANK_INFO
} from '../services/authService';
import './Admin.css';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [pendingUsers, setPendingUsers] = useState([]);
    const [activatedUsers, setActivatedUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        setIsLoggedIn(isAdmin());
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            loadUsers();
        }
    }, [isLoggedIn]);

    const loadUsers = () => {
        setPendingUsers(getPendingRegistrations());
        setActivatedUsers(getActivatedRegistrations());
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');

        if (validateAdminCredentials(username, password)) {
            loginAdmin();
            setIsLoggedIn(true);
            setUsername('');
            setPassword('');
        } else {
            setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    const handleLogout = () => {
        logoutAdmin();
        setIsLoggedIn(false);
    };

    const handleActivate = (phone) => {
        activateUser(phone);
        loadUsers();
    };

    const handleReject = (phone) => {
        if (window.confirm('Bạn có chắc muốn từ chối đăng ký này?')) {
            rejectUser(phone);
            loadUsers();
        }
    };

    const handleDeactivate = (phone) => {
        if (window.confirm('Bạn có chắc muốn hủy kích hoạt người dùng này?')) {
            deactivateUser(phone);
            loadUsers();
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Login Form
    if (!isLoggedIn) {
        return (
            <div className="admin-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="login-icon">
                                <Shield size={32} />
                            </div>
                            <h1>Admin Dashboard</h1>
                            <p>Đăng nhập để quản lý hệ thống</p>
                        </div>

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label>
                                    <User size={16} />
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Lock size={16} />
                                    Mật khẩu
                                </label>
                                <div className="password-input">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {loginError && (
                                <div className="login-error">
                                    <XCircle size={16} />
                                    {loginError}
                                </div>
                            )}

                            <button type="submit" className="login-btn">
                                <Lock size={18} />
                                Đăng nhập
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="admin-page">
            <div className="admin-container">
                {/* Header */}
                <header className="admin-header">
                    <div className="header-left">
                        <Shield size={24} />
                        <h1>Admin Dashboard</h1>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        Đăng xuất
                    </button>
                </header>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card pending">
                        <div className="stat-icon">
                            <Clock size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{pendingUsers.length}</span>
                            <span className="stat-label">Chờ duyệt</span>
                        </div>
                    </div>
                    <div className="stat-card active">
                        <div className="stat-icon">
                            <UserCheck size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{activatedUsers.length}</span>
                            <span className="stat-label">Đã kích hoạt</span>
                        </div>
                    </div>
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{pendingUsers.length + activatedUsers.length}</span>
                            <span className="stat-label">Tổng đăng ký</span>
                        </div>
                    </div>
                </div>

                {/* Bank Info Card */}
                <div className="bank-info-card">
                    <div className="bank-card-header">
                        <CreditCard size={20} />
                        <h3>Thông tin nhận thanh toán</h3>
                    </div>
                    <div className="bank-card-content">
                        <div className="bank-qr">
                            <img src={BANK_INFO.qrUrl} alt="QR Code" />
                        </div>
                        <div className="bank-details-admin">
                            <div className="detail-row">
                                <span>Ngân hàng:</span>
                                <strong>{BANK_INFO.bankName}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Số TK:</span>
                                <strong className="account">{BANK_INFO.accountNumber}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Chủ TK:</span>
                                <strong>{BANK_INFO.accountHolder}</strong>
                            </div>
                            <div className="detail-row highlight">
                                <span>Phí:</span>
                                <strong className="amount">{BANK_INFO.amount}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <Clock size={16} />
                        Chờ duyệt ({pendingUsers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'activated' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activated')}
                    >
                        <UserCheck size={16} />
                        Đã kích hoạt ({activatedUsers.length})
                    </button>
                </div>

                {/* User Tables */}
                <div className="users-section">
                    {activeTab === 'pending' && (
                        <div className="users-table-container">
                            {pendingUsers.length === 0 ? (
                                <div className="empty-state">
                                    <Clock size={48} />
                                    <p>Không có đăng ký nào đang chờ duyệt</p>
                                </div>
                            ) : (
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th><User size={14} /> Họ tên</th>
                                            <th><Phone size={14} /> SĐT</th>
                                            <th><Calendar size={14} /> Ngày ĐK</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingUsers.map((user) => (
                                            <tr key={user.phone}>
                                                <td className="name-cell">{user.fullName}</td>
                                                <td className="phone-cell">{user.phone}</td>
                                                <td className="date-cell">{formatDate(user.registeredAt)}</td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="action-btn approve"
                                                        onClick={() => handleActivate(user.phone)}
                                                        title="Duyệt"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleReject(user.phone)}
                                                        title="Từ chối"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'activated' && (
                        <div className="users-table-container">
                            {activatedUsers.length === 0 ? (
                                <div className="empty-state">
                                    <UserCheck size={48} />
                                    <p>Chưa có người dùng nào được kích hoạt</p>
                                </div>
                            ) : (
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th><User size={14} /> Họ tên</th>
                                            <th><Phone size={14} /> SĐT</th>
                                            <th><Calendar size={14} /> Ngày ĐK</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activatedUsers.map((user) => (
                                            <tr key={user.phone}>
                                                <td className="name-cell">{user.fullName}</td>
                                                <td className="phone-cell">{user.phone}</td>
                                                <td className="date-cell">{formatDate(user.registeredAt)}</td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="action-btn deactivate"
                                                        onClick={() => handleDeactivate(user.phone)}
                                                        title="Hủy kích hoạt"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
