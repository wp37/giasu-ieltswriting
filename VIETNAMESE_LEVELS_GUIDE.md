# Hướng dẫn Hệ thống 6 bậc Việt Nam

## 📊 Tổng quan

Ứng dụng IELTS Writing Tool đã được tích hợp **Hệ thống 6 bậc chuẩn Việt Nam** theo khung năng lực ngoại ngữ, tương ứng với thang điểm IELTS.

## 🎯 Bảng Tương Ứng Trình Độ

| Bậc | Tên gọi | IELTS Band | Mô tả | Màu sắc |
|-----|---------|------------|-------|---------|
| **A2** | Sơ cấp | 3.0 - 4.5 | Người mới bắt đầu | 🔴 Đỏ |
| **B1** | Trung cấp 1 | 5.0 - 5.5 | Trung cấp cơ bản | 🟠 Cam |
| **B2** | Trung cấp 2 | 6.0 - 6.5 | Trung cấp nâng cao | 🟡 Vàng |
| **C1** | Cao cấp 1 | 7.0 - 8.0 | Thành thạo | 🟢 Xanh lá |
| **C2** | Cao cấp 2 | 8.5 - 9.0 | Gần như người bản ngữ | 🔵 Xanh dương |
| **NATIVE** | Bản ngữ | 9.0+ | Trình độ người bản ngữ | 🟣 Tím |

## 🎨 Giao diện Level Selector

### Nút Chọn Trình Độ
Nút hiển thị trên thanh navigation với các thông tin:
- **Mã bậc**: A2, B1, B2, C1, C2, NATIVE
- **Tên gọi**: Sơ cấp, Trung cấp 1, Trung cấp 2, v.v.
- **IELTS Band**: Thang điểm IELTS tương ứng
- **Màu sắc**: Mỗi bậc có màu riêng biệt

### Dropdown Menu
Khi click vào nút, dropdown hiển thị:
- **6 lựa chọn trình độ** với đầy đủ thông tin
- **Mô tả chi tiết** cho từng bậc
- **Visual indicators** (màu sắc, checkmark)
- **Gợi ý** chọn trình độ phù hợp

## 💻 Sử dụng trong Code

### 1. Import và Sử dụng Component

```jsx
import LevelSelector from './components/LevelSelector/LevelSelector';
import { VIETNAMESE_LEVELS } from './services/educationService';

function MyComponent() {
  const [currentLevel, setCurrentLevel] = useState('B1');

  const handleLevelChange = (newLevel) => {
    setCurrentLevel(newLevel);
    localStorage.setItem('user_level', newLevel);
  };

  return (
    <LevelSelector 
      currentLevel={currentLevel}
      onLevelChange={handleLevelChange}
      showBandScore={true}
    />
  );
}
```

### 2. Lấy Thông Tin Trình Độ

```javascript
import { VIETNAMESE_LEVELS, educationService } from './services/educationService';

// Lấy thông tin bậc B2
const b2Info = VIETNAMESE_LEVELS.B2;
console.log(b2Info);
// {
//   band: '6.0-6.5',
//   label: 'Trung cấp 2',
//   color: '#eab308',
//   description: 'Trung cấp nâng cao'
// }

// Convert IELTS band score sang Vietnamese level
const level = educationService.getVietnameseLevel(6.5);
console.log(level); // 'B2'
```

### 3. Lấy Learning Path theo Trình Độ

```javascript
import { educationService } from './services/educationService';

// Có thể dùng Vietnamese level
const pathB2 = educationService.getLearningPath('B2');

// Hoặc dùng cách cũ (backward compatible)
const pathIntermediate = educationService.getLearningPath('intermediate');

// Cả 2 cách đều hoạt động!
```

## 🔄 Mapping Logic

### Vietnamese Level → Internal Level

```javascript
const levelMapping = {
  'A2': 'beginner',      // Sơ cấp
  'B1': 'beginner',      // Trung cấp 1
  'B2': 'intermediate',  // Trung cấp 2
  'C1': 'advanced',      // Cao cấp 1
  'C2': 'advanced',      // Cao cấp 2
  'NATIVE': 'advanced'   // Bản ngữ
};
```

### IELTS Band → Vietnamese Level

