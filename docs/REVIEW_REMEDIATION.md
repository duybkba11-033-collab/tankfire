# Đối chiếu nhận xét mã nguồn

Tài liệu này ánh xạ từng mã trong `nhan_xet_tankfire.txt` tới thay đổi hiện tại.
`Đã sửa` nghĩa là có mã chạy tương ứng; `Giới hạn` nghĩa là phần nâng cao còn
được ghi công khai trong SDD, không được nhận là đã hoàn thành.

## P0 - lỗi có thể làm hỏng demo

| Mã | Trạng thái | Bằng chứng trong mã / test |
|---|:---:|---|
| C1 queue trùng | Đã sửa | `PLAYER_STATE`, queue idempotent; `matchQueue.test`, `matchmaking.test` |
| C2 socket ma | Đã sửa | một `disconnect()` dọn queue, state, socket map; test disconnect queued |
| C3 listener leak | Đã sửa | handler chỉ gắn một lần ở `index.js`; room định tuyến bằng `roomBySocket`; input frontend singleton |
| C4 không biết tank mình | Đã sửa | `matched.yourSocketId`; màu vàng + `YOU` + mũi tên |
| C5 async request treo | Đã sửa | `asyncHandler` và error middleware cuối chuỗi |
| C6 stored XSS | Đã sửa | regex username và toàn bộ bảng/detail dùng DOM + `textContent` |
| C7 NaN treo room | Đã sửa | whitelist input, finite check hai lớp, rate limit; unit test input/đạn |
| C8 bản ghi rác | Đã sửa | `WIN/ABORTED/DRAW`; DRAW không persist; lifecycle test |

## P1 - thiết kế, kiến trúc, bảo mật và dữ liệu

| Mã | Trạng thái | Bằng chứng trong mã / tài liệu |
|---|:---:|---|
| D1 thiếu SDD | Đã sửa | `docs/SDD.md`: kiến trúc, ERD, protocol, state, sequence, traceability |
| D2 map rỗng | Đã sửa | ba map có wall/grass/river; wall tile có HP |
| D3 netcode sơ khai | Đã sửa theo H5 | 60 Hz physics, 30 Hz state, map revision delta, RAF, interpolation, local prediction, seq/ack |
| D4 không fixed timestep | Đã sửa | `FixedStepLoop` dùng accumulator và dt giây |
| D5 tốc độ chéo | Đã sửa | `shared/movement.mjs`; test độ dài vector |
| D6 tin client | Đã sửa trong phạm vi | strict input schema, clamp, seq, 60 event/s; aimbot là giới hạn đã ghi |
| D7 `createRoom` quá tải | Đã sửa | Queue, Room, FixedStepLoop, matchmaking và persistence tách riêng |
| D8 ba API base | Đã sửa | một `frontend/src/config.js`, hỗ trợ `VITE_API_URL` |
| D9 magic gameplay constants | Đã sửa | `shared/gameConstants.json` + adapter hai phía, có đơn vị trong SDD |
| D10 điểm ranking vô nghĩa | Đã sửa | ELO K=32; final score chỉ dùng hiển thị trận |
| D11 UI logic inline | Đã sửa | `index.html` không có script inline; logic nằm trong module UI |
| D12 animation nền tranh CPU | Đã sửa | bỏ particle canvas; dùng ảnh tĩnh `src/images/c.jpg` |
| D13 thiếu tính năng | Đã phân loại | mục ngoài phạm vi và lý do trong SDD |
| D14 khó test | Đã sửa | game/queue không I/O; dependency injection cho DB/loop/persist; 50 unit test |
| E1 middleware JWT chết | Đã sửa | history/ranking đều gắn `verifyToken` |
| E2 CORS `*` | Đã sửa | whitelist `CORS_ORIGINS` cho HTTP và Socket.IO |
| E3 thiếu env mẫu/fail fast | Đã sửa | `.env.example`; config báo đúng biến thiếu và dừng |
| E4 lịch sử dùng tên | Đã sửa | ba user ID FK; username chỉ là snapshot hiển thị |
| E5 pagination server | Đã sửa | `page/limit`, LIMIT/OFFSET, index `started_at` |
| E6 ranking dễ lệch | Đã sửa | history + hai ELO update cùng transaction; `npm run rebuild:ranking` |

## P2 - vệ sinh và quy trình

| Mã | Trạng thái | Bằng chứng |
|---|:---:|---|
| E7 register HTTP 200 | Đã sửa | trả 201 |
| E8 không rate limit | Đã sửa | `express-rate-limit`, 5 lần lỗi/phút/IP |
| F1 node_modules/log trong Git | Đã sửa | bỏ khỏi Git index, file cục bộ vẫn được giữ |
| F2 gitignore sai ngữ cảnh | Đã sửa | `.gitignore` dành cho Node/Vite/env/log |
| F3 root package vô nghĩa | Đã sửa | npm workspaces và scripts chung |
| F4 mã input chết | Đã sửa | handler input thật định tuyến room; file trùng đã xóa |
| F5 không test | Đã sửa | 50 unit test bằng `node --test`, 88.10% line coverage các module được đo |
| F6 chặn mọi keydown | Đã sửa | chỉ prevent W/A/S/D/Space, bỏ qua input form |
| F7 comment kiểu nhật ký vá | Đã sửa | không còn comment “đoạn thêm/sửa tại đây” |
| F8 comment lẫn ngôn ngữ | Đã sửa | mã dùng tiếng Anh; tài liệu dùng tiếng Việt |
| F9 item ID bằng thời gian | Đã sửa | counter riêng theo room |
| F10 spawn bỏ lỡ chu kỳ | Đã sửa | accumulator thời gian, giữ phần dư |
| F11 nuốt lỗi DB | Đã sửa | transaction rollback, retry lỗi tạm thời 3 lần, log lỗi cuối |

## Mức production

Ứng dụng đã đủ chặt cho triển khai một tiến trình: Helmet, CORS whitelist, body
limit, JWT, bcrypt, rate limit, input limit, graceful shutdown, DB transaction,
health check có kiểm tra DB, migration và test/build tự động. Những điều chưa
được nhận là production quy mô lớn: TLS/reverse proxy, centralized logs/metrics,
distributed rate-limit, multi-process room storage, reconnect và automated
browser/socket E2E. Đây là giới hạn vận hành, không phải lỗi bị che giấu.
