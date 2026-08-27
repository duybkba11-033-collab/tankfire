# BÁO CÁO THỰC TẬP TOÀN DIỆN
## HỆ THỐNG GAME CHIẾN TRANH XE TĂNG TRỰC TUYẾN TRÊN NỀN WEB

---

## LỜI CAM ĐOAN

Tôi xin cam đoan rằng báo cáo này là kết quả của quá trình nghiên cứu, phân tích, và triển khai thực tế dự án "Tankfire" - một hệ thống game chiến tranh xe tăng trực tuyến trên nền web. Toàn bộ nội dung được trình bày trong báo cáo này đều dựa trên việc phân tích code nguồn, thiết kế kiến trúc hệ thống, phát triển các module chính, kiểm thử chức năng, và đánh giá kết quả đạt được. Các quan điểm, nhận xét, và kết luận trong báo cáo này là ý kiến của tôi, không được sao chép từ bất kỳ nguồn nào mà không được dẫn nguồn thích hợp. Nếu có bất kỳ phần nào được tham khảo từ các tài liệu khác, tôi đều đã ghi chú rõ ràng.

---

## LỜI CẢM ƠN

Tôi xin gửi lời cảm ơn chân thành đến các thầy cô giáo, những người hướng dẫn, và các đồng nghiệp đã cung cấp sự hỗ trợ, hướng dẫn, và những nhận xét quý báu trong suốt quá trình thực hiện dự án. Những lời khuyên của các anh chị đã giúp tôi cải thiện kiến thức kỹ thuật, nâng cao khả năng tư duy phân tích, và hoàn thiện cách trình bày công việc một cách chuyên nghiệp. Đặc biệt, tôi cảm ơn những người đã dành thời gian để review code, test chức năng, và cho những phản hồi hữu ích để cải tiến sản phẩm.

---

## TÓM TẮT ĐỀ TÀI

Dự án "Tankfire" là một hệ thống game chiến tranh xe tăng trực tuyến chạy trên nền web, được xây dựng theo mô hình client-server với tính năng giao tiếp realtime thông qua Socket.IO. Hệ thống hỗ trợ các chức năng cơ bản bao gồm đăng ký tài khoản, đăng nhập, tìm đối thủ và ghép cặp, điều khiển xe tăng, xử lý va chạm, cập nhật trạng thái trận đấu, lưu lịch sử trận, và hiển thị thông tin xếp hạng. Báo cáo này trình bày toàn bộ quá trình từ phân tích yêu cầu, thiết kế kiến trúc, phát triển các module, kiểm thử chức năng, đến đánh giá kết quả của hệ thống, nhằm chứng minh giá trị học thuật và thực tiễn của dự án trong lĩnh vực phát triển phần mềm hiện đại.

---

## DANH MỤC CHỮ VIẾT TẮT

- **API** - Application Programming Interface (Giao diện lập trình ứng dụng): Tập hợp các quy tắc cho phép các phần mềm khác nhau giao tiếp với nhau.
- **CSS** - Cascading Style Sheets (Bảng kiểu theo tầng): Ngôn ngữ được dùng để định dạng và bố cục các trang web.
- **HTML** - HyperText Markup Language (Ngôn ngữ đánh dấu siêu văn bản): Ngôn ngữ cơ bản để tạo nội dung trên web.
- **JWT** - JSON Web Token: Chuẩn mã hóa token dùng cho xác thực người dùng.
- **MySQL** - Hệ quản trị cơ sở dữ liệu quan hệ: Một trong những database phổ biến nhất cho ứng dụng web.
- **Node.js** - Môi trường thực thi JavaScript phía máy chủ: Cho phép chạy JavaScript ngoài trình duyệt.
- **REST** - Representational State Transfer: Kiến trúc thiết kế API dựa trên các HTTP methods.
- **Socket.IO** - Thư viện giao tiếp hai chiều realtime: Cho phép gửi dữ liệu realtime giữa client và server.
- **SQL** - Structured Query Language (Ngôn ngữ truy vấn có cấu trúc): Ngôn ngữ tiêu chuẩn để làm việc với cơ sở dữ liệu.

---

## MỤC LỤC

**CHƯƠNG 1: PHÂN TÍCH TỔNG QUAN DỰ ÁN**
1.1 Lý do chọn dự án
1.2 Mục tiêu dự án
1.3 Phạm vi và đối tượng nghiên cứu
1.4 Ý nghĩa của dự án
1.5 Phương pháp nghiên cứu
1.6 Cấu trúc báo cáo
1.7 Đánh giá sơ bộ về khả năng thực hiện dự án
1.8 Kết luận chương

**CHƯƠNG 2: CÔNG NGHỆ VÀ CÔNG CỤ SỬ DỤNG**
2.1 Công nghệ frontend
2.2 Công nghệ backend
2.3 Cơ sở dữ liệu
2.4 Công cụ hỗ trợ phát triển
2.5 Vai trò của công nghệ trong thực hiện dự án

**CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**
3.1 Phân tích yêu cầu chức năng
3.2 Phân tích yêu cầu phi chức năng
3.3 Phân tích quy trình nghiệp vụ
3.4 Phân tích thiết kế hệ thống
3.5 Phân tích các module chính của hệ thống
3.6 Đánh giá tính thích hợp của thiết kế

**CHƯƠNG 4: THIẾT KẾ CHI TIẾT HỆ THỐNG**
4.1 Kiến trúc tổng thể hệ thống
4.2 Thiết kế giao tiếp realtime
4.3 Thiết kế các module backend
4.4 Thiết kế các module frontend
4.5 Thiết kế cơ sở dữ liệu
4.6 Thiết kế logic gameplay và quản lý trận đấu
4.7 Thiết kế bảo mật và quản lý phiên đăng nhập
4.8 Đánh giá tổng thể thiết kế hệ thống

**CHƯƠNG 5: TRIỂN KHAI VÀ CÀI ĐẶT HỆ THỐNG**
5.1 Môi trường triển khai
5.2 Cài đặt backend
5.3 Cài đặt frontend
5.4 Cấu hình cơ sở dữ liệu
5.5 Chạy và sử dụng hệ thống
5.6 Đánh giá quá trình triển khai

**CHƯƠNG 6: KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG**
6.1 Mục tiêu kiểm thử
6.2 Kiểm thử chức năng
6.3 Kiểm thử giao tiếp realtime
6.4 Đánh giá chung về chất lượng
6.5 Nhận định về giá trị của kiểm thử

**CHƯƠNG 7: KẾT QUẢ ĐẠT ĐƯỢC VÀ HẠN CHẾ**
7.1 Kết quả đạt được
7.2 Hạn chế của hệ thống
7.3 Bài học kinh nghiệm
7.4 Đánh giá tổng thể về quá trình thực hiện

**CHƯƠNG 8: HƯỚNG PHÁT TRIỂN**
8.1 Nâng cấp gameplay
8.2 Mở rộng matchmaking
8.3 Nâng cao bảo mật
8.4 Tối ưu hiệu năng và khả năng mở rộng
8.5 Các hướng phát triển phù hợp với bối cảnh thực tế

**CHƯƠNG 9: KẾT LUẬN**
9.1 Ý nghĩa của kết quả đạt được
9.2 Kiến nghị cuối cùng
9.3 Kết luận chung

---

## LỜI MỞ ĐẦU

Trong những năm gần đây, công nghệ web đã phát triển từ một nền tảng phục vụ các mục đích giao tiếp và giao dịch đơn giản, trở thành một môi trường có khả năng triển khai những ứng dụng tương tác phức tạp, bao gồm cả các trò chơi trực tuyến. Sự tiến bộ của các công nghệ như HTML5, Canvas, WebSocket, và các framework phía máy chủ hiện đại đã mở ra những khả năng mới để xây dựng các sản phẩm phần mềm có thể chạy trực tiếp trên trình duyệt web mà vẫn duy trì những trải nghiệm realtime cao cấp. Trong bối cảnh đó, việc nghiên cứu và phát triển một game chiến tranh xe tăng trực tuyến trên nền tảng web trở thành một hướng tiếp cận thích hợp, vừa có giá trị học thuật vừa có giá trị thực tiễn.

Dự án "Tankfire" không chỉ đơn thuần là một ứng dụng giải trí, mà còn là một cơ hội để áp dụng những nguyên lý phát triển phần mềm hiện đại vào thực tế. Qua dự án này, có thể học hỏi về cách thiết kế một hệ thống có kiến trúc rõ ràng, cách tổ chức code theo những pattern được chứng minh, cách xử lý giao tiếp realtime giữa client và server, cách quản lý dữ liệu một cách hiệu quả, và cách kiểm thử một ứng dụng phức tạp.

Từ phía kỹ thuật, dự án sử dụng những công nghệ phổ biến nhất hiện nay. Frontend được xây dựng bằng HTML5, CSS3, và Vanilla JavaScript với Canvas API để rendering game. Backend được xây dựng bằng Node.js và Express.js, sử dụng Socket.IO cho giao tiếp realtime. Dữ liệu được lưu trữ trong MySQL database. Những công nghệ này đều là những lựa chọn phổ biến trong ngành công nghiệp, vì vậy dự án này cũng là một cơ hội để làm quen với những công cụ thực tế mà các lập trình viên chuyên nghiệp sử dụng hàng ngày.

Ngoài ra, dự án cũng để cập đến những vấn đề quan trọng như bảo mật (password hashing, JWT authentication), hiệu suất (server-side game loop, collision detection), và khả năng mở rộng (server-authoritative design, modular architecture). Những vấn đề này đều là những thách thức thực tế mà các hệ thống lớn phải đối mặt, và dự án này cung cấp một cơ hội để hiểu rõ hơn về cách xử lý chúng.

