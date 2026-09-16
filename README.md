# ⚡ CMS MODEL 3D - HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ MÔ HÌNH 3D HIỆU NĂNG CAO

> **Báo Cáo Đồ Án Kết Thúc Môn: Xây dựng và tối ưu hệ thống thương mại điện tử chuyên biệt (CMS Model 3D)**  
> **Triết lý thiết kế:** *Less is More* – Tối ưu hóa hiệu năng 60FPS, bảo mật kim tự tháp 4 cấp bậc và tự động hóa AI toàn diện.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WordPress](https://img.shields.io/badge/WordPress-6.x%20%2F%207.x-21759b.svg?logo=wordpress)](https://wordpress.org)
[![WooCommerce](https://img.shields.io/badge/WooCommerce-HPOS%20Ready-96588a.svg?logo=woocommerce)](https://woocommerce.com)
[![Performance](https://img.shields.io/badge/Performance-60FPS%20WPO-success.svg)](https://model3d.wuaze.com)
[![Status](https://img.shields.io/badge/Deployment-Online%20Active-brightgreen.svg)](https://model3d.wuaze.com)

---

## 👥 THÀNH VIÊN NHÓM THỰC HIỆN
| STT | Họ và Tên | MSSV | Vai Trò & Phụ Trách Kỹ Thuật |
|:---:|---|:---:|---|
| **1** | **Nguyễn Minh Thuận** *(Trưởng nhóm)* | `2500114700` | • Thiết kế kiến trúc phân quyền 4 cấp bảo mật kim tự tháp.<br>• Xây dựng cổng thanh toán 2 bước VietQR MB Bank tự động.<br>• Tối ưu hiệu năng WPO 60FPS (GPU Hardware Acceleration).<br>• Tích hợp Trợ lý ảo Chatbox AI 3D Model tư vấn 24/7. |
| **2** | **Đào Minh Tuấn** | `2500115853` | • Thiết kế kiến trúc dữ liệu tồn kho tổng và cơ chế Zero Overselling.<br>• Xây dựng trung tâm điều hành đơn hàng đa vai trò (HPOS).<br>• Quy trình tự động hóa xác thực và tiến trình vận đơn 4 bước VIP.<br>• Tối ưu luồng trải nghiệm khách hàng và quản trị viên. |

---

## 🌐 ĐƯỜNG LINK TRẢI NGHIỆM TRỰC TIẾP
* 🛒 **Website Online (Hosting InfinityFree):** [http://model3d.wuaze.com/](http://model3d.wuaze.com/)
* 📊 **Slide Báo Cáo Thuyết Trình Đồ Án:** [http://model3d.wuaze.com/slides.html](http://model3d.wuaze.com/slides.html)
* 🐙 **GitHub Repository Chính Thức:** [https://github.com/nguyenminhthuan-vlsc/Do_An_CMS.git](https://github.com/nguyenminhthuan-vlsc/Do_An_CMS.git)

---

## 🎯 CÁC ĐIỂM NHẤN KỸ THUẬT NỔI BẬT

### 1. Kiến Trúc Bảo Mật Phân Quyền Kim Tự Tháp 4 Cấp Bậc
* **Administrator (Tối Cao):** Toàn quyền hệ thống, quản lý kho, xem/cấp đổi mật khẩu nhân viên. Cơ chế bảo vệ duy nhất 1 ID Admin trong toàn bộ cơ sở dữ liệu (`cms_single_admin_id`).
* **Quản Lý (Shop Manager):** Duyệt/hủy đơn hàng, xem tồn kho tổng, xuất báo cáo.
* **Nhân Viên CSKH (Staff):** Khóa hoàn toàn nút duyệt đơn, khóa nút hủy đơn, khóa sửa kho; tích hợp modal xem nhanh giỏ hàng 1 chạm và nút gọi điện/Zalo hỗ trợ khách.
* **Khách Hàng (Customer):** Chặn 100% truy cập vào trang quản trị WP-Admin, điều hướng về giao diện tài khoản cá nhân ngoài trang chủ.

### 2. Cổng Thanh Toán Độc Lập 2 Bước & VietQR MB Bank
* Tách biệt thanh toán thành **2 bước độc lập** (tương tự trải nghiệm Đăng Nhập / Đăng Ký):
  - **Bước 1:** Điền địa chỉ nhận hàng và kiểm tra giỏ hàng trong bố cục 2 cột cân đối 52% - 45%.
  - **Bước 2:** Khối thanh toán riêng biệt nằm chính giữa màn hình (720px), hiển thị mã **VietQR MB Bank** động chứa đúng 100% số tiền và số điện thoại nhận hàng, kèm hiệu ứng quét laser và 4 nút copy 1 chạm.

### 3. Quản Trị Kho Tổng & Chống Bán Quá Số Lượng (Zero Overselling)
* Kiểm tra tồn kho thời gian thực ở 2 vòng chốt chặn: lúc thêm vào giỏ và lúc bấm thanh toán.
* Tự động trừ kho ngay khi đơn hàng được kích hoạt và tự động hoàn kho khi đơn hàng bị hủy.

### 4. Trợ Lý Ảo Chatbox AI 3D Thông Minh (Out-of-the-box)
* Giao diện Dark-Cyberpunk Glassmorphism đồng bộ với phong cách mô hình 3D.
* **Smart Knowledge Engine:** Nạp sẵn 100% dữ liệu sản phẩm (bản Resin VIP 30cm vs bản PVC 16cm, file 3D .STL/.OBJ), chính sách giao hàng hỏa tốc, đồng kiểm 100%, đổi trả 7 ngày và thanh toán VietQR.
* Hỗ trợ mở rộng kết nối với Google Gemini API hoặc OpenAI ChatGPT API trong WP-Admin.

### 5. Tối Ưu Hiệu Năng WPO (Web Performance Optimization - 60FPS)
* Áp dụng **GPU Hardware Acceleration** (`transform: translateZ(0)`, `will-change`) cho toàn bộ thẻ sản phẩm, slide chuyển động và modal.
* Tối ưu ảnh chuẩn LCP với `fetchpriority="high"` và `decoding="async"`.
* Chuẩn hóa font chữ Google Fonts `Be Vietnam Pro` hiển thị sắc nét trên mọi hệ điều hành.

---

## 📁 CẤU TRÚC THƯ MỤC NGUỒN
```bash
CMS-Model3D/
├── app/
│   └── public/
│       ├── slides.html                    # Slide thuyết trình báo cáo đồ án (6 slide WPO)
│       └── wp-content/
│           └── themes/
│               └── hello-elementor/
│                   ├── functions.php      # Khởi tạo modules và bộ lọc phân quyền
│                   ├── front-page.php     # Giao diện storefront Dark E-Commerce
│                   ├── includes/
│                   │   ├── ai-assistant.php        # Bộ não và backend Chatbox AI
│                   │   ├── checkout-payment.php    # Thanh toán 2 bước & VietQR MB Bank
│                   │   ├── custom-roles.php        # Phân quyền 4 cấp bảo mật kim tự tháp
│                   │   ├── stock-and-delivery.php  # Tiến trình vận đơn & trừ kho tự động
│                   │   └── warehouse-inventory.php # Bảng quản lý kho hàng tổng
│                   └── assets/
│                       ├── css/ai-assistant.css    # Style chatbox neon cyberpunk
│                       └── js/ai-assistant.js      # Logic chatbox và sessionStorage
├── standalone_infinityfree/               # Gói chạy độc lập trên hosting InfinityFree
│   ├── index.html                         # Storefront + Chatbox AI độc lập
│   ├── slides.html                        # Slide báo cáo online
│   └── assets/                            # Hình ảnh mô hình và CSS/JS
└── README.md                              # Tài liệu thuyết minh đồ án
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY THỬ NGHIỆM

### Cách 1: Xem trực tiếp Online (Không cần cài đặt)
Truy cập ngay vào đường link: **[http://model3d.wuaze.com/](http://model3d.wuaze.com/)**

### Cách 2: Chạy cục bộ trên Local by Flywheel
1. Tải toàn bộ mã nguồn về máy:
   ```bash
   git clone https://github.com/nguyenminhthuan-vlsc/Do_An_CMS.git
   ```
2. Đặt thư mục mã nguồn vào thư mục `app/public` của site Local (PHP 8.2+, MySQL 8.x, Nginx/Apache).
3. Import cơ sở dữ liệu `database_raw.sql` (hoặc restore qua file backup `.wpress`).
4. Kích hoạt theme **Hello Elementor (Model 3D Custom)** trong WP-Admin.

---

## 📜 GIẤY PHÉP & BẢN QUYỀN
Đồ án được phát triển phục vụ mục đích học tập và báo cáo kết thúc môn học.  
Bản quyền mã nguồn thuộc về nhóm sinh viên: **Nguyễn Minh Thuận & Đào Minh Tuấn** (2026).
