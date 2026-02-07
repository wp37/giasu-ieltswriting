# IELTS Writing Tool - Setup Guide

## 📋 Tổng quan

IELTS Writing Tool là ứng dụng hỗ trợ luyện thi IELTS Writing, sử dụng Gemini AI với cơ chế fallback tự động và quản lý API key từ phía client.

## 🎯 Tính năng chính

### 1. Quản lý API Key
- ✅ Người dùng tự nhập API key của họ
- ✅ Lưu trữ an toàn trong localStorage
- ✅ Nút Settings luôn hiển thị để thay đổi key
- ✅ Cảnh báo khi chưa có API key

### 2. Hệ thống Model AI với Fallback
- ✅ Model mặc định: `gemini-3-flash-preview`
- ✅ Fallback models:
  1. `gemini-3-pro-preview`
  2. `gemini-2.5-flash`
- ✅ Tự động retry khi gặp lỗi API

### 3. Giao diện Thiết lập
- ✅ Modal chọn Model AI (dạng Cards)
- ✅ Thứ tự hiển thị:
  - Gemini 3 Flash Preview (Mặc định)
  - Gemini 3 Pro Preview (Pro)
  - Gemini 2.5 Flash (Ổn định)
- ✅ Hướng dẫn lấy API key tại: https://aistudio.google.com/apikey

### 4. Xử lý lỗi thông minh
- ✅ Hiển thị lỗi chi tiết (429 RESOURCE_EXHAUSTED, etc.)
- ✅ Danh sách models đã thử
- ✅ Nút retry với model tiếp theo
- ✅ Hướng dẫn giải quyết khi hết quota

### 5. Tích hợp Education Skills
- ✅ Learning paths theo level (beginner, intermediate, advanced)
- ✅ Personalized tips dựa trên đánh giá
- ✅ Practice exercises cho weak areas
- ✅ Study plan generator

## 🚀 Hướng dẫn Deploy lên Vercel

### Bước 1: Chuẩn bị Repository
```bash
cd ielts-writing-tool
git init
git add .
git commit -m "Initial commit"
```

### Bước 2: Push lên GitHub
```bash
# Tạo repository mới trên GitHub
# Sau đó:
git remote add origin https://github.com/your-username/ielts-writing-tool.git
git branch -M main
git push -u origin main
```

### Bước 3: Deploy trên Vercel

1. Truy cập [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import repository từ GitHub
4. Cấu hình build:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (hoặc để trống)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Click "Deploy"

### Bước 4: Kiểm tra Deployment

File `vercel.json` đã được tạo với cấu hình:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

## 🔧 Setup cho Development

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Build production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

## 🔑 Hướng dẫn lấy Gemini API Key

1. Truy cập: https://aistudio.google.com/apikey
2. Đăng nhập bằng Google account
3. Click "Create API Key"
4. Copy API key (bắt đầu bằng "AIza...")
5. Paste vào modal Settings trong app

## 📊 Kiểm tra File References

### ✅ index.html
- Đã cập nhật title: "IELTS Writing Tool - Powered by Gemini AI"
- Tham chiếu đúng: `/src/main.jsx`
- Meta tags chuẩn

### ✅ vercel.json
- SPA routing configuration
- Build commands
- Output directory

### ✅ Cấu trúc thư mục
```
ielts-writing-tool/
├── src/
│   ├── components/
│   │   ├── ApiKeyModal/
│   │   │   ├── ApiKeyModal.jsx
│   │   │   └── ApiKeyModal.css
│   │   └── ErrorDisplay/
│   │       ├── ErrorDisplay.jsx
│   │       └── ErrorDisplay.css
│   ├── services/
│   │   ├── apiKeyService.js
│   │   ├── geminiService.js
│   │   └── educationService.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vercel.json
├── package.json
└── vite.config.js
```

## 🎨 Giao diện Modal API Key

### Các tính năng:
- ✅ Input field với toggle show/hide password
- ✅ Validation API key (phải bắt đầu bằng "AIza")
- ✅ Model selection cards với badges
- ✅ Link đến Google AI Studio
- ✅ Thông tin hướng dẫn
- ✅ Buttons: Hủy / Lưu cấu hình

### Model Cards hiển thị:
1. **Gemini 3 Flash Preview** - Badge: "Mặc định" (Xanh dương)
2. **Gemini 3 Pro Preview** - Badge: "Pro" (Vàng)
3. **Gemini 2.5 Flash** - Badge: "Ổn định" (Xanh lá)

## 🔄 Cơ chế Retry & Fallback

### Quy trình xử lý:
1. Gọi API với model hiện tại
2. Nếu lỗi (429, RESOURCE_EXHAUSTED, etc.):
   - Tự động chuyển sang model tiếp theo
   - Giữ nguyên kết quả các bước trước
   - Retry với model mới
3. Hiển thị lỗi nếu tất cả models fail
4. Reset về model mặc định sau khi thành công

## 📝 API Key Storage

```javascript
// Lưu API key
apiKeyService.saveApiKey(apiKey)

// Lấy API key
const apiKey = apiKeyService.getApiKey()

// Kiểm tra có API key
const hasKey = apiKeyService.hasApiKey()

// Xóa API key
apiKeyService.removeApiKey()
```

## 🎓 Education Features

### Learning Paths
```javascript
import { educationService } from './services/educationService'

// Get learning path
const path = educationService.getLearningPath('beginner')

// Get personalized tips
const tips = educationService.getPersonalizedTips(evaluation)

// Get practice exercises
const exercises = educationService.getPracticeExercises(evaluation)

// Generate study plan
const plan = educationService.getStudyPlan(5.5, 7.0, 12)
```

## ⚠️ Lưu ý quan trọng

1. **API Key**: Người dùng phải tự cung cấp API key của họ
2. **Quota**: Gemini API có giới hạn free tier, cần thông báo người dùng
3. **Error Handling**: Hiển thị rõ ràng lỗi API để người dùng biết cách xử lý
4. **Security**: API key chỉ lưu ở localStorage, không gửi lên server
5. **Fallback**: Hệ thống tự động thử các model khác khi gặp lỗi

## 🐛 Troubleshooting

### Lỗi "API key not valid"
- Kiểm tra API key đã nhập đúng chưa
- Đảm bảo key bắt đầu bằng "AIza"
- Thử tạo API key mới

### Lỗi "429 RESOURCE_EXHAUSTED"
- Quota của API key đã hết
- Chờ reset quota hoặc dùng API key khác
- Hệ thống sẽ tự động thử model khác

### Build error trên Vercel
- Kiểm tra `vercel.json` configuration
- Đảm bảo `package.json` có đủ dependencies
- Check build logs trên Vercel dashboard

## 📞 Support

Nếu có vấn đề khi deploy hoặc sử dụng:
1. Check console logs
2. Kiểm tra Network tab trong DevTools
3. Verify API key còn quota
4. Xem Vercel deployment logs

---

**Last Updated**: February 2026
**Version**: 1.0.0