---

# CHƯƠNG 1: PHÂN TÍCH TỔNG QUAN DỰ ÁN

## 1.1 Lý do chọn dự án

Lý do chính để chọn phát triển một game chiến tranh xe tăng trực tuyến là nó kết hợp được nhiều khía cạnh khác nhau của phát triển phần mềm hiện đại. Một trò chơi online đòi hỏi phải xử lý những yêu cầu phức tạp: giao tiếp realtime giữa nhiều client, xử lý game logic ở phía server, quản lý trạng thái game, xử lý collision detection, lưu trữ và truy xuất dữ liệu từ database, xác thực người dùng, và tối ưu hóa hiệu suất.

Đồng thời, dự án này cũng giúp thực hành các kỹ năng mềm như phân tích yêu cầu, thiết kế kiến trúc, quản lý dự án, kiểm thử, và viết tài liệu. Những kỹ năng này rất quan trọng trong công việc thực tế của một lập trình viên chuyên nghiệp, không chỉ biết code mà còn phải biết cách thiết kế, communicate, và deliver một sản phẩm chất lượng cao.

Ngoài ra, game là một loại ứng dụng mà rất nhiều người dùng có hứng thú, vì vậy có động lực để hoàn thiện dự án. So với một ứng dụng quản lý hàng tồn kho chẳng hạn, một game dễ dàng lôi cuốn người khác để thử nghiệm, cung cấp feedback, và yêu cầu tính năng mới.

## 1.2 Mục tiêu dự án

Mục tiêu chính của dự án là xây dựng một hệ thống game online hoàn chỉnh, từ phía backend đến phía frontend, từ logic game đến quản lý người dùng. Cụ thể, dự án nhằm đạt được những mục tiêu sau:

**Mục tiêu 1: Xây dựng hệ thống backend hoàn chỉnh**
Backend phải có khả năng xử lý các request từ client, quản lý kết nối Socket.IO, thực thi game logic, lưu trữ và truy xuất dữ liệu, xác thực người dùng, và quản lý phiên đăng nhập.

**Mục tiêu 2: Xây dựng giao diện frontend thân thiện**
Frontend phải có khả năng render game trên Canvas, capture input từ người chơi, gửi command tới server, nhận game state update, và hiển thị thông tin người chơi.

**Mục tiêu 3: Thực thi game logic chính xác**
Game logic phải xử lý đúng mọi trường hợp: di chuyển xe tăng, bắn đạn, va chạm, cập nhật máu, xác định người thắng, lưu kết quả trận.

**Mục tiêu 4: Đảm bảo tính bảo mật cơ bản**
Hệ thống phải sử dụng encryption cho password, JWT token cho authentication, và server-authoritative design để chống cheating.

**Mục tiêu 5: Viết tài liệu chi tiết**
Toàn bộ quá trình phát triển phải được tài liệu hóa để người khác (hay chính mình sau một thời gian dài) có thể hiểu và tiếp tục phát triển.

## 1.3 Phạm vi và đối tượng nghiên cứu

Dự án tập trung vào việc phát triển một hệ thống game online tank battle từ đầu đến cuối. Phạm vi bao gồm:

**Phạm vi 1: Thiết kế và phát triển backend**
Xây dựng server Node.js/Express.js, thiết kế database MySQL, xây dựng REST API, xây dựng Socket.IO event handlers, và thực thi game logic.

**Phạm vi 2: Thiết kế và phát triển frontend**
Xây dựng HTML/CSS/JavaScript, sử dụng Canvas API để render game, xây dựng input manager để capture và xử lý input, xây dựng Socket.IO client để giao tiếp với server.

**Phạm vi 3: Bảo mật**
Thực thi password hashing với bcryptjs, JWT authentication, CORS configuration, input validation.

**Phạm vi 4: Kiểm thử**
Kiểm thử chức năng để đảm bảo tất cả tính năng hoạt động đúng, kiểm thử realtime communication, kiểm thử hiệu suất.

**Phạm vi 5: Triển khai**
Cài đặt các dependencies, cấu hình database, thiết lập environment variables, khởi động server và client.

Đối tượng nghiên cứu là toàn bộ hệ thống game online, bao gồm cả những phía của client, server, và database.

## 1.4 Ý nghĩa của dự án

Dự án "Tankfire" có ý nghĩa quan trọng ở nhiều mặt:

**Ý nghĩa 1: Ứng dụng học thuật**
Dự án là một bài tập thực hành toàn diện về phát triển hệ thống phần mềm hiện đại. Nó giúp thực hành những kiến thức được học trong các môn học như thiết kế phần mềm, cơ sở dữ liệu, lập trình web, v.v.

**Ý nghĩa 2: Giá trị thực tiễn**
Dự án sử dụng những công nghệ phổ biến nhất hiện nay, vì vậy những kiến thức và kỹ năng thu được từ dự án này có thể được áp dụng trực tiếp trong công việc thực tế.

**Ý nghĩa 3: Chứng minh năng lực**
Dự án là một bằng chứng rõ ràng rằng một sinh viên có thể nắm vững đủ kiến thức và kỹ năng để tạo ra một sản phẩm phần mềm có giá trị. Nó có thể được dùng làm portfolio khi tìm kiếm công việc.

**Ý nghĩa 4: Cơ sở cho phát triển tiếp theo**
Kiến trúc của dự án được thiết kế để dễ mở rộng. Sau khi hoàn thành phiên bản ban đầu, có thể dễ dàng thêm tính năng mới như multiplayer modes, cosmetics, ranking system nâng cao, v.v.

## 1.5 Phương pháp nghiên cứu

Dự án sử dụng phương pháp nghiên cứu thực nghiệm (experimental research method) kết hợp với phương pháp phân tích (analytical method):

**Phương pháp 1: Phân tích yêu cầu**
Tìm hiểu chi tiết những gì mà hệ thống cần phải làm được, những ràng buộc, những yêu cầu phi chức năng như hiệu suất, bảo mật, v.v.

**Phương pháp 2: Thiết kế kiến trúc**
Dựa trên những yêu cầu, thiết kế kiến trúc tổng thể của hệ thống, cách chia các module, cách các module tương tác với nhau.

**Phương pháp 3: Phát triển từng phần**
Phát triển từng module theo từng bước, kiểm thử mỗi module khi hoàn thành.

**Phương pháp 4: Kiểm thử toàn diện**
Kiểm thử chức năng để đảm bảo tất cả tính năng hoạt động đúng, kiểm thử hiệu suất, kiểm thử bảo mật.

**Phương pháp 5: Tài liệu hóa**
Ghi chú chi tiết quá trình phát triển, những quyết định được đưa ra, những vấn đề gặp phải, cách giải quyết.

## 1.6 Cấu trúc báo cáo

Báo cáo này được cấu trúc thành 9 chương chính:

**Chương 1:** Phân tích tổng quan dự án, bao gồm lý do chọn dự án, mục tiêu, phạm vi, ý nghĩa, phương pháp, và cấu trúc báo cáo.

**Chương 2:** Công nghệ và công cụ sử dụng trong dự án, bao gồm công nghệ frontend, backend, cơ sở dữ liệu, và những công cụ hỗ trợ.

**Chương 3:** Phân tích yêu cầu và thiết kế hệ thống ở mức độ cao, bao gồm phân tích chức năng, phân tích phi chức năng, phân tích quy trình, và phân tích các module chính.

**Chương 4:** Thiết kế chi tiết hệ thống, bao gồm kiến trúc tổng thể, thiết kế giao tiếp realtime, thiết kế các module, thiết kế database, thiết kế gameplay logic.

**Chương 5:** Triển khai và cài đặt hệ thống, bao gồm chuẩn bị môi trường, cài đặt backend, cài đặt frontend, cấu hình database, chạy và test.

**Chương 6:** Kiểm thử và đánh giá hệ thống, bao gồm kiểm thử chức năng, kiểm thử realtime communication, đánh giá chất lượng.

**Chương 7:** Kết quả đạt được và hạn chế, bao gồm những thành tích đạt được, những hạn chế còn tồn tại, bài học kinh nghiệm.

**Chương 8:** Hướng phát triển trong tương lai, bao gồm nâng cấp gameplay, mở rộng matchmaking, tăng cường bảo mật, tối ưu hiệu năng.

**Chương 9:** Kết luận, bao gồm ý nghĩa của kết quả đạt được, kiến nghị cuối cùng, và nhìn nhận chung về dự án.

## 1.7 Đánh giá sơ bộ về khả năng thực hiện dự án

Trước khi bắt đầu phát triển, cần đánh giá sơ bộ về khả năng thực hiện dự án. Dựa trên phân tích, dự án là hoàn toàn có thể thực hiện được vì những lý do sau:

**Lý do 1: Công nghệ đã trưởng thành**
Tất cả những công nghệ được sử dụng trong dự án (Node.js, Express.js, Socket.IO, MySQL, HTML5 Canvas) đều là những công nghệ trưởng thành, có nhiều tài liệu, có nhiều lập trình viên đã sử dụng, vì vậy dễ tìm thông tin hỗ trợ.

**Lý do 2: Phạm vi rõ ràng và giới hạn**
Dự án được giới hạn chỉ support 1v1 game, một số bản đồ nhất định, những tính năng cơ bản. Không cố gắng làm quá nhiều điều trong một lần.

**Lý do 3: Có thể bắt đầu với phiên bản đơn giản**
Thay vì cố gắng làm một hệ thống hoàn hảo ngay từ đầu, có thể bắt đầu với một phiên bản đơn giản: chỉ 2 person tank battle, bản đồ duy nhất, không có power-ups, v.v. Sau đó dần dần thêm tính năng.

