import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

// Toast Types
const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        className: 'toast-success'
    },
    error: {
        icon: AlertCircle,
        className: 'toast-error'
    },
    warning: {
        icon: AlertTriangle,
        className: 'toast-warning'
    },
    info: {
        icon: Info,
        className: 'toast-info'
    }
};

// Individual Toast Component
const ToastItem = ({ id, type, message, onClose, duration = 3000 }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const { icon: Icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;

    return (
        <div className={`toast-item ${className} ${isClosing ? 'closing' : ''}`}>
            <div className="toast-icon">
                <Icon size={20} />
            </div>
            <p className="toast-message">{message}</p>
            <button className="toast-close" onClick={handleClose}>
                <X size={16} />
            </button>
            <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
        </div>
    );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

// Custom Hook for Toast Management
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />
    };
};

export default ToastContainer;
