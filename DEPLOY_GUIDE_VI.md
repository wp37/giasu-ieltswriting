# 🚀 Hướng dẫn Deploy IELTS Writing Tool lên Vercel

## 📋 Chuẩn bị

### Điều kiện cần:
- ✅ Tài khoản GitHub (miễn phí)
- ✅ Tài khoản Vercel (miễn phí)
- ✅ Code đã có sẵn trong thư mục `ielts-writing-tool`

## 🎯 Các bước thực hiện

### Bước 1: Push code lên GitHub

#### 1.1. Tạo repository mới trên GitHub

1. Truy cập https://github.com
2. Click nút **"New"** (góc trên bên trái)
3. Đặt tên repository: `ielts-writing-tool`
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** chọn "Initialize with README" (vì đã có code)
6. Click **"Create repository"**

#### 1.2. Push code từ máy local

Mở terminal/command prompt tại thư mục `ielts-writing-tool`:

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit: IELTS Writing Tool with Gemini AI"

# Add remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/ielts-writing-tool.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

**Lưu ý**: Thay `YOUR_USERNAME` bằng username GitHub thật của bạn.

### Bước 2: Deploy trên Vercel

#### 2.1. Đăng nhập Vercel

1. Truy cập https://vercel.com
2. Click **"Sign Up"** (nếu chưa có tài khoản)
3. Chọn **"Continue with GitHub"**
4. Authorize Vercel để access GitHub

#### 2.2. Import Project

1. Click nút **"Add New..."** → **"Project"**
2. Vercel sẽ hiện danh sách repositories từ GitHub
3. Tìm và click **"Import"** bên cạnh `ielts-writing-tool`

#### 2.3. Configure Project

Vercel sẽ tự động detect Vite. Kiểm tra các thông tin:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

✅ Nếu đúng → Click **"Deploy"**

#### 2.4. Đợi Deployment

- Vercel sẽ build và deploy (thường mất 1-2 phút)
- Xem progress trong dashboard
- Khi xong sẽ hiện **"Congratulations!"**

#### 2.5. Lấy URL

Sau khi deploy xong, bạn sẽ có URL dạng:
```
https://ielts-writing-tool-XXXXX.vercel.app
```

Copy URL này để share với người dùng!

## ✅ Kiểm tra sau Deploy

### Test trên Production:

1. Mở URL vừa được cấp
2. Kiểm tra các tính năng:
   - [ ] API Key Modal tự động hiện
   - [ ] Có thể nhập API key
   - [ ] Validation hoạt động
   - [ ] Có thể chọn model
   - [ ] Lưu settings thành công
   - [ ] Settings button hoạt động
   - [ ] UI hiển thị đúng

### Nếu có lỗi:

1. **Build failed**:
   - Kiểm tra Vercel logs
   - Đảm bảo `package.json` đúng
   - Check `vercel.json` configuration

2. **404 errors**:
   - Kiểm tra `vercel.json` có cấu hình rewrites
   - Rebuild lại project

3. **API errors**:
   - Đây là lỗi từ phía user (cần API key)
   - Không phải lỗi deployment

## 🔑 Hướng dẫn User lấy API Key

Khi user mở app lần đầu:

### Bước 1: Modal API Key tự động hiện

User sẽ thấy:
- Input để nhập API key
- 3 cards chọn model
- Link "Lấy key tại đây"

### Bước 2: Lấy API Key từ Google

1. Click link **"Lấy key tại đây"**
2. Mở trang: https://aistudio.google.com/apikey
3. Đăng nhập Google account
4. Click **"Create API Key"**
5. Chọn project hoặc tạo mới
6. Copy API key (dạng: `AIzaSy...`)

### Bước 3: Config trong App

1. Paste API key vào input
2. Chọn model (mặc định: Gemini 3 Flash Preview)
3. Click **"Lưu cấu hình"**
4. Done! Có thể dùng app ngay

## 🎯 Features đã implement

### ✅ Quản lý API Key
- User tự nhập API key
- Lưu trong localStorage (browser)
- Có thể thay đổi bất cứ lúc nào
- Validation: phải bắt đầu bằng "AIza"

