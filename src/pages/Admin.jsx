import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FileText,
    TrendingUp,
    Users,
    Clock,
    Activity,
    RefreshCw,
    Trash2,
    Eye
} from 'lucide-react';
import { apiKeyService } from '../services/apiKeyService';
import './Admin.css';

// Get submissions from localStorage
const getSubmissions = () => {
    try {
        const data = localStorage.getItem('ielts_submissions');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// Clear all submissions
const clearSubmissions = () => {
    localStorage.removeItem('ielts_submissions');
};

function Admin() {
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        avgBand: 0,
        modelUsed: ''
    });
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allSubmissions = getSubmissions();
        setSubmissions(allSubmissions);

        // Calculate stats
        const today = new Date().toDateString();
        const todaySubmissions = allSubmissions.filter(s =>
            new Date(s.timestamp).toDateString() === today
        );

        const avgBand = allSubmissions.length > 0
            ? (allSubmissions.reduce((sum, s) => sum + (s.evaluation?.overallBand || 0), 0) / allSubmissions.length).toFixed(1)
            : 0;

        setStats({
            total: allSubmissions.length,
            today: todaySubmissions.length,
            avgBand,
            modelUsed: apiKeyService.getSelectedModel()
        });
    };

    const handleClearData = () => {
        if (window.confirm('Xác nhận xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác.')) {
            setIsClearing(true);
            setTimeout(() => {
                clearSubmissions();
                loadData();
                setIsClearing(false);
            }, 500);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-title">
                    <LayoutDashboard size={28} />
                    <h1>Admin Dashboard</h1>
                </div>
                <div className="admin-actions">
                    <button className="btn-refresh" onClick={loadData}>
                        <RefreshCw size={18} />
                        <span>Làm mới</span>
                    </button>
                    <button className="btn-clear" onClick={handleClearData} disabled={isClearing}>
                        <Trash2 size={18} />
                        <span>{isClearing ? 'Đang xóa...' : 'Xóa dữ liệu'}</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card gradient-1">
                    <div className="stat-icon">
                        <FileText size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Tổng bài đã chấm</span>
                    </div>
                </div>

                <div className="stat-card gradient-2">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.today}</span>
                        <span className="stat-label">Submissions hôm nay</span>
                    </div>
                </div>

                <div className="stat-card gradient-3">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.avgBand}</span>
                        <span className="stat-label">Điểm trung bình</span>
                    </div>
                </div>

                <div className="stat-card gradient-4">
                    <div className="stat-icon">
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value truncate">{stats.modelUsed.split('-').pop()}</span>
                        <span className="stat-label">Model đang dùng</span>
                    </div>
                </div>
            </div>

            {/* Recent Submissions Table */}
            <div className="table-container glass-card">
                <div className="table-header">
                    <h2>Lịch sử Submissions</h2>
                    <span className="table-count">{submissions.length} bài</span>
                </div>

                {submissions.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Task Type</th>
                                    <th>Word Count</th>
                                    <th>Overall Band</th>
                                    <th>TA</th>
                                    <th>CC</th>
                                    <th>LR</th>
                                    <th>GR</th>
                                    <th>Thời gian</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.slice().reverse().map((sub, index) => (
                                    <tr key={sub.id || index}>
                                        <td className="td-id">{submissions.length - index}</td>
                                        <td>
                                            <span className={`task-badge ${sub.taskType}`}>
                                                {sub.taskType?.toUpperCase() || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{sub.wordCount || '-'}</td>
                                        <td>
                                            <span className={`band-score band-${Math.floor(sub.evaluation?.overallBand || 0)}`}>
                                                {sub.evaluation?.overallBand || '-'}
                                            </span>
                                        </td>
                                        <td>{sub.evaluation?.taskAchievement?.band || '-'}</td>
                                        <td>{sub.evaluation?.coherenceCohesion?.band || '-'}</td>
                                        <td>{sub.evaluation?.lexicalResource?.band || '-'}</td>
                                        <td>{sub.evaluation?.grammaticalRange?.band || '-'}</td>
                                        <td className="td-date">{formatDate(sub.timestamp)}</td>
                                        <td>
                                            <button className="btn-icon" title="Xem chi tiết">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <FileText size={48} />
                        <p>Chưa có submission nào</p>
                        <span>Các bài essay được chấm sẽ hiển thị tại đây</span>
                    </div>
                )}
            </div>

            {/* API Status */}
            <div className="api-status glass-card">
                <h3>API Configuration</h3>
                <div className="api-info-grid">
                    <div className="api-info-item">
                        <span className="api-label">API Key Status</span>
                        <span className={`api-value ${apiKeyService.hasApiKey() ? 'success' : 'error'}`}>
                            {apiKeyService.hasApiKey() ? '✓ Configured' : '✗ Not Set'}
                        </span>
                    </div>
                    <div className="api-info-item">
                        <span className="api-label">Selected Model</span>
                        <span className="api-value">{apiKeyService.getSelectedModel()}</span>
                    </div>
                    <div className="api-info-item">
                        <span className="api-label">Storage Used</span>
                        <span className="api-value">
                            {(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