```javascript
function getVietnameseLevel(bandScore) {
  if (bandScore < 5.0) return 'A2';
  if (bandScore < 6.0) return 'B1';
  if (bandScore < 7.0) return 'B2';
  if (bandScore < 8.5) return 'C1';
  if (bandScore < 9.0) return 'C2';
  return 'NATIVE';
}
```

## 🎓 Tính năng Education theo Trình Độ

### A2 - Sơ cấp (IELTS 3.0-4.5)
- **Focus**: Cơ bản, nền tảng
- **Content**: Grammar cơ bản, từ vựng thiết yếu
- **Practice**: Câu đơn, đoạn văn ngắn

### B1 - Trung cấp 1 (IELTS 5.0-5.5)
- **Focus**: Phát triển kỹ năng cơ bản
- **Content**: Cấu trúc câu phức, từ vựng học thuật
- **Practice**: Essay ngắn, các dạng bài Task 1 & 2

### B2 - Trung cấp 2 (IELTS 6.0-6.5)
- **Focus**: Nâng cao kỹ năng
- **Content**: Advanced grammar, collocations
- **Practice**: Full essays, timed practice

### C1 - Cao cấp 1 (IELTS 7.0-8.0)
- **Focus**: Thành thạo
- **Content**: Sophisticated language, nuances
- **Practice**: Band 8+ techniques

### C2 - Cao cấp 2 (IELTS 8.5-9.0)
- **Focus**: Gần native
- **Content**: Natural expression, idioms
- **Practice**: Perfection, consistency

### NATIVE - Bản ngữ (IELTS 9.0+)
- **Focus**: Như người bản ngữ
- **Content**: All advanced features
- **Practice**: Teaching others

## 💾 Local Storage

Trình độ được lưu tự động trong localStorage:

```javascript
// Save
localStorage.setItem('user_level', 'B2');

// Get
const level = localStorage.getItem('user_level');

// Default to B1 if not set
const currentLevel = level && ['A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE'].includes(level) 
  ? level 
  : 'B1';
```

## 🎨 Customization

### Thay đổi Màu Sắc

Edit trong `src/services/educationService.js`:

```javascript
export const VIETNAMESE_LEVELS = {
  A2: { 
    band: '3.0-4.5', 
    label: 'Sơ cấp', 
    color: '#ef4444',  // Đổi màu tại đây
    description: 'Người mới bắt đầu' 
  },
  // ...
};
```

### Thay đổi Tên Gọi

```javascript
B1: { 
  band: '5.0-5.5', 
  label: 'Tên mới',  // Đổi tên tại đây
  color: '#f59e0b', 
  description: 'Mô tả mới' 
}
```

### Thay đổi IELTS Band Mapping

Edit hàm `getVietnameseLevel()` trong `educationService.js`:

```javascript
getVietnameseLevel(bandScore) {
  if (bandScore < 5.0) return 'A2';  // Đổi threshold tại đây
  if (bandScore < 6.0) return 'B1';
  // ...
}
```

## 📱 Responsive Design

Component tự động điều chỉnh theo màn hình:

- **Desktop (>1024px)**: Width 250px, full details
- **Tablet (768-1024px)**: Width 220px, compact
- **Mobile (<768px)**: Width 180px, minimal

## ✅ Testing Checklist

- [ ] Dropdown mở/đóng đúng
- [ ] Chọn level và lưu vào localStorage
- [ ] Hiển thị đúng màu sắc cho từng level
- [ ] Active state hiển thị checkmark
- [ ] Learning path load đúng theo level
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Backward compatible với old levels (beginner/intermediate/advanced)

## 🔄 Migration từ Old System

Nếu bạn đang dùng hệ thống cũ:

```javascript
// Old way (still works!)
const path = educationService.getLearningPath('beginner');

// New way (recommended)
const path = educationService.getLearningPath('B1');

// Both return the same result!
```

Không cần migration - hệ thống tự động map!

## 🎉 Summary

- ✅ 6 bậc chuẩn Việt Nam: A2, B1, B2, C1, C2, NATIVE
- ✅ Tương ứng IELTS Band Score
- ✅ UI component đẹp với dropdown
- ✅ Tự động lưu localStorage
- ✅ Tích hợp với Education Service
- ✅ Backward compatible
- ✅ Responsive design
- ✅ Customizable (colors, labels, mapping)

---

**Version**: 1.0.0
**Last Updated**: February 2026
**Status**: ✅ Production Ready