### ✅ Multiple Models với Fallback
- 3 models: Flash Preview, Pro Preview, 2.5 Flash
- Tự động chuyển model khi gặp lỗi
- Retry thông minh (chỉ retry lỗi có thể khắc phục)
- Hiển thị model đang dùng

### ✅ Error Handling
- Phân biệt loại lỗi (Quota, General)
- Hiển thị lỗi chi tiết
- Danh sách models đã thử
- Nút retry với model tiếp theo
- Hướng dẫn giải quyết

### ✅ Education Features
- Learning paths (3 levels)
- Personalized tips
- Practice exercises
- Study plan generator

## 📝 Các file quan trọng đã check

### ✅ vercel.json
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
  "framework": "vite"
}
```

### ✅ index.html
- Title: "IELTS Writing Tool - Powered by Gemini AI"
- Script reference: `/src/main.jsx`
- Đúng cấu trúc HTML5

### ✅ package.json
- Build script: `vite build`
- All dependencies listed
- React 19.2.0, Vite 7.2.4

## 🎨 UI/UX Highlights

### API Key Modal
- Modern, responsive design
- 3 model cards với badges màu sắc
- Input với show/hide password
- Clear validation messages
- Direct link to get API key

### Header
- Settings button luôn hiển thị
- Warning khi chưa có key (màu đỏ)
- Model indicator (khi đã config)
- Professional gradient background

### Error Display
- Color-coded errors
- Expandable technical details
- Clear action buttons
- Helpful suggestions
- Links to resolve issues

## 🔄 Update Code sau Deploy

Nếu có thay đổi code:

```bash
# 1. Commit changes
git add .
git commit -m "Update: description of changes"

# 2. Push to GitHub
git push

# 3. Vercel tự động deploy lại!
```

Vercel có **Auto Deploy**:
- Mỗi push to main → Auto deploy
- Không cần làm gì thêm
- Check progress tại Vercel dashboard

## 📊 Monitor sau Deploy

### Vercel Dashboard

1. **Deployments**: Xem lịch sử deploy
2. **Analytics**: Traffic và performance
3. **Logs**: Runtime và build logs
4. **Settings**: Domain, environment, etc.

### Metrics quan tâm

- **Deployment Status**: Success/Failed
- **Build Time**: Nên < 2 phút
- **Page Load Time**: Nên < 3 giây
- **Error Rate**: Nên = 0%

## ⚠️ Lưu ý quan trọng

### API Key
- ✅ User tự cung cấp (không dùng key của bạn)
- ✅ Lưu trong localStorage của user
- ✅ Không qua server nào cả
- ✅ Mỗi user có quota riêng

### Quota Limits
- Free tier: 60 requests/minute
- User cần monitor tại Google AI Studio
- App tự động fallback khi hết quota
- Có thể dùng nhiều keys

### Security
- ✅ HTTPS auto-enabled by Vercel
- ✅ API keys never exposed
- ✅ No backend = No attack surface
- ✅ User data stays in browser

## 🎉 Hoàn tất!

Sau khi làm theo các bước trên:

✅ App đã live trên Internet
✅ URL có thể share với bất cứ ai
✅ Auto SSL (HTTPS)
✅ Global CDN
✅ Auto deploy on push
✅ Zero configuration needed

### Share với Users:

```
🎓 IELTS Writing Tool
🔗 URL: https://ielts-writing-tool-XXXXX.vercel.app

📌 Hướng dẫn sử dụng:
1. Mở link
2. Lấy API key tại: https://aistudio.google.com/apikey
3. Nhập key vào app
4. Bắt đầu luyện IELTS!

💰 Free để sử dụng (cần API key miễn phí từ Google)
```

## 📞 Support

Nếu gặp vấn đề:

1. **Check Vercel Logs**: Xem lỗi build
2. **Check Console**: F12 → Console tab
3. **Check Network**: F12 → Network tab
4. **Verify Files**: Đảm bảo `vercel.json` đúng

## 🚀 Next Steps

Sau khi deploy thành công:

- [ ] Test kỹ các tính năng
- [ ] Share URL với beta testers
- [ ] Collect feedback
- [ ] Monitor error logs
- [ ] Plan for improvements

---

**Chúc mừng! Bạn đã deploy thành công! 🎉**

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Deploy Time**: ~5 phút  
**Cost**: $0 (Free tier)