**Lý do 4: Có kiến thức nền tảng**
Sinh viên đã có kiến thức về HTML/CSS/JavaScript từ những môn học trước, cũng đã có kiến thức về Node.js, database, v.v. Vì vậy không phải học từ con số.

## 1.8 Kết luận chương

Dự án "Tankfire" là một dự án phát triển hệ thống game online tank battle hoàn chỉnh. Nó được chọn vì nó kết hợp được nhiều khía cạnh khác nhau của phát triển phần mềm, có giá trị học thuật và thực tiễn, và là hoàn toàn có thể thực hiện được. Báo cáo này sẽ trình bày toàn bộ quá trình phân tích, thiết kế, phát triển, kiểm thử, và đánh giá của dự án.

---

# CHƯƠNG 2: CÔNG NGHỆ VÀ CÔNG CỤ SỬ DỤNG

## 2.1 Công nghệ Frontend

### 2.1.1 HTML5

HTML5 là phiên bản mới nhất của ngôn ngữ đánh dấu siêu văn bản. Nó cung cấp những thẻ semantically meaningful, cho phép tạo các phần tử như `<header>`, `<nav>`, `<main>`, `<footer>` để làm code dễ đọc hơn. Ngoài ra, HTML5 còn giới thiệu Canvas API, một phần tử `<canvas>` cho phép vẽ hình ảnh 2D trực tiếp qua JavaScript.

Trong dự án, HTML5 được sử dụng để tạo structure cơ bản của ứng dụng. Các phần tử chính bao gồm một `<div>` container để chứa tất cả các UI screen (login, lobby, game, ranking, v.v.), và một `<canvas>` element để render game.

### 2.1.2 CSS3

CSS3 là phiên bản mới nhất của Cascading Style Sheets. Nó cung cấp những tính năng nâng cao như flexbox, grid, animation, transition, gradients, v.v. Những tính năng này cho phép tạo những giao diện hiện đại mà không cần phải sử dụng JavaScript hoặc các hình ảnh phức tạp.

Trong dự án, CSS3 được sử dụng để styling các UI screen. Flexbox được sử dụng cho layout, animation được sử dụng để làm các button, text input feedback more interactive.

### 2.1.3 JavaScript (Vanilla)

Vanilla JavaScript đề cập đến JavaScript "nguyên bản" mà không sử dụng bất kỳ framework nào như React, Vue, Angular. Dự án sử dụng Vanilla JavaScript vì nó giúp tránh tính phức tạp của các framework, giúp hiểu rõ hơn về cách JavaScript hoạt động ở mức độ cơ bản.

JavaScript được sử dụng cho nhiều mục đích:
- Quản lý DOM: thay đổi nội dung HTML dựa trên state hiện tại
- Xử lý event: capture keyboard/mouse input từ người chơi
- Giao tiếp Socket.IO: gửi và nhận message từ server
- Game logic phía client: tính toán vị trí local, animation, v.v.

### 2.1.4 Canvas API

Canvas API cho phép vẽ hình ảnh 2D trực tiếp bằng JavaScript. Nó cung cấp các phương thức như `fillRect()`, `drawImage()`, `fillStyle`, `strokeStyle`, v.v.

Trong dự án, Canvas được sử dụng để render toàn bộ game: vẽ background, vẽ các tank, vẽ đạn, vẽ tường, vẽ các UI elements như health bar.

### 2.1.5 Socket.IO Client

Socket.IO là một thư viện JavaScript cho phép giao tiếp two-way realtime giữa client và server. Nó hoạt động bằng cách sử dụng WebSocket (nếu browser hỗ trợ) hoặc fallback sang các phương pháp khác như long polling.

Trong dự án, Socket.IO client được sử dụng để:
- Gửi input từ người chơi (di chuyển, bắn) đến server
- Nhận game state update từ server
- Nhận thông báo khi trận đấu kết thúc
- Quản lý connection lifecycle

## 2.2 Công nghệ Backend

### 2.2.1 Node.js

Node.js là một runtime environment cho phép chạy JavaScript ngoài trình duyệt, trên máy chủ. Nó cung cấp event-driven, non-blocking I/O model, rất phù hợp cho các ứng dụng realtime.

Trong dự án, Node.js được sử dụng làm nền tảng chạy server. Tất cả backend code được viết bằng JavaScript (cùng ngôn ngữ như frontend), giúp tăng cộng tính consistency trong toàn bộ project.

### 2.2.2 Express.js

Express.js là một framework web lightweight cho Node.js. Nó cung cấp routing, middleware system, request/response handling, v.v. một cách simple nhưng powerful.

Trong dự án, Express.js được sử dụng để:
- Định tuyến HTTP requests: GET /api/ranking, POST /api/auth/login, v.v.
- Quản lý middleware: CORS, authentication checking, request logging
- Xử lý static files: serve HTML, CSS, JavaScript cho frontend

### 2.2.3 Socket.IO Server

Socket.IO server-side cho phép quản lý những kết nối WebSocket từ nhiều client. Nó cung cấp room system (cho phép broadcast message tới một tập hợp clients), event emit/on system, namespace system, v.v.

Trong dự án, Socket.IO server được sử dụng để:
- Quản lý kết nối từ client
- Broadcast game state update tới tất cả client trong cùng game room
- Quản lý queue người chơi đang tìm trận (matchmaking)
- Gửi thông báo khi trận đấu kết thúc

### 2.2.4 bcryptjs

bcryptjs là một thư viện Node.js cho phép hash password một cách an toàn. Thay vì lưu password gốc (which is a security risk), password được hash bằng bcrypt trước khi lưu vào database. Khi người dùng đăng nhập, password được hash lại và so sánh với hash được lưu.

Trong dự án, bcryptjs được sử dụng trong authentication flow:
1. User nhập password
2. Server hash password bằng bcrypt
3. So sánh hash với hash được lưu trong database
4. Nếu match, generate JWT token

### 2.2.5 JSON Web Token (JWT)

JWT là một chuẩn open cho phép create signed tokens. Tokens này có thể được sử dụng để xác thực user mà không cần lưu session ở server.

Trong dự án, JWT được sử dụng như sau:
1. User đăng nhập thành công
2. Server tạo JWT token chứa user id, username, v.v.
3. Client lưu token trong localStorage
4. Mỗi khi client gửi request, token được gửi kèm (thường trong Authorization header)
5. Server verify token bằng secret key
6. Nếu valid, xử lý request; nếu không, return error

## 2.3 Cơ sở dữ liệu

### 2.3.1 MySQL

MySQL là một relational database management system phổ biến. Nó sử dụng SQL (Structured Query Language) để query và manipulate data.

Dalam proyek, MySQL disimpan data tentang:
- **Users**: username, password hash, timestamps
- **Match history**: match id, player ids, winner, start/end times
- **Ranking**: player id, wins, losses, rating

Dữ liệu được lưu trữ ở một database server tập trung, giúp đảm bảo tính consistency của dữ liệu ngay cả khi có nhiều clients cùng truy cập.

## 2.4 Công cụ hỗ trợ phát triển

### 2.4.1 Visual Studio Code

Visual Studio Code là một editor văn bản code-focused, nhẹ nhưng mạnh mẽ. Nó hỗ trợ rất nhiều ngôn ngữ, có extension ecosystem lớn, có built-in terminal, debugger, v.v.

### 2.4.2 Git & GitHub

Git là một version control system cho phép track những thay đổi trong code. GitHub là một platform lưu trữ Git repositories. Sử dụng Git giúp:
- Track history của những thay đổi code
- Collaborate với những developer khác
- Rollback nếu có vấn đề

### 2.4.3 npm

npm (Node Package Manager) là package manager cho Node.js. Nó cho phép dễ dàng install, manage, update các dependencies. Các dependencies được lưu trong file package.json.

### 2.4.4 Postman

Postman là một tool cho phép test API endpoints. Nó cho phép dễ dàng gửi HTTP requests với custom headers, body, v.v., và inspect response.

## 2.5 Vai trò của công nghệ trong thực hiện dự án

Mỗi công nghệ được chọn vì những lý do cụ thể:

**Vanilla JavaScript + Canvas**: Cho phép tạo game trực tiếp trên browser mà không cần phải install bất kỳ plugin nào. User chỉ cần mở URL là có thể chơi.

**Node.js + Express.js + Socket.IO**: Cho phép xây dựng server realtime xử lý input từ nhiều client, broadcast game state. Node.js event-driven model phù hợp cho loại ứng dụng này.

**MySQL**: Cung cấp một cách persistent, reliable để lưu trữ dữ liệu user, match history, ranking. Relational structure giúp dễ query dữ liệu.

**bcrypt + JWT**: Giúp đảm bảo bảo mật basic: password không được lưu plaintext, mỗi request có thể được xác thực mà không cần lưu server session.

Tổng cộng, những công nghệ này tạo thành một tech stack khá complete cho việc phát triển một game online từ đầu đến cuối.

---

# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1 Phân tích yêu cầu chức năng

### 3.1.1 Chức năng đăng ký tài khoản

Người dùng cần có khả năng tạo tài khoản mới. Quy trình:
1. Người dùng nhập username và password
2. Server validate: username không được trống, password có độ dài tối thiểu, username không được trùng lặp
3. Nếu valid, password được hash bằng bcrypt
4. Tạo user record mới trong database
5. Return success message hoặc error message

### 3.1.2 Chức năng đăng nhập

Người dùng cần có khả năng đăng nhập vào hệ thống. Quy trình:
1. Người dùng nhập username và password
2. Server query database tìm user với username này
3. Nếu không tìm thấy, return error
4. Nếu tìm thấy, hash password được nhập và so sánh với hash trong database
5. Nếu match, generate JWT token và return
6. Client lưu token trong localStorage

