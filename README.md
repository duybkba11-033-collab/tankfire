# TankFire

TankFire là game đấu tank 1v1 thời gian thực trên trình duyệt. Server giữ toàn bộ
trạng thái gameplay; client chỉ gửi input và vẽ snapshot nhận từ Socket.IO.

## Công nghệ

- Backend: Node.js 20, Express 4, Socket.IO, MySQL 8
- Frontend: JavaScript, Canvas 2D, Vite 8
- Xác thực: JWT và bcrypt cost 10
- Kiểm thử: test runner có sẵn của Node.js

## Chạy từ máy mới

Yêu cầu: Node.js `>=20`, npm `>=10`, MySQL đang chạy.

```bash
# Tại thư mục gốc của repo
npm install

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Mở `backend/.env` và điền thông tin MySQL. Tạo khóa JWT bằng lệnh:

```bash
openssl rand -hex 32
```

Gán kết quả vào `JWT_SECRET`, sau đó khởi tạo hoặc migrate database:

```bash
cd backend
node setup-db.js
cd ..
```

Chạy hai terminal:

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

Mở [http://localhost:5173](http://localhost:5173), tạo hai tài khoản trong hai
trình duyệt hoặc một cửa sổ thường và một cửa sổ riêng tư, rồi vào matchmaking.

## Lệnh thường dùng

```bash
npm run check     # format, lint, 50 unit test và production build
npm test          # chỉ chạy unit test backend
npm run lint      # biến/import thừa, tên chưa khai báo và lỗi tĩnh
npm run format    # chuẩn hóa format mã nguồn
npm run build     # chỉ build frontend
npm run rebuild:ranking  # dựng lại ELO từ lịch sử (lệnh bảo trì)
npm run dev:backend
npm run dev:frontend
```

## Biến môi trường

Backend (`backend/.env`):

| Biến | Bắt buộc | Ý nghĩa |
|---|:---:|---|
| `DB_HOST` | có | Địa chỉ MySQL, thường là `127.0.0.1` |
| `DB_USER` | có | Tài khoản MySQL |
| `DB_PASS` | có | Mật khẩu, được phép để trống nhưng biến phải tồn tại |
| `DB_NAME` | có | Tên database |
| `JWT_SECRET` | có | Khóa ký JWT, không dùng giá trị mẫu khi triển khai |
| `PORT` | không | Cổng backend, mặc định `3001` |
| `CORS_ORIGINS` | không | Danh sách origin frontend, phân cách bằng dấu phẩy |
| `NODE_ENV` | không | Đặt `production` khi triển khai thật |
| `TRUST_PROXY` | không | Bật khi Express chạy sau reverse proxy tin cậy |

Frontend (`frontend/.env`):

| Biến | Bắt buộc | Ý nghĩa |
|---|:---:|---|
| `VITE_API_URL` | không | URL backend; mặc định dùng hostname hiện tại và cổng `3001` |

## Cấu trúc chính

```text
shared/                  hằng số gameplay, một nguồn sự thật
backend/src/game/        mô phỏng thuần, không socket hoặc database
backend/src/sockets/     queue, state socket, room lifecycle
backend/src/persistence/ transaction lịch sử và ELO
backend/src/controllers/ HTTP API có phân trang
frontend/src/game/       input, Socket.IO, render loop
frontend/src/ui/         auth, lobby, lịch sử, xếp hạng
backend/test/            unit test logic thuần
docs/SDD.md              yêu cầu và thiết kế hệ thống
```

Chi tiết kiến trúc, state machine, ERD, giao thức event, sequence diagram và ma
trận truy vết nằm tại [docs/SDD.md](docs/SDD.md). Bảng đối chiếu từng lỗi C1-F11
nằm tại [docs/REVIEW_REMEDIATION.md](docs/REVIEW_REMEDIATION.md).

## Khắc phục lỗi cài đặt

- `ECONNREFUSED 127.0.0.1:3306`: MySQL chưa chạy. Trên macOS dùng
  `brew services start mysql` rồi thử `mysql -u root -p`.
- `Access denied for user`: `DB_USER` hoặc `DB_PASS` trong `backend/.env` không
  khớp tài khoản MySQL.
- Vite báo lỗi `crypto.getRandomValues`: terminal đang dùng Node cũ. Kiểm tra
  `node -v`; dự án yêu cầu Node 20.19 trở lên.
- Frontend không gọi được backend: kiểm tra `VITE_API_URL` và thêm origin của
  frontend vào `CORS_ORIGINS`.
