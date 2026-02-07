import { useState } from 'react';
import { X, User, Phone, CreditCard, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { BANK_INFO, registerUser, isPhonePending } from '../../services/authService';
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmitInfo = (e) => {
        e.preventDefault();
        setError('');

        // Validate
        if (!fullName.trim() || fullName.trim().length < 2) {
            setError('Vui lòng nhập họ và tên đầy đủ');
            return;
        }

        const phoneRegex = /^0\d{9,10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)');
            return;
        }

        setStep(2);
    };

    const handleConfirmPayment = () => {
        setIsSubmitting(true);
        setError('');

        const result = registerUser(phone, fullName);

        if (result.success) {
            setStep(3);
        } else {
            setError(result.error || 'Có lỗi xảy ra, vui lòng thử lại');
        }

        setIsSubmitting(false);
    };

    const handleClose = () => {
        setStep(1);
        setFullName('');
        setPhone('');
        setError('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose}>
                    <X size={20} />
                </button>

                {/* Step 1: User Info */}
                {step === 1 && (
                    <div className="modal-step">
                        <div className="step-header">
                            <div className="step-icon gradient-bg">
                                <User size={24} />
                            </div>
                            <h2>Đăng Ký Sử Dụng</h2>
                            <p>Nhập thông tin để bắt đầu sử dụng dịch vụ</p>
                        </div>

                        <form onSubmit={handleSubmitInfo} className="registration-form">
                            <div className="form-group">
                                <label>
                                    <User size={16} />
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Phone size={16} />
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0901234567"
                                />
                            </div>

                            {error && (
                                <div className="error-box">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn-primary">
                                Tiếp tục
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <div className="modal-step">
                        <div className="step-header">
                            <div className="step-icon gradient-bg">
                                <CreditCard size={24} />
                            </div>
                            <h2>Thanh Toán</h2>
                            <p>Chuyển khoản để kích hoạt tài khoản</p>
                        </div>

                        <div className="payment-info">
                            <div className="qr-section">
                                <img
                                    src={BANK_INFO.qrUrl}
                                    alt="QR Code thanh toán"
                                    className="qr-code"
                                />
                                <div className="qr-label">
                                    <QrCode size={14} />
                                    Quét mã QR để thanh toán
                                </div>
                            </div>

                            <div className="bank-details">
                                <div className="bank-row">
                                    <span className="bank-label">Ngân hàng:</span>
                                    <span className="bank-value">{BANK_INFO.bankName}</span>
                                </div>
                                <div className="bank-row">
                                    <span className="bank-label">Số tài khoản:</span>
                                    <span className="bank-value account-number">{BANK_INFO.accountNumber}</span>
                                </div>
                                <div className="bank-row">
                                    <span className="bank-label">Chủ tài khoản:</span>
                                    <span className="bank-value">{BANK_INFO.accountHolder}</span>
                                </div>
                                <div className="bank-row highlight">
                                    <span className="bank-label">Số tiền:</span>
                                    <span className="bank-value amount">{BANK_INFO.amount}</span>
                                </div>
                                <div className="bank-row">
                                    <span className="bank-label">Nội dung CK:</span>
                                    <span className="bank-value">IELTS {phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="payment-note">
                            <AlertCircle size={16} />
                            <span>Sau khi chuyển khoản, vui lòng đợi Admin duyệt (trong vòng 24h)</span>
                        </div>

                        {error && (
                            <div className="error-box">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="button-group">
                            <button className="btn-secondary" onClick={() => setStep(1)}>
                                Quay lại
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleConfirmPayment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Đã chuyển khoản'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="modal-step success-step">
                        <div className="success-icon">
                            <CheckCircle size={48} />
                        </div>
                        <h2>Đăng Ký Thành Công!</h2>
                        <p>
                            Chúng tôi đã nhận được đăng ký của bạn.<br />
                            Admin sẽ duyệt tài khoản trong vòng 24h.
                        </p>
                        <div className="user-info-summary">
                            <div><strong>Họ tên:</strong> {fullName}</div>
                            <div><strong>SĐT:</strong> {phone}</div>
                        </div>
                        <button className="btn-primary" onClick={handleClose}>
                            Đóng
                        </button>
                    </div>
                )}

                {/* Progress Steps */}
                <div className="step-progress">
                    <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