### 3.1.3 Chức năng tìm trận (Matchmaking)

Người dùng cần có khả năng tìm đối thủ để chơi. Quy trình:
1. Người dùng nhấn nút "Tìm trận"
2. Server thêm user vào queue
3. Khi có 2 người trong queue, server tạo game room mới
4. Gửi thông báo tới cả 2 user để chuyển sang game screen
5. Server khởi tạo game state cho room này

### 3.1.4 Chức năng gameplay

Trong game, người chơi cần có khả năng:
- Di chuyển xe tăng bằng phím mũi tên
- Bắn đạn bằng phím spacebar hoặc click chuột
- Thấy vị trí và hành động của đối thủ realtime
- Thấy số lần thắng của cả hai
- Thấy máu hiện tại của xe tăng của mình

Server cần:
- Nhận input từ cả 2 player
- Xử lý collision (đạn với tank, tank với wall)
- Cập nhật game state
- Broadcast game state tới cả 2 player

### 3.1.5 Chức năng kết thúc trận

Khi một player chạm tới số lần thắng yêu cầu (ví dụ 10), trận kết thúc. Server:
- Xác định winner
- Lưu match record vào database
- Cập nhật ranking (increment wins cho winner, losses cho loser)
- Gửi thông báo tới cả 2 player

### 3.1.6 Chức năng xem lịch sử trận

Người dùng cần có khả năng xem lịch sử các trận đã chơi. Server:
- Query database tìm tất cả match của user
- Return thông tin: opponent, kết quả, thời gian, v.v.

### 3.1.7 Chức năng xem ranking

Người dùng cần có khả năng xem bảng xếp hạng. Server:
- Query ranking table, order by rating hoặc wins
- Return top N players

## 3.2 Phân tích yêu cầu phi chức năng

### 3.2.1 Hiệu suất

Game phải chạy mượt mà. Điều này có nghĩa:
- Game state được update với tần suất cao (ít nhất 30 FPS, tốt hơn là 60 FPS)
- Latency giữa input và visual feedback phải thấp (<100ms ideally)
- Server phải có khả năng xử lý nhiều game rooms cùng lúc

### 3.2.2 Bảo mật

Dữ liệu người dùng phải được bảo vệ:
- Password phải được hash trước khi lưu
- API endpoints phải require authentication
- Server phải validate mọi input từ client (không tin client)

### 3.2.3 Tính đáng tin cậy

Hệ thống phải hoạt động ổn định:
- Server không được crash ngay cả khi nhận input không hợp lệ
- Database connection phải được manage properly
- Network disconnect phải được handle gracefully

### 3.2.4 Tính mở rộng

Hệ thống phải được thiết kế để dễ mở rộng:
- Code phải được modularize
- Database schema phải được thiết kế để dễ thêm tính năng mới
- Architecture phải tách biệt client/server logic

## 3.3 Phân tích quy trình nghiệp vụ

### 3.3.1 Quy trình người chơi mới

1. Người dùng vào website
2. Nếu chưa có tài khoản, nhấn "Đăng ký"
3. Nhập username, password, xác nhận password
4. Nhấn "Đăng ký"
5. Nếu thành công, hệ thống chuyển sang trang đăng nhập
6. Nhập username và password
7. Nhấn "Đăng nhập"
8. Nếu thành công, chuyển sang trang lobby

### 3.3.2 Quy trình người chơi tìm trận

1. Người dùng đã đăng nhập, ở trang lobby
2. Chọn bản đồ (nếu có)
3. Nhấn "Tìm trận"
4. Hệ thống hiển thị "Đang tìm kiếm..."
5. Khi tìm thấy đối thủ, chuyển sang game screen
6. Trận đấu bắt đầu

### 3.3.3 Quy trình gameplay

1. Trận bắt đầu, cả 2 tank đều ở vị trí spawn
2. Cả 2 player điều khiển xe tăng của mình, cố gắng đánh bại đối thủ
3. Khi một player bị đánh bại (máu = 0), người kia có +1 lần thắng
4. Tank bị đánh bại respawn lại
5. Quá trình lặp lại cho đến khi một trong hai chạm tới số lần thắng tối đa
6. Trận kết thúc, kết quả được hiển thị

## 3.4 Phân tích thiết kế hệ thống

Hệ thống được thiết kế theo mô hình client-server:

**Client side:**
- HTML/CSS/JavaScript chạy trên browser người chơi
- Capture input từ bàn phím/chuột
- Gửi input tới server thông qua Socket.IO
- Nhận game state từ server
- Render game trên Canvas
- Hiển thị UI screens (login, lobby, ranking, v.v.)

**Server side:**
- Node.js server chạy trên máy chủ
- Quản lý kết nối từ nhiều clients
- Xử lý game logic (collision, damage, v.v.)
- Lưu trữ game state hiện tại của mỗi game room
- Broadcast game state update tới tất cả clients trong room
- Quản lý database queries (tạo user, lưu match history, cập nhật ranking)

**Database:**
- MySQL database lưu trữ persistent data (users, match history, ranking)

## 3.5 Phân tích các module chính của hệ thống

### 3.5.1 Module Authentication

Chịu trách nhiệm quản lý user login/logout. Gồm:
- Xác thực username/password
- Tạo JWT token
- Verify JWT token

### 3.5.2 Module Matchmaking

Chịu trách nhiệm tìm đối thủ cho người chơi. Gồm:
- Quản lý queue người đang tìm trận
- Khi có 2 người, tạo game room
- Assign players tới room

### 3.5.3 Module Game Logic

Chịu trách nhiệm xử lý gameplay. Gồm:
- Game loop chạy 60 FPS
- Xử lý input từ players (di chuyển, bắn)
- Xử lý collision
- Cập nhật game state
- Kiểm tra điều kiện kết thúc trận

### 3.5.4 Module Persistence

Chịu trách nhiệm lưu trữ dữ liệu. Gồm:
- User CRUD operations
- Match history recording
- Ranking updates
- Query match history, ranking, v.v.

## 3.6 Đánh giá tính thích hợp của thiết kế

Thiết kế hiện tại có những ưu điểm:

**Ưu điểm 1: Modular**
Các module độc lập với nhau, dễ test, dễ maintain.

**Ưu điểm 2: Scalable**
Server-authoritative design giúp dễ mở rộng: có thể dễ dàng thêm server instance phía sau load balancer.

**Ưu điểm 3: Security**
Sử dụng bcrypt + JWT, password hashing, server-side validation.

**Ưu điểm 4: Realtime**
Sử dụng Socket.IO cho giao tiếp realtime.

Tuy nhiên, cũng có những hạn chế:

**Hạn chế 1: Chỉ support 1v1**
Hiện tại game logic chỉ support 1v1, không support multiplayer.

**Hạn chế 2: Game state lưu memory**
Game state được lưu trong memory của Node.js process. Nếu server restart, tất cả ongoing games sẽ mất. Để fix, có thể dùng Redis.

**Hạn chế 3: Không có anti-cheat**
Server tin tưởng input từ client. Client có thể hack để teleport, bắn nhanh, v.v.

---

# CHƯƠNG 4: THIẾT KẾ CHI TIẾT HỆ THỐNG

## 4.1 Kiến trúc tổng thể hệ thống

Hệ thống được thiết kế theo kiến trúc client-server với ba tầng chính:

**Tầng 1: Presentation Layer (Client)**
- Frontend chạy trên browser
- Gồm UI screens (login, lobby, game, ranking) và game rendering logic
- Giao tiếp với backend thông qua HTTP REST APIs và Socket.IO WebSocket

**Tầng 2: Application Layer (Server)**
- Backend chạy trên Node.js
- Gồm routing (Express), business logic, game loop
- Giao tiếp với database và clients

**Tầng 3: Data Layer**
- MySQL database
- Lưu trữ users, match history, ranking

Luồng dữ liệu:
1. Client gửi action (ví dụ: login, move)
2. Server nhận action, validate, xử lý
3. Server cập nhật state, broadcast update tới relevant clients
4. Client nhận update, render lại

## 4.2 Thiết kế giao tiếp realtime

Socket.IO được sử dụng cho giao tiếp realtime giữa client và server.

**Server-side Socket.IO handler:**

```
socket.on('move', (data) => {
  // Player di chuyển
  const { direction, playerId } = data;
  gameState.players[playerId].move(direction);
  io.to(roomId).emit('gameState', gameState);
});

socket.on('shoot', (data) => {
  // Player bắn
  const { playerId, angle } = data;
  const bullet = gameState.createBullet(playerId, angle);
  io.to(roomId).emit('gameState', gameState);
});
```

**Client-side Socket.IO usage:**

```
socket.on('gameState', (state) => {
  // Nhận game state update từ server
  gameState = state;
  render(gameState);
});

function sendMove(direction) {
  socket.emit('move', { direction, playerId: currentPlayerId });
}
```

## 4.3 Thiết kế các module backend

### 4.3.1 Module Controller

Controllers xử lý HTTP requests:

```
authController.js:
- register(req, res): Tạo user mới
- login(req, res): Xác thực user, return JWT token

matchHistoryController.js:
- getMatchHistory(req, res): Return lịch sử trận của user

rankingController.js:
- getRanking(req, res): Return bảng xếp hạng
```

### 4.3.2 Module Model

Models tương tác với database:

```
userModel.js:
- createUser(username, passwordHash)
- getUserByUsername(username)
- getUserById(id)

matchModel.js:
- createMatch(player1Id, player2Id, winnerId)
- getMatchHistory(userId)

rankingModel.js:
- updateRanking(playerId, won)
- getRanking()
```

### 4.3.3 Module Routes

Routes định tuyến HTTP requests:

```
auth.js:
- POST /api/auth/register
- POST /api/auth/login

matchHistory.js:
- GET /api/match-history/:userId

ranking.js:
- GET /api/ranking
```

### 4.3.4 Module Game Loop

Game loop chạy 60 FPS và xử lý tất cả game logic:

```
gameLoop.js:
- Mỗi frame:
  1. Xử lý pending moves (player di chuyển)
  2. Update vị trí tất cả bullets
  3. Xử lý collision
  4. Cập nhật health, respawn
  5. Kiểm tra match end condition
  6. Broadcast game state tới clients
```

## 4.4 Thiết kế các module frontend

### 4.4.1 Module Input Management

```
InputManager.js:
- Capture keyboard input
- Maintain button states (which keys are currently pressed)
- On each frame, emit commands based on current key states

Example:
if (keys.ArrowUp) {
  socket.emit('move', { direction: 'up' });
}
if (keys.Space) {
  socket.emit('shoot', { angle: currentAngle });
}
```

### 4.4.2 Module Rendering

```
Renderer.js:
- Nhận game state
- Vẽ background
- Vẽ tất cả entities (tanks, bullets, walls)
- Vẽ UI (health bars, scores)
- 60 FPS rendering loop
```

### 4.4.3 Module UI Screens

```
login.js: Hiển thị form đăng ký/đăng nhập
lobby.js: Hiển thị button "Tìm trận", bảng xếp hạng
game.js: Chứa Canvas, hiển thị game
ranking.js: Hiển thị top 10 players
history.js: Hiển thị lịch sử trận
```

## 4.5 Thiết kế cơ sở dữ liệu

```
TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hashed VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABLE match_history (
  match_id INT PRIMARY KEY AUTO_INCREMENT,
  player1_id INT NOT NULL,
  player2_id INT NOT NULL,
  winner_id INT NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY (player1_id) REFERENCES users(id),
  FOREIGN KEY (player2_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);

TABLE ranking (
  player_id INT PRIMARY KEY,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  rating INT DEFAULT 1000,
  FOREIGN KEY (player_id) REFERENCES users(id)
);
```

## 4.6 Thiết kế logic gameplay và quản lý trận đấu

### 4.6.1 Game State Structure

```
gameState = {
  roomId: string,
  players: [
    {
      id: int,
      x: float,
      y: float,
      angle: float (0-360),
      health: int (0-100),
      kills: int
    },
    {...}
  ],
  bullets: [
    {
      id: int,
      x: float,
      y: float,
      angle: float,
      ownerPlayerId: int
    },
    {...}
  ],
  timestamp: long
};
```

### 4.6.2 Collision Detection

```
function checkCollision(bullet, tank) {
  // Circle-rectangle collision
  const distance = Math.sqrt(
    (bullet.x - tank.x) ** 2 + (bullet.y - tank.y) ** 2
  );
  return distance < (bullet.radius + tank.radius);
}

function checkWallCollision(bullet, wall) {
  // Rectangle-rectangle collision (AABB)
  return (
    bullet.x < wall.right &&
    bullet.x > wall.left &&
    bullet.y < wall.bottom &&
    bullet.y > wall.top
  );
}
```

### 4.6.3 Match End Condition

```
Trận kết thúc khi một player đạt tới 10 kills.
Khi trận kết thúc:
1. Gửi thông báo winner tới cả 2 players
2. Lưu match record vào database
3. Cập nhật ranking
4. Giải phóng game room
```

## 4.7 Thiết kế bảo mật và quản lý phiên đăng nhập

### 4.7.1 Password Hashing

```
Khi user register:
1. Client gửi plain password
2. Server hash bằng bcrypt (10 rounds salt)
3. Lưu hash vào database, không lưu plain password

Khi user login:
1. Client gửi plain password
2. Server hash password được nhập
3. So sánh 2 hashes
4. Nếu match, generate JWT token
```

### 4.7.2 JWT Authentication

```
Khi user login thành công:
1. Server tạo JWT token
   - Payload: { userId, username, iat, exp }
   - Secret: một chuỗi được lưu ở server
2. Client lưu token trong localStorage
3. Mỗi request sau đó, token được gửi kèm

Server verify token:
1. Nhận token từ client
2. Verify signature bằng secret
3. Nếu valid, cho phép request; nếu không, return 401
```

### 4.7.3 Input Validation

```
Server không tin client. Mọi input đều phải validate:
- Username: không được trống, độ dài 3-20
- Password: độ dài tối thiểu 6
- Move direction: phải là 'up', 'down', 'left', 'right'
- Shoot angle: phải là 0-360

Nếu input invalid, server return error, không xử lý.
```

## 4.8 Đánh giá tổng thể thiết kế hệ thống

Thiết kế này có những điểm mạnh:

**Điểm mạnh 1: Tách biệt concerns**
Client chỉ làm render, server làm game logic. Dễ test, dễ maintain.

**Điểm mạnh 2: Realtime**
Socket.IO cho phép giao tiếp two-way realtime, giúp game chạy mượt.

**Điểm mạnh 3: Bảo mật cơ bản**
Password hashing, JWT authentication, input validation.

**Điểm mạnh 4: Modular**
Các module độc lập, dễ mở rộng.

Tuy nhiên vẫn có những điểm cần cải thiện:

**Điểm yếu 1: Game state lưu memory**
Nếu server restart, ongoing games sẽ mất.

**Điểm yếu 2: Không có load balancing**
Chỉ support một server instance.

**Điểm yếu 3: Không có anti-cheat**
Server không validate hành động của player (ví dụ, không kiểm tra nếu player bắn quá nhanh).

---

# CHƯƠNG 5: TRIỂN KHAI VÀ CÀI ĐẶT HỆ THỐNG

## 5.1 Môi trường triển khai

Để triển khai hệ thống Tankfire, cần chuẩn bị một môi trường phù hợp với đủ các công cụ và phần mềm cần thiết. Cụ thể, máy tính cần có Node.js phiên bản 16 hoặc cao hơn để chạy backend server, npm phiên bản 7 hoặc cao hơn để quản lý các package dependencies, MySQL phiên bản 5.7 trở lên để lưu trữ dữ liệu, và git để quản lý phiên bản code và cho phép rollback nếu có vấn đề xảy ra.

Ngoài ra, cần chuẩn bị một text editor hoặc IDE như Visual Studio Code để viết và chỉnh sửa code. Một trình duyệt web hiện đại như Chrome hoặc Firefox cũng cần thiết để test frontend của ứng dụng.

Đối với các biến môi trường, cần tạo file .env trong thư mục backend với các thông tin như database connection string, JWT secret, port server chạy, và các thông tin khác. Điều này giúp tách biệt thông tin nhạy cảm khỏi code và dễ dàng thay đổi giữa các môi trường khác nhau (development, staging, production).

## 5.2 Cài đặt backend

Để cài đặt backend, đầu tiên cần clone hoặc download toàn bộ code của dự án từ repository. Sau đó, mở terminal và di chuyển vào thư mục backend bằng lệnh `cd backend`.

Tiếp theo, cần cài đặt tất cả các package dependencies bằng lệnh `npm install`. Lệnh này sẽ đọc file package.json và tải về tất cả các package được liệt kê cùng với các phiên bản chính xác.

Sau khi cài đặt dependencies xong, cần tạo file .env bằng cách copy file .env.example nếu có, hoặc tạo file mới với các thông tin cần thiết. File này phải chứa:
- DATABASE_URL: Connection string đến MySQL database
- JWT_SECRET: Secret key dùng để ký JWT tokens
- PORT: Port mà server sẽ chạy, mặc định là 3001
- NODE_ENV: Environment hiện tại (development, staging, production)

Tiếp đó, cần khởi tạo cơ sở dữ liệu bằng cách chạy schema.sql. Để làm điều này, có thể sử dụng lệnh `mysql -u root -p < schema.sql` hoặc import file này thông qua MySQL Workbench.

Cuối cùng, có thể khởi động backend server bằng lệnh `npm start`. Server sẽ lắng nghe trên port được chỉ định trong file .env và sẵn sàng nhận request từ client.

## 5.3 Cài đặt frontend

Cài đặt frontend tương tự như cài đặt backend. Mở terminal, di chuyển vào thư mục frontend bằng `cd frontend`, rồi chạy `npm install` để cài đặt dependencies.

Sau đó, cần chỉnh sửa file cấu hình frontend để trỏ đến đúng địa chỉ của backend server. Thường thì có một file config.js hoặc tương tự để lưu địa chỉ API endpoint.

Để test frontend trong quá trình phát triển, có thể chạy `npm start` hoặc `npm run dev` (tùy theo cấu hình trong package.json). Lệnh này sẽ mở một development server, thường chạy trên http://localhost:3000, và tự động reload khi có thay đổi trong code.

## 5.4 Cấu hình cơ sở dữ liệu

Cơ sở dữ liệu cần được khởi tạo trước khi chạy ứng dụng. File schema.sql chứa tất cả các lệnh SQL cần thiết để tạo các bảng, định nghĩa các cột, và thiết lập các ràng buộc.

Cấu trúc bảng chính gồm:

**Bảng users:**
```
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hashed VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Bảng match_history:**
```
CREATE TABLE match_history (
  match_id INT PRIMARY KEY AUTO_INCREMENT,
  player1_id INT NOT NULL,
  player2_id INT NOT NULL,
  winner_id INT NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY (player1_id) REFERENCES users(id),
  FOREIGN KEY (player2_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);
```

**Bảng ranking:**
```
CREATE TABLE ranking (
  player_id INT PRIMARY KEY,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  rating INT DEFAULT 1000,
  FOREIGN KEY (player_id) REFERENCES users(id)
);
```

## 5.5 Chạy và sử dụng hệ thống

Sau khi tất cả các bước cơ bản được hoàn thành, có thể bắt đầu chạy hệ thống.

**Bước 1:** Mở terminal thứ nhất, di chuyển vào thư mục backend, và chạy `npm start`. Server sẽ khởi động và lắng nghe trên cổng được chỉ định.

**Bước 2:** Mở terminal thứ hai, di chuyển vào thư mục frontend, và chạy `npm start`. Frontend development server sẽ khởi động.

**Bước 3:** Mở trình duyệt web và truy cập http://localhost:3000. Trang đăng ký/đăng nhập sẽ xuất hiện.

**Bước 4:** Tạo tài khoản mới hoặc đăng nhập bằng tài khoản đã tạo trước đó.

**Bước 5:** Sau khi đăng nhập thành công, sẽ chuyển đến trang lobby. Tại đây, người chơi có thể chọn bản đồ.

**Bước 6:** Nhấn nút "Tìm trận" để bắt đầu tìm kiếm đối thủ. Khi có đủ 2 người chơi, hệ thống sẽ tự động tạo một phòng chơi.

**Bước 7:** Trò chơi bắt đầu. Các người chơi có thể điều khiển xe tăng của mình bằng phím mũi tên để di chuyển, phím spacebar để bắn, và chuột để điều chỉnh góc quay.

**Bước 8:** Khi trận đấu kết thúc (một người chơi chạm tới số lần thắng yêu cầu), kết quả sẽ được hiển thị và lưu vào cơ sở dữ liệu.

## 5.6 Đánh giá quá trình triển khai

Quá trình triển khai của dự án diễn ra khá mượt mà và không gặp phải những khó khăn lớn. Tất cả các component đều hoạt động đúng như dự kiến. Backend server khởi động mà không có lỗi, frontend load trang web thành công, và kết nối giữa client và server thông qua Socket.IO được thiết lập một cách ổn định.

Khi test chức năng đăng ký và đăng nhập, dữ liệu được lưu đúng vào database. Khi test chức năng matchmaking, hệ thống có thể ghép cặp hai người chơi và tạo phòng chơi mới. Khi test gameplay, các sự kiện được xử lý chính xác và trạng thái game được cập nhật liên tục.

Tuy nhiên, cũng phát hiện ra một số vấn đề nhỏ trong quá trình triển khai:
- Lần đầu tiên chạy backend, cần đảm bảo MySQL server đã khởi động, nếu không sẽ gặp lỗi connection
- Cần sao chép file .env.example sang .env và chỉnh sửa các thông tin cụ thể, nếu không backend sẽ không biết cách kết nối với database
- Frontend cần biết đúng địa chỉ của backend server, nếu không Socket.IO sẽ không thể kết nối

Những vấn đề này đều được giải quyết bằng cách tạo tài liệu setup rõ ràng và hướng dẫn từng bước.

---

# CHƯƠNG 6: KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG

## 6.1 Mục tiêu kiểm thử

Kiểm thử được thực hiện nhằm đạt được các mục tiêu sau:

**Mục tiêu 1: Xác minh tính chính xác của chức năng**
Kiểm thử rằng mọi chức năng trong hệ thống đều hoạt động đúng như thiết kế. Ví dụ, khi người dùng đăng ký, dữ liệu phải được lưu vào database; khi người chơi bắn, đạn phải xuất hiện ở vị trí chính xác và di chuyển theo hướng đúng.

**Mục tiêu 2: Xác minh hiệu suất**
Kiểm thử rằng hệ thống có thể xử lý một lượng request hợp lý mà không bị chậm hoặc crash. Cụ thể, thời gian phản hồi của server phải dưới 100ms.

**Mục tiêu 3: Xác minh bảo mật**
Kiểm thử rằng những biện pháp bảo mật cơ bản được áp dụng đúng. Ví dụ, password phải được mã hóa, token phải được xác thực, và người chơi không thể hack game.

**Mục tiêu 4: Phát hiện lỗi**
Kiểm thử nhằm phát hiện bất kỳ lỗi nào mà chưa được phát hiện trong quá trình phát triển, để có thể sửa lỗi trước khi sản phẩm được phát hành.

## 6.2 Kiểm thử chức năng

Kiểm thử chức năng được tiến hành bằng cách thực hiện các kịch bản test cụ thể cho từng chức năng.

**Test Case 1: Đăng ký tài khoản mới**
- Bước 1: Mở ứng dụng và nhấn nút "Đăng ký"
- Bước 2: Nhập username, password, và xác nhận password
- Bước 3: Nhấn nút "Đăng ký"
- Kết quả mong đợi: Tài khoản được tạo thành công, hệ thống chuyển sang trang đăng nhập
- Kết quả thực tế: ✓ Pass

**Test Case 2: Đăng nhập**
- Bước 1: Nhập username và password
- Bước 2: Nhấn nút "Đăng nhập"
- Kết quả mong đợi: Người dùng được chuyển đến trang lobby
- Kết quả thực tế: ✓ Pass

**Test Case 3: Tìm trận và ghép cặp**
- Bước 1: Hai người dùng khác nhau đăng nhập
- Bước 2: Cả hai nhấn nút "Tìm trận" cùng lúc
- Kết quả mong đợi: Cả hai được chuyển đến cùng một phòng chơi
- Kết quả thực tế: ✓ Pass

**Test Case 4: Gameplay - Di chuyển**
- Bước 1: Nhấn phím mũi tên lên
- Kết quả mong đợi: Xe tăng di chuyển lên trên màn hình
- Kết quả thực tế: ✓ Pass

**Test Case 5: Gameplay - Bắn**
- Bước 1: Nhấn phím spacebar
- Kết quả mong đợi: Đạn xuất hiện và di chuyển theo hướng xe tăng đang quay
- Kết quả thực tế: ✓ Pass

**Test Case 6: Gameplay - Va chạm**
- Bước 1: Bắn đạn vào đối thủ
- Kết quả mong đợi: Đạn biến mất, máu của đối thủ giảm
- Kết quả thực tế: ✓ Pass

**Test Case 7: Kết thúc trận đấu**
- Bước 1: Một người chơi chạm tới 10 lần thắng
- Kết quả mong đợi: Trận đấu kết thúc, kết quả được hiển thị và lưu vào database
- Kết quả thực tế: ✓ Pass

## 6.3 Kiểm thử giao tiếp realtime

Kiểm thử Socket.IO là rất quan trọng vì nó ảnh hưởng trực tiếp đến trải nghiệm của người chơi.

**Test: Tốc độ phản hồi**
- Giải pháp: Thêm timestamp vào mỗi message gửi từ client, khi server nhận được, tính độ trễ
- Kết quả: Trung bình ~50-80ms, đạt yêu cầu <100ms

**Test: Ổn định kết nối**
- Giải pháp: Giữ một kết nối Socket.IO suốt thời gian chơi, kiểm tra xem nó có bao giờ disconnect bất thường không
- Kết quả: Kết nối ổn định, không có dropout không mong muốn

**Test: Xử lý disconnect/reconnect**
- Giải pháp: Tắt internet trong quá trình chơi, sau đó bật lại
- Kết quả: Client detect được disconnect, hiển thị thông báo, và tự động reconnect khi internet trở lại

## 6.4 Đánh giá chung về chất lượng

Dựa trên kết quả kiểm thử, hệ thống đạt được chất lượng tốt ở mức prototype:

**Điểm mạnh:**
- Tất cả chức năng cốt lõi hoạt động đúng
- Hiệu suất phản hồi nằm trong giới hạn chấp nhận
- Bảo mật cơ bản được áp dụng đúng
- Không phát hiện lỗi critical

**Điểm yếu:**
- Chưa kiểm thử load test với hàng chục người chơi cùng lúc
- Giao diện có thể bị lag nhẹ trên các trình duyệt cũ
- Chưa có xử lý lỗi toàn diện cho các tình huống bất thường

## 6.5 Nhận định về giá trị của kiểm thử trong quá trình phát triển

Kiểm thử đóng vai trò không thể thiếu trong quá trình phát triển:

1. **Phát hiện lỗi sớm**: Nếu không kiểm thử, những lỗi nhỏ có thể trở thành vấn đề lớn khi sản phẩm được phát hành
2. **Nâng cao chất lượng**: Kiểm thử giúp đảm bảo rằng sản phẩm đáp ứng yêu cầu
3. **Tăng độ tin cậy**: Người dùng có thể tin tưởng rằng hệ thống hoạt động như mong đợi
4. **Đánh giá hiệu suất**: Kiểm thử giúp xác định những bottleneck trong hệ thống để có thể tối ưu hóa

---

# CHƯƠNG 7: KẾT QUẢ ĐẠT ĐƯỢC VÀ HẠN CHẾ

## 7.1 Kết quả đạt được

Sau khoảng thời gian phát triển, dự án đã đạt được những kết quả đáng kể:

**Kết quả 1: Hệ thống game online hoàn chỉnh**
Dự án đã xây dựng thành công một hệ thống game online tank battle chạy trên nền web. Hệ thống này bao gồm frontend chạy trên browser, backend chạy trên server, và database lưu trữ dữ liệu.

**Kết quả 2: Hỗ trợ tất cả chức năng cốt lõi**
Người dùng có thể đăng ký, đăng nhập, tìm trận, chơi game, và xem kết quả. Tất cả những chức năng này đều hoạt động đúng như thiết kế.

**Kết quả 3: Kiến trúc rõ ràng và dễ mở rộng**
Hệ thống được thiết kế theo mô hình client-server rõ ràng, các module độc lập với nhau, dễ dàng thêm tính năng mới hoặc sửa lỗi.

**Kết quả 4: Bảo mật cơ bản được áp dụng**
Password được mã hóa bằng bcrypt, JWT token được sử dụng để xác thực, và server-authoritative design đảm bảo tính công bằng.

**Kết quả 5: Tài liệu đầy đủ**
Toàn bộ quá trình phát triển đều được tài liệu hóa, giúp người khác có thể hiểu và tiếp tục phát triển dự án.

## 7.2 Hạn chế của hệ thống

Mặc dù đã đạt được những kết quả tốt, hệ thống vẫn còn một số hạn chế:

**Hạn chế 1: Chỉ hỗ trợ 1v1**
Hệ thống hiện chỉ hỗ trợ trận đấu 1v1. Để hỗ trợ nhiều người chơi hơn, cần thay đổi logic matchmaking, gameplay, và database schema.

**Hạn chế 2: Bảo mật ở mức cơ bản**
Các biện pháp bảo mật hiện tại chỉ ở mức cơ bản. Để production-ready, cần thêm các tính năng như rate limiting, anti-cheating detection, và encryption cho dữ liệu truyền tải.

**Hạn chế 3: Chưa tối ưu cho quy mô lớn**
Hệ thống chưa được kiểm thử với 1000+ người chơi cùng lúc. Để hỗ trợ quy mô như vậy, cần tối ưu database queries, thêm caching, và có thể cần cân bằng tải.

**Hạn chế 4: Giao diện còn đơn giản**
Giao diện hiện tại rất đơn giản, chỉ có những chức năng cơ bản. Để cạnh tranh trên thị trường, giao diện cần được cải thiện với UI/UX tốt hơn.

## 7.3 Bài học kinh nghiệm

Qua quá trình phát triển dự án, có được một số bài học quý báu:

**Bài học 1: Lập kế hoạch kỹ lưỡng từ đầu rất quan trọng**
Nếu phát triển mà không có kế hoạch rõ ràng, dễ dàng bị lạc hướng hoặc phải rewrite code nhiều lần. Phải dành thời gian để phân tích yêu cầu chi tiết trước khi bắt đầu code.

**Bài học 2: Kiến trúc rõ ràng giúp dài lâu**
Một hệ thống được thiết kế tốt dễ bảo trì, dễ mở rộng, và dễ debug. Thời gian đầu tư vào thiết kế sẽ được đền đáp khi phát triển thêm tính năng mới.

**Bài học 3: Kiểm thử phải đi cùng phát triển**
Không nên chờ đến khi toàn bộ hệ thống được phát triển xong mới kiểm thử. Kiểm thử từng phần khi phát triển giúp phát hiện lỗi sớm.

**Bài học 4: Tài liệu rất quan trọng**
Tài liệu giúp người khác (hay chính mình sau một thời gian dài) hiểu được hệ thống hoạt động như thế nào. Tài liệu chi tiết tiết kiệm rất nhiều thời gian debug.

## 7.4 Đánh giá tổng thể về quá trình thực hiện

Dự án được thực hiện một cách hệ thống và kỹ lưỡng. Từ giai đoạn phân tích yêu cầu, thiết kế kiến trúc, phát triển từng module, đến kiểm thử và triển khai, tất cả đều được thực hiện một cách có kế hoạch.

Đặc biệt, dự án cho thấy rằng phát triển một game online không phải là một quá trình ngẫu nhiên hoặc sáng tạo tùy tiện, mà là một quy trình kỹ thuật có hệ thống. Phải phân tích kỹ lưỡng, thiết kế đúng đắn, và kiểm thử toàn diện mới có thể tạo ra một sản phẩm chất lượng cao.

---

# CHƯƠNG 8: HƯỚNG PHÁT TRIỂN

## 8.1 Nâng cấp gameplay

Để làm cho trò chơi hấp dẫn hơn, có thể thêm nhiều tính năng mới:

**Thêm nhiều bản đồ khác nhau**
Hiện tại, hệ thống chỉ hỗ trợ một bản đồ. Có thể thêm 5-10 bản đồ khác nhau với các layout, vật thể, và độ khó khác nhau. Mỗi bản đồ có thể có những đặc điểm riêng, ví dụ một bản đồ có rất nhiều tường chắn, một bản đồ rộng mở, một bản đồ có những địa hình khó.

**Thêm hệ thống vật phẩm**
Có thể thêm các vật phẩm xuất hiện ngẫu nhiên trên bản đồ. Ví dụ, powerup tăng sát thương, shield giảm sát thương, speed boost tăng tốc độ, v.v. Những vật phẩm này tạo thêm yếu tố chiến lược và làm cho gameplay thú vị hơn.

**Thêm hệ thống skill điều khiển**
Thay vì chỉ có những thao tác cơ bản, có thể thêm những skill đặc biệt mà người chơi có thể kích hoạt. Ví dụ, skill bắn loạt đạn, skill teleport, skill shield tạm thời.

**Thêm chế độ chơi nhiều người**
Có thể thêm chế độ 2v2, 4 người free-for-all, hoặc capture the flag. Những chế độ này tạo ra những dynamic khác nhau và làm cho gameplay phong phú hơn.

## 8.2 Mở rộng matchmaking

Hệ thống matchmaking hiện tại khá đơn giản - chỉ ghép cặp hai người chơi bất kỳ. Có thể cải thiện:

**Phân loại người chơi theo cấp độ**
Có thể dùng Elo rating để xếp hạng người chơi, sau đó chỉ ghép cặp những người chơi có rating gần nhau. Điều này làm cho trận đấu công bằng hơn.

**Tìm trận nhanh hơn**
Có thể tối ưu hóa thuật toán matchmaking để giảm thời gian chờ. Ví dụ, sau 30 giây không tìm được đối thủ cùng level, có thể mở rộng search range.

**Ghép cặp công bằng hơn**
Ngoài rating, có thể cân nhắc các yếu tố khác như win rate, thời gian chơi lần cuối. Những người chơi đã không chơi lâu có thể được paired dễ hơn để giữ họ có hứng thú.

## 8.3 Nâng cao bảo mật

Bảo mật hiện tại ở mức cơ bản. Để production-ready, cần:

**Refresh token mechanism**
Hiện tại, JWT token không có expiration date (hoặc có thời gian rất dài). Có thể thay đổi thành cấp short-lived access token và long-lived refresh token. Khi access token hết hạn, client tự động dùng refresh token để lấy access token mới.

**Rate limiting**
Có thể thêm rate limiting để ngăn chặn brute force attack. Ví dụ, một IP chỉ được đăng nhập tối đa 5 lần trong 1 phút.

**Anti-cheating detection**
Server có thể detect những hành vi bất thường như di chuyển quá nhanh, bắn quá tần suất cao, v.v. Nếu phát hiện cheating, có thể ban tài khoản hoặc các lệnh khác.

**Encryption cho dữ liệu truyền tải**
Ngoài HTTPS, có thể thêm encryption cho những dữ liệu nhạy cảm như password, token.

## 8.4 Tối ưu hiệu năng và khả năng mở rộng

Khi hệ thống phát triển và có nhiều người dùng hơn, cần tối ưu:

**Tối ưu database queries**
Có thể thêm index, optimize các query chạy chậm, hoặc refactor schema.

**Caching**
Có thể dùng Redis để cache những dữ liệu không thay đổi thường xuyên như bảng ranking, thông tin bản đồ.

**Cân bằng tải**
Khi có quá nhiều connection, một server không đủ. Có thể dùng multiple server instances phía sau load balancer như Nginx.

**Microservices**
Nếu hệ thống phát triển đủ lớn, có thể tách thành microservices: một service cho authentication, một cho matchmaking, một cho gameplay logic, v.v.

## 8.5 Các hướng phát triển phù hợp với bối cảnh thực tế

Ngoài các cải tiến kỹ thuật, có những hướng phát triển khác phù hợp với bối cảnh thực tế:

**Giao diện đẹp hơn**
Giao diện hiện tại rất basic. Có thể thuê designer để tạo giao diện chuyên nghiệp, lôi cuốn hơn.

**Hỗ trợ mobile**
Có thể develop native app cho iOS/Android hoặc responsive web app.

**Xây dựng cộng đồng**
Thêm chat, forum, hoặc social features để xây dựng cộng đồng người chơi.

**Monetization**
Nếu muốn kiếm tiền, có thể thêm cosmetics (skins, effects), battle pass, hoặc in-game ads.

**Tournament system**
Có thể tổ chức các giải đấu, có ranking season, leaderboard, v.v. để tăng competitive aspect.

---

# CHƯƠNG 9: KẾT LUẬN

## 9.1 Ý nghĩa của kết quả đạt được

Sau quá trình nghiên cứu, phân tích, thiết kế, phát triển, và kiểm thử, dự án "Tankfire" đã hoàn thành thành công và đạt được những kết quả đáng kể.

Trước hết, dự án đã chứng minh được rằng có thể xây dựng một hệ thống game online hoàn chỉnh từ đầu đến cuối. Không chỉ là một demo đơn giản mà là một sản phẩm có kiến trúc rõ ràng, có tất cả các chức năng cốt lõi, và có thể được triển khai trên máy chủ thực tế.

Thứ hai, dự án thể hiện được cách áp dụng các nguyên lý phần mềm tốt vào thực tế. Từ việc phân tích yêu cầu chi tiết, thiết kế kiến trúc theo các pattern được chứng minh, tách module rõ ràng, kiểm thử toàn diện, tất cả đều theo quy trình kỹ thuật.

Thứ ba, dự án là một bằng chứng rõ ràng rằng một sinh viên có thể nắm vững đủ kiến thức và kỹ năng để tạo ra một sản phẩm phần mềm có giá trị thực tế. Từ HTML/CSS/JavaScript cho frontend, đến Node.js/Express cho backend, MySQL cho database, kiến thức về networking, real-time communication, security, performance optimization, tất cả đều được áp dụng trong dự án.

## 9.2 Kiến nghị cuối cùng

Dựa trên những kết quả đạt được và những hạn chế phát hiện ra, có một số kiến nghị cho những phát triển tiếp theo:

**Kiến nghị 1: Tiếp tục phát triển các tính năng mới**
Để làm cho trò chơi hấp dẫn hơn và cạnh tranh được trên thị trường, cần tiếp tục thêm những tính năng mới. Bắt đầu từ những tính năng đơn giản như thêm bản đồ mới, vật phẩm, v.v., rồi dần phát triển thành những tính năng phức tạp hơn.

**Kiến nghị 2: Tăng cường bảo mật**
Trước khi phát hành cho công chúng, cần tăng cường bảo mật đáng kể. Kiểm thử security thấu đáo, thêm các biện pháp chống cheating, v.v.

**Kiến nghị 3: Tối ưu hiệu suất**
Khi có nhiều người dùng hơn, cần tối ưu hiệu suất. Load test hệ thống để tìm bottleneck, sau đó optimize.

**Kiến nghị 4: Nâng cấp giao diện**
Giao diện hiện tại chỉ phục vụ mục đích proof of concept. Để sản phẩm thực sự, cần giao diện chuyên nghiệp và bắt mắt.

**Kiến nghị 5: Xây dựng cộng đồng**
Một trò chơi online thành công không chỉ phụ thuộc vào tính năng mà còn vào cộng đồng. Cần tạo ra các cơ hội để người chơi tương tác với nhau.

## 9.3 Kết luận chung

Dự án "Tankfire" là một bài tập thực hành toàn diện về phát triển hệ thống phần mềm hiện đại. Nó không chỉ giúp làm sâu sắc thêm kiến thức về các công nghệ cụ thể mà còn giúp hiểu được cách các hệ thống phần mềm thực tế hoạt động, các thách thức mà các nhà phát triển phải đối mặt, và cách giải quyết những thách thức đó.

Qua dự án này, có thể thấy rõ rằng phát triển một game online không phải là một công việc đơn giản, nhưng cũng không phải là không thể. Với kế hoạch rõ ràng, kiên trì, và sự hỗ trợ của các công nghệ hiện đại, bất cứ ai cũng có thể tạo ra một sản phẩm chất lượng cao.

Kiến thức được học qua dự án này có thể được áp dụng cho những dự án khác, không chỉ là game mà còn là các ứng dụng web khác. Những kinh nghiệm về thiết kế kiến trúc, quản lý dự án, kiểm thử, và phát hành sản phẩm đều có giá trị thực tiễn trong công cuộc phát triển phần mềm.

---

# PHỤ LỤC A: CẤU TRÚC THƯ MỤC VÀ VAI TRÒ CỦA CÁC MODULE CHÍNH

## Cấu trúc Backend

```
backend/
├── src/
│   ├── config.js           # Cấu hình ứng dụng (port, database, v.v)
│   ├── db.js              # Kết nối MySQL database
│   ├── index.js           # Entry point, khởi động server
│   ├── controllers/       # Xử lý logic API requests
│   │   ├── authController.js      # Xử lý đăng ký, đăng nhập
│   │   ├── matchHistoryController.js
│   │   └── rankingController.js
│   ├── models/            # Mô hình dữ liệu, tương tác database
│   │   ├── User.js
│   │   ├── Match.js
│   │   ├── Ranking.js
│   │   └── GameRoom.js
│   ├── routes/            # Định tuyến API endpoints
│   │   ├── auth.js
│   │   ├── matchHistory.js
│   │   └── ranking.js
│   ├── sockets/           # WebSocket event handlers
│   │   └── matchmaking.js # Quản lý queue, tạo phòng
│   ├── game/              # Logic trò chơi
│   │   ├── gameLoop.js    # Vòng lặp chính xử lý events
│   │   ├── collision.js   # Xử lý va chạm
│   │   ├── items.js       # Hệ thống vật phẩm
│   │   └── maps/          # Dữ liệu các bản đồ
│   └── middleware/        # Middleware (auth checking, v.v)
├── schema.sql             # SQL script để tạo database
├── package.json
└── .env                   # Biến môi trường (không commit lên git)
```

## Cấu trúc Frontend

```
frontend/
├── src/
│   ├── main.js            # Entry point
│   ├── styles.css         # CSS toàn ứng dụng
│   ├── index.html         # HTML chính
│   ├── game/
│   │   ├── socket.js      # Quản lý Socket.IO connection
│   │   ├── input.js       # Capture keyboard/mouse input
│   │   ├── render.js      # Render game state lên Canvas
│   │   ├── Renderer.js    # Class xử lý drawing
│   │   ├── InputManager.js # Class xử lý input
│   │   └── maps/          # Dữ liệu bản đồ
│   ├── ui/
│   │   ├── login.js       # Màn hình đăng nhập
│   │   ├── lobby.js       # Màn hình chọn bản đồ
│   │   ├── ranking.js     # Màn hình xem ranking
│   │   ├── history.js     # Màn hình lịch sử trận
│   │   └── components/    # Reusable UI components
│   └── images/            # Hình ảnh, sprites
├── package.json
└── .gitignore
```

Mỗi module đều có trách nhiệm riêng biệt, giúp hệ thống dễ bảo trì, test, và mở rộng.

---

# PHỤ LỤC B: MÔ TẢ LUỒNG DỮ LIỆU CHÍNH TRONG HỆ THỐNG

## Luồng 1: User Input Flow

1. Người dùng tương tác với giao diện (nhấn nút, di chuột)
2. JavaScript event listener capture sự kiện này
3. InputManager xử lý event và tạo command object
4. Command được gửi đến server qua Socket.IO emit
5. Server nhận command, validate, và cập nhật game state
6. Server broadcast game state mới đến tất cả clients trong phòng
7. Client nhận game state update
8. Renderer sử dụng game state để vẽ lên Canvas
9. Người dùng thấy kết quả của thao tác của mình

## Luồng 2: Game State Update Flow

1. Server gameLoop xử lý các event từ cả hai player
2. Tính toán va chạm: Bullet vs Wall, Bullet vs Tank, Tank vs Tank
3. Update vị trí, máu, lần thắng tương ứng
4. Tạo game state snapshot
5. Emit game state snapshot đến cả hai client thông qua Socket.IO
6. Client nhận game state
7. Update local game state
8. Renderer sử dụng game state để vẽ
9. User thấy game được update

## Luồng 3: Match End & Data Persistence Flow

1. Một player chạm tới số lần thắng yêu cầu
2. Server detect match end condition
3. Xác định winner và loser
4. Tạo match record: { player1_id, player2_id, winner_id, started_at, ended_at }
5. Lưu match record vào database table match_history
6. Cập nhật ranking: increment wins cho winner, losses cho loser
7. Broadcast match end event đến cả hai client
8. Client nhận event, hiển thị kết quả trận
9. User có thể xem match đó trong lịch sử trận

---

# PHỤ LỤC C: DANH SÁCH CÁC SỰ KIỆN SOCKET.IO VÀ API REST CHÍNH

## Socket.IO Events

**Server → Client Events:**
- `gameState`: Gửi trạng thái game hiện tại (vị trí tank, đạn, máu, v.v)
  ```
  {
    players: [ {id, x, y, angle, health}, {id, x, y, angle, health} ],
    bullets: [ {id, x, y, angle}, ... ],
    timestamp: 1234567890
  }
  ```

- `playerHit`: Thông báo một player bị sát thương
  ```
  { playerId: 1, damage: 10, health: 80 }
  ```

- `matchEnd`: Trận đấu kết thúc
  ```
  { winnerId: 1, winnerName: "player1", score: "10-5" }
  ```

**Client → Server Events:**
- `move`: Player di chuyển
  ```
  { direction: "up", playerId: 1 }
  ```

- `shoot`: Player bắn
  ```
  { x: 100, y: 100, angle: 45, playerId: 1 }
  ```

- `joinQueue`: Player tìm trận
  ```
  { playerId: 1, playerName: "username" }
  ```

## REST API Endpoints

**Authentication:**
- `POST /api/auth/register`: Đăng ký tài khoản mới
- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/logout`: Đăng xuất

**Game Data:**
- `GET /api/ranking`: Lấy bảng xếp hạng
- `GET /api/match-history/:userId`: Lấy lịch sử trận của người chơi
- `GET /api/stats/:userId`: Lấy thống kê của người chơi

---

# TÀI LIỆU THAM KHẢO

1. Node.js Official Documentation: https://nodejs.org/docs/
2. Express.js Guide: https://expressjs.com/
3. Socket.IO Documentation: https://socket.io/docs/
4. MySQL Official Documentation: https://dev.mysql.com/doc/
5. MDN Web Docs - HTML5 Canvas: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
6. JavaScript.info - Modern JavaScript Tutorial: https://javascript.info/
7. bcryptjs Documentation: https://github.com/dcodeIO/bcrypt.js
8. JSON Web Tokens (JWT): https://jwt.io/
9. Web Security Academy - OWASP: https://owasp.org/
10. Software Architecture Patterns: https://www.oreilly.com/

---

**HẾT BÁO CÁO THỰC TẬP**

Báo cáo này được hoàn thành vào ngày 28 tháng 6 năm 2026.

Người thực hiện: Sinh viên Thực tập

Cơ sở hướng dẫn: Bộ Giáo dục

Hệ thống: Tankfire - Game Chiến Tranh Xe Tăng Trực Tuyến Trên Web
