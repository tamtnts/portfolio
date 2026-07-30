# Chú thích thành phần Architecture — Fleet Operations Platform

## 1. Mục đích và phạm vi

Tài liệu này giải thích các thành phần xuất hiện trong C4 Model công khai của
ba project thuộc Fleet Operations Platform. Tên và luồng đã được tổng quát hóa
để bảo mật; tài liệu không mô tả nguyên trạng hệ thống production.

Mỗi thành phần được trình bày theo năm ý:

- **Nhiệm vụ:** trách nhiệm chính của thành phần.
- **Tác dụng:** giá trị của thành phần trong kiến trúc.
- **Đầu vào:** loại yêu cầu, sự kiện hoặc dữ liệu được nhận.
- **Đầu ra:** phản hồi, sự kiện, dữ liệu lưu trữ hoặc lời gọi được tạo ra.
- **Quan hệ chính:** thành phần liên quan và kiểu giao tiếp đã được xác nhận.

## 2. Cách đọc C4 Model trong portfolio

- **C1 — System Context:** mô tả con người và hệ thống bên ngoài tương tác với Fleet Operations Platform.
- **C2 — Container View:** mô tả ba backend service, client, event infrastructure và data store chính.
- **C3 — Component View:** mô tả các khối trách nhiệm bên trong từng backend service.

## 3. C1 — Fleet Operations Platform

C1 chủ đích xem Fleet Operations Platform là một software system duy nhất và không phơi bày các service nội bộ.

#### Fleet Operations Staff (person)
**Nhiệm vụ:** Nhân sự vận hành sử dụng platform cho workflow, lookup và reporting.
**Tác dụng:** Cung cấp góc nhìn người dùng vận hành ở ranh giới C1.
**Đầu vào:** Nhu cầu workflow, tra cứu hoặc báo cáo.
**Đầu ra:** Yêu cầu sử dụng gửi tới Fleet Operations Platform.
**Quan hệ chính:** Dùng Fleet Operations Platform; C1 không mô tả service nội bộ.

#### Administrator / Dispatcher (person)
**Nhiệm vụ:** Người quản trị hoặc điều phối sử dụng platform cho planning, resources và coordination.
**Tác dụng:** Cung cấp góc nhìn quản trị ở ranh giới C1.
**Đầu vào:** Nhu cầu lập kế hoạch, nguồn lực hoặc điều phối.
**Đầu ra:** Yêu cầu sử dụng gửi tới Fleet Operations Platform.
**Quan hệ chính:** Dùng Fleet Operations Platform; C1 không mô tả service nội bộ.

#### Fleet Operations Platform (software system)
**Nhiệm vụ:** Cung cấp ranh giới software system cho hoạt động fleet đã tổng quát hóa.
**Tác dụng:** Gom các tương tác C1 mà không tiết lộ cấu trúc nội bộ.
**Đầu vào:** Yêu cầu từ Fleet Operations Staff, Administrator / Dispatcher và trao đổi được phê duyệt từ nguồn dữ liệu.
**Đầu ra:** Phản hồi cho người dùng và requests, responses hoặc events được phê duyệt.
**Quan hệ chính:** Được hai nhóm người dùng sử dụng và trao đổi hai chiều với Approved Operational Data Sources qua REST/gRPC và approved events.

#### Approved Operational Data Sources (external system)
**Nhiệm vụ:** Đại diện các external system đã được phê duyệt cung cấp hoặc nhận dữ liệu vận hành.
**Tác dụng:** Xác định ranh giới tích hợp bên ngoài của C1.
**Đầu vào:** REST/gRPC requests, responses và approved events từ Fleet Operations Platform.
**Đầu ra:** REST/gRPC requests, responses và approved events tới Fleet Operations Platform.
**Quan hệ chính:** Trao đổi hai chiều với Fleet Operations Platform; C1 không mô tả chi tiết nội bộ.

## 4. Project 1 — Fleet Operations Core

### 4.1. C2 — Container View

Fleet Operations Core là current service trong topology này.

#### Operations Client
**Nhiệm vụ:** Cung cấp client cho các luồng vận hành.
**Tác dụng:** Đưa yêu cầu tương tác vào Fleet Operations Core.
**Đầu vào:** Thao tác vận hành từ người dùng.
**Đầu ra:** REST hoặc gRPC request tới Fleet Operations Core service.
**Quan hệ chính:** Gọi Fleet Operations Core service qua REST hoặc gRPC.

#### Administration Client
**Nhiệm vụ:** Cung cấp client cho các luồng quản trị và điều phối.
**Tác dụng:** Đưa yêu cầu administration vào platform.
**Đầu vào:** Thao tác planning, resources hoặc coordination.
**Đầu ra:** REST hoặc gRPC request tới Fleet Administration & Dispatch service.
**Quan hệ chính:** Gọi Fleet Administration & Dispatch service qua REST hoặc gRPC.

#### Fleet Operations Core service
**Nhiệm vụ:** Xử lý workflow, lookup và reporting ở ranh giới operational core.
**Tác dụng:** Là current service của Project 1.
**Đầu vào:** REST/gRPC requests từ Operations Client; plans, resources và configuration từ Fleet Administration & Dispatch service.
**Đầu ra:** Lookup/search requests, operational events và truy cập data store riêng.
**Quan hệ chính:** Dùng Operations PostgreSQL và Operational Redis cache; gọi Fleet Data Intelligence Hub service; nhận dữ liệu đồng bộ từ Fleet Administration & Dispatch service; publish operational events tới Kafka.

#### Fleet Administration & Dispatch service
**Nhiệm vụ:** Cung cấp planning, resources và configuration cho platform.
**Tác dụng:** Tách administration và dispatch khỏi operational core.
**Đầu vào:** REST/gRPC requests từ Administration Client.
**Đầu ra:** Plans, resources, configuration, aggregated lookup requests và reference/coordination events.
**Quan hệ chính:** Cung cấp dữ liệu cho Fleet Operations Core service; gọi Fleet Data Intelligence Hub service; dùng Administration PostgreSQL và Administration Redis cache; publish tới Kafka.

#### Fleet Data Intelligence Hub service
**Nhiệm vụ:** Cung cấp lookup, search và aggregated lookup theo kiến trúc đã công khai.
**Tác dụng:** Tách read-oriented data intelligence khỏi hai service còn lại.
**Đầu vào:** Lookup/search requests, aggregated lookup requests và synchronization events từ Kafka.
**Đầu ra:** Dữ liệu lookup hoặc search; truy cập Intelligence PostgreSQL và Elasticsearch search index.
**Quan hệ chính:** Được Fleet Operations Core service và Fleet Administration & Dispatch service gọi qua REST/gRPC; nhận synchronization events từ Kafka.

#### Kafka event broker
**Nhiệm vụ:** Vận chuyển event giữa các service theo hướng bất đồng bộ.
**Tác dụng:** Tách publication của source service khỏi synchronization của data service.
**Đầu vào:** Operational events từ Fleet Operations Core service; reference và coordination events từ Fleet Administration & Dispatch service.
**Đầu ra:** Synchronization events tới Fleet Data Intelligence Hub service.
**Quan hệ chính:** Nhận publication từ Core và Administration & Dispatch, rồi chuyển event cho Data Intelligence Hub.

#### Operations PostgreSQL
**Nhiệm vụ:** Lưu relational data thuộc Fleet Operations Core service.
**Tác dụng:** Cung cấp persistence riêng cho operational core.
**Đầu vào:** Truy cập persistence từ Fleet Operations Core service.
**Đầu ra:** Dữ liệu relational phục vụ Fleet Operations Core service.
**Quan hệ chính:** Chỉ được mô tả là data store do Fleet Operations Core service sử dụng.

#### Operational Redis cache
**Nhiệm vụ:** Lưu cache state rõ ràng cho Fleet Operations Core service.
**Tác dụng:** Hỗ trợ các read hoặc workflow state phù hợp mà không thay thế relational truth.
**Đầu vào:** Truy cập cache từ Fleet Operations Core service.
**Đầu ra:** Cache state cho Fleet Operations Core service.
**Quan hệ chính:** Chỉ được mô tả là cache do Fleet Operations Core service sử dụng.

#### Administration PostgreSQL
**Nhiệm vụ:** Lưu relational data thuộc Fleet Administration & Dispatch service.
**Tác dụng:** Cung cấp persistence riêng cho administration.
**Đầu vào:** Truy cập persistence từ Fleet Administration & Dispatch service.
**Đầu ra:** Dữ liệu relational phục vụ Fleet Administration & Dispatch service.
**Quan hệ chính:** Chỉ được mô tả là data store do Fleet Administration & Dispatch service sử dụng.

#### Administration Redis cache
**Nhiệm vụ:** Lưu cache state cho Fleet Administration & Dispatch service.
**Tác dụng:** Hỗ trợ các responsibility cache và coordination đã công khai.
**Đầu vào:** Truy cập cache từ Fleet Administration & Dispatch service.
**Đầu ra:** Cache state cho Fleet Administration & Dispatch service.
**Quan hệ chính:** Chỉ được mô tả là cache do Fleet Administration & Dispatch service sử dụng.

#### Intelligence PostgreSQL
**Nhiệm vụ:** Lưu relational read data thuộc Fleet Data Intelligence Hub service.
**Tác dụng:** Là persistence cho read-oriented data intelligence.
**Đầu vào:** Truy cập dữ liệu từ Fleet Data Intelligence Hub service.
**Đầu ra:** Dữ liệu relational phục vụ lookup và aggregation.
**Quan hệ chính:** Chỉ được mô tả là data store do Fleet Data Intelligence Hub service sử dụng.

#### Elasticsearch search index
**Nhiệm vụ:** Cung cấp search-oriented projection cho Fleet Data Intelligence Hub service.
**Tác dụng:** Hỗ trợ search trong data intelligence.
**Đầu vào:** Truy cập search từ Fleet Data Intelligence Hub service.
**Đầu ra:** Kết quả search phục vụ data intelligence.
**Quan hệ chính:** Chỉ được mô tả là search index do Fleet Data Intelligence Hub service sử dụng.

### 4.2. C3 — Component View

#### REST and gRPC API
**Nhiệm vụ:** Nhận request tại API boundary của Fleet Operations Core.
**Tác dụng:** Tách transport contract khỏi use-case orchestration.
**Đầu vào:** REST hoặc gRPC request vận hành và lookup.
**Đầu ra:** Request đã được chuyển cho Workflow and Query Use Cases và response chuẩn hóa.
**Quan hệ chính:** Delegate requests tới Workflow and Query Use Cases.

#### Workflow and Query Use Cases
**Nhiệm vụ:** Điều phối workflow, query, state và ownership rules đã hỗ trợ.
**Tác dụng:** Là nơi phối hợp outbound adapter của Core.
**Đầu vào:** Request đã được REST and gRPC API chuyển vào.
**Đầu ra:** Thao tác persistence, cache, integration, event hoặc document theo use case.
**Quan hệ chính:** Điều phối Persistence Adapter, Cache Adapter, Service Integration Adapters, Event Adapter và Document Renderer.

#### Persistence Adapter
**Nhiệm vụ:** Cô lập truy cập relational persistence của Core.
**Tác dụng:** Giữ use case tách khỏi chi tiết PostgreSQL.
**Đầu vào:** Lệnh đọc hoặc ghi từ Workflow and Query Use Cases.
**Đầu ra:** Dữ liệu persistence hoặc kết quả thao tác.
**Quan hệ chính:** Truy cập PostgreSQL.

#### Cache Adapter
**Nhiệm vụ:** Cô lập truy cập cache state của Core.
**Tác dụng:** Giữ trách nhiệm cache rõ ràng.
**Đầu vào:** Yêu cầu cache từ Workflow and Query Use Cases.
**Đầu ra:** Cache state hoặc kết quả cache.
**Quan hệ chính:** Truy cập Redis.

#### Service Integration Adapters
**Nhiệm vụ:** Gọi các service platform liên quan.
**Tác dụng:** Tách integration contract khỏi use case.
**Đầu vào:** Yêu cầu integration từ Workflow and Query Use Cases.
**Đầu ra:** REST/gRPC calls và dữ liệu phản hồi liên quan.
**Quan hệ chính:** Gọi Related Platform Services qua REST hoặc gRPC.

#### Event Adapter
**Nhiệm vụ:** Publish event được chọn từ Core.
**Tác dụng:** Hỗ trợ asynchronous synchronization.
**Đầu vào:** Event cần publish từ Workflow and Query Use Cases.
**Đầu ra:** Event được publish.
**Quan hệ chính:** Publish events qua Kafka.

#### Document Renderer
**Nhiệm vụ:** Tạo approved document output cho luồng operational được hỗ trợ.
**Tác dụng:** Tách document generation khỏi transport layer.
**Đầu vào:** Dữ liệu đã được use case điều phối.
**Đầu ra:** Document output được phê duyệt.
**Quan hệ chính:** Được Workflow and Query Use Cases điều phối.

#### PostgreSQL
**Nhiệm vụ:** Cung cấp relational persistence trong component view của Core.
**Tác dụng:** Lưu relational truth cho use case được hỗ trợ.
**Đầu vào:** Truy cập từ Persistence Adapter.
**Đầu ra:** Dữ liệu persistence cho Persistence Adapter.
**Quan hệ chính:** Được Persistence Adapter truy cập.

#### Redis
**Nhiệm vụ:** Cung cấp cache state trong component view của Core.
**Tác dụng:** Hỗ trợ cache rõ ràng, tách khỏi relational persistence.
**Đầu vào:** Truy cập từ Cache Adapter.
**Đầu ra:** Cache state cho Cache Adapter.
**Quan hệ chính:** Được Cache Adapter truy cập.

#### Related Platform Services
**Nhiệm vụ:** Đại diện các service platform liên quan mà Core cần gọi.
**Tác dụng:** Xác định ranh giới service-to-service đã công khai.
**Đầu vào:** REST/gRPC calls từ Service Integration Adapters.
**Đầu ra:** Dữ liệu hoặc phản hồi phục vụ use case.
**Quan hệ chính:** Được Service Integration Adapters gọi qua REST hoặc gRPC.

#### Kafka
**Nhiệm vụ:** Cung cấp event channel cho Core.
**Tác dụng:** Chuyển selected operational events ra khỏi Core.
**Đầu vào:** Event từ Event Adapter.
**Đầu ra:** Event đã publish cho consumer phù hợp.
**Quan hệ chính:** Được Event Adapter dùng để publish events.

### 4.3. Luồng tổng quát

1. Operations client gửi yêu cầu qua REST hoặc gRPC interface.
2. API boundary validate và map yêu cầu vào một use case.
3. Use case áp dụng workflow, state và ownership rules.
4. Service truy cập relational data và explicit Redis state khi phù hợp.
5. Khi workflow cần, service yêu cầu administration context hoặc aggregated data.
6. Service trả normalized response, tạo document hoặc publish operational event.

## 5. Project 2 — Fleet Administration & Dispatch

### 5.1. C2 — Container View

Fleet Administration & Dispatch là current service trong topology này. Topology C2 giống Project 1 để phần này có thể đọc độc lập.

#### Operations Client
**Nhiệm vụ:** Cung cấp client cho các luồng vận hành.
**Tác dụng:** Đưa yêu cầu tương tác vào Fleet Operations Core.
**Đầu vào:** Thao tác vận hành từ người dùng.
**Đầu ra:** REST hoặc gRPC request tới Fleet Operations Core service.
**Quan hệ chính:** Gọi Fleet Operations Core service qua REST hoặc gRPC.

#### Administration Client
**Nhiệm vụ:** Cung cấp client cho các luồng quản trị và điều phối.
**Tác dụng:** Đưa yêu cầu administration vào current service.
**Đầu vào:** Thao tác planning, resources hoặc coordination.
**Đầu ra:** REST hoặc gRPC request tới Fleet Administration & Dispatch service.
**Quan hệ chính:** Gọi Fleet Administration & Dispatch service qua REST hoặc gRPC.

#### Fleet Operations Core service
**Nhiệm vụ:** Xử lý workflow, lookup và reporting ở ranh giới operational core.
**Tác dụng:** Nhận planning, resources và configuration từ current service.
**Đầu vào:** REST/gRPC requests từ Operations Client và dữ liệu từ Fleet Administration & Dispatch service.
**Đầu ra:** Lookup/search requests và operational events.
**Quan hệ chính:** Dùng Operations PostgreSQL và Operational Redis cache; gọi Fleet Data Intelligence Hub service; publish operational events tới Kafka.

#### Fleet Administration & Dispatch service
**Nhiệm vụ:** Xử lý planning, resources, devices, configuration và coordination.
**Tác dụng:** Là current service của Project 2.
**Đầu vào:** REST/gRPC requests từ Administration Client.
**Đầu ra:** Dữ liệu cho Core, aggregated lookup requests và reference/coordination events.
**Quan hệ chính:** Cung cấp plans, resources và configuration cho Fleet Operations Core service; gọi Fleet Data Intelligence Hub service; dùng Administration PostgreSQL và Administration Redis cache; publish tới Kafka.

#### Fleet Data Intelligence Hub service
**Nhiệm vụ:** Cung cấp lookup, search và aggregated lookup theo kiến trúc đã công khai.
**Tác dụng:** Tách read-oriented data intelligence khỏi current service.
**Đầu vào:** Lookup/search requests, aggregated lookup requests và synchronization events từ Kafka.
**Đầu ra:** Dữ liệu lookup hoặc search; truy cập Intelligence PostgreSQL và Elasticsearch search index.
**Quan hệ chính:** Được Fleet Operations Core service và Fleet Administration & Dispatch service gọi qua REST/gRPC; nhận synchronization events từ Kafka.

#### Kafka event broker
**Nhiệm vụ:** Vận chuyển event giữa các service theo hướng bất đồng bộ.
**Tác dụng:** Tách publication của source service khỏi synchronization của data service.
**Đầu vào:** Operational events từ Core và reference/coordination events từ current service.
**Đầu ra:** Synchronization events tới Fleet Data Intelligence Hub service.
**Quan hệ chính:** Nhận publication từ Core và Fleet Administration & Dispatch, rồi chuyển event cho Data Intelligence Hub.

#### Operations PostgreSQL
**Nhiệm vụ:** Lưu relational data thuộc Fleet Operations Core service.
**Tác dụng:** Cung cấp persistence riêng cho operational core.
**Đầu vào:** Truy cập persistence từ Fleet Operations Core service.
**Đầu ra:** Dữ liệu relational phục vụ Fleet Operations Core service.
**Quan hệ chính:** Được Fleet Operations Core service sử dụng.

#### Operational Redis cache
**Nhiệm vụ:** Lưu cache state rõ ràng cho Fleet Operations Core service.
**Tác dụng:** Hỗ trợ các read hoặc workflow state phù hợp.
**Đầu vào:** Truy cập cache từ Fleet Operations Core service.
**Đầu ra:** Cache state cho Fleet Operations Core service.
**Quan hệ chính:** Được Fleet Operations Core service sử dụng.

#### Administration PostgreSQL
**Nhiệm vụ:** Lưu relational data thuộc current service.
**Tác dụng:** Cung cấp persistence riêng cho administration.
**Đầu vào:** Truy cập persistence từ Fleet Administration & Dispatch service.
**Đầu ra:** Dữ liệu relational phục vụ Fleet Administration & Dispatch service.
**Quan hệ chính:** Được Fleet Administration & Dispatch service sử dụng.

#### Administration Redis cache
**Nhiệm vụ:** Lưu cache state cho current service.
**Tác dụng:** Hỗ trợ cache và coordination responsibility đã công khai.
**Đầu vào:** Truy cập cache từ Fleet Administration & Dispatch service.
**Đầu ra:** Cache state cho Fleet Administration & Dispatch service.
**Quan hệ chính:** Được Fleet Administration & Dispatch service sử dụng.

#### Intelligence PostgreSQL
**Nhiệm vụ:** Lưu relational read data thuộc Fleet Data Intelligence Hub service.
**Tác dụng:** Là persistence cho read-oriented data intelligence.
**Đầu vào:** Truy cập dữ liệu từ Fleet Data Intelligence Hub service.
**Đầu ra:** Dữ liệu relational phục vụ lookup và aggregation.
**Quan hệ chính:** Được Fleet Data Intelligence Hub service sử dụng.

#### Elasticsearch search index
**Nhiệm vụ:** Cung cấp search-oriented projection cho Fleet Data Intelligence Hub service.
**Tác dụng:** Hỗ trợ search trong data intelligence.
**Đầu vào:** Truy cập search từ Fleet Data Intelligence Hub service.
**Đầu ra:** Kết quả search phục vụ data intelligence.
**Quan hệ chính:** Được Fleet Data Intelligence Hub service sử dụng.

### 5.2. C3 — Component View

#### REST and gRPC API
**Nhiệm vụ:** Nhận request tại API boundary của administration service.
**Tác dụng:** Tách transport contract khỏi các use case.
**Đầu vào:** REST hoặc gRPC request về planning, resources, devices hoặc configuration.
**Đầu ra:** Request đã được delegate và response chuẩn hóa.
**Quan hệ chính:** Delegate tới Planning and Coordination Use Cases, Resource and Device Use Cases và Configuration and Reference Use Cases.

#### Planning and Coordination Use Cases
**Nhiệm vụ:** Điều phối planning và coordination rules đã hỗ trợ.
**Tác dụng:** Tập trung orchestration cho luồng planning.
**Đầu vào:** Request từ REST and gRPC API.
**Đầu ra:** Persistence, cache/coordination, event hoặc report/export action.
**Quan hệ chính:** Truy cập Persistence Adapter, Cache and Coordination Adapter, Event Adapter và Report and Export Renderer.

#### Resource and Device Use Cases
**Nhiệm vụ:** Điều phối resource và device rules đã hỗ trợ.
**Tác dụng:** Tách logic resource/device khỏi API boundary.
**Đầu vào:** Request từ REST and gRPC API.
**Đầu ra:** Persistence và cache/coordination action.
**Quan hệ chính:** Truy cập Persistence Adapter và Cache and Coordination Adapter.

#### Configuration and Reference Use Cases
**Nhiệm vụ:** Điều phối configuration và reference rules đã hỗ trợ.
**Tác dụng:** Tách logic configuration/reference khỏi API boundary.
**Đầu vào:** Request từ REST and gRPC API.
**Đầu ra:** Persistence và service integration action.
**Quan hệ chính:** Truy cập Persistence Adapter và Service Integration Adapters.

#### Persistence Adapter
**Nhiệm vụ:** Cô lập relational persistence của administration service.
**Tác dụng:** Được cả ba nhóm use case dùng chung.
**Đầu vào:** Lệnh đọc hoặc ghi từ các use case group.
**Đầu ra:** Dữ liệu persistence hoặc kết quả thao tác.
**Quan hệ chính:** Được cả ba use-case group truy cập và truy cập PostgreSQL.

#### Cache and Coordination Adapter
**Nhiệm vụ:** Cô lập cache và coordination responsibility.
**Tác dụng:** Hỗ trợ selected coordination path của planning và resource/device.
**Đầu vào:** Yêu cầu từ Planning and Coordination Use Cases hoặc Resource and Device Use Cases.
**Đầu ra:** Cache state hoặc coordination result.
**Quan hệ chính:** Truy cập Redis and ShedLock.

#### Service Integration Adapters
**Nhiệm vụ:** Gọi các service platform liên quan.
**Tác dụng:** Tách integration contract khỏi configuration/reference use case.
**Đầu vào:** Yêu cầu từ Configuration and Reference Use Cases.
**Đầu ra:** REST/gRPC calls và dữ liệu phản hồi liên quan.
**Quan hệ chính:** Gọi Related Platform Services qua REST hoặc gRPC.

#### Event Adapter
**Nhiệm vụ:** Publish selected change event.
**Tác dụng:** Hỗ trợ asynchronous propagation.
**Đầu vào:** Event từ Planning and Coordination Use Cases.
**Đầu ra:** Event được publish.
**Quan hệ chính:** Publish events qua Kafka.

#### Report and Export Renderer
**Nhiệm vụ:** Tạo approved report hoặc export output.
**Tác dụng:** Tách rendering khỏi planning/coordination use case.
**Đầu vào:** Dữ liệu đã được Planning and Coordination Use Cases điều phối.
**Đầu ra:** Report hoặc export được phê duyệt.
**Quan hệ chính:** Được Planning and Coordination Use Cases truy cập.

#### PostgreSQL
**Nhiệm vụ:** Cung cấp relational persistence trong component view của administration service.
**Tác dụng:** Lưu relational data cho use case được hỗ trợ.
**Đầu vào:** Truy cập từ Persistence Adapter.
**Đầu ra:** Dữ liệu persistence cho Persistence Adapter.
**Quan hệ chính:** Được Persistence Adapter truy cập.

#### Redis and ShedLock
**Nhiệm vụ:** Cung cấp cache và coordination mechanism được mô tả trong C3.
**Tác dụng:** Hỗ trợ selected coordination responsibility.
**Đầu vào:** Truy cập từ Cache and Coordination Adapter.
**Đầu ra:** Cache state hoặc coordination result.
**Quan hệ chính:** Được Cache and Coordination Adapter truy cập.

#### Related Platform Services
**Nhiệm vụ:** Đại diện các service platform liên quan.
**Tác dụng:** Xác định ranh giới integration đã công khai.
**Đầu vào:** REST/gRPC calls từ Service Integration Adapters.
**Đầu ra:** Dữ liệu hoặc phản hồi phục vụ use case.
**Quan hệ chính:** Được Service Integration Adapters gọi qua REST hoặc gRPC.

#### Kafka
**Nhiệm vụ:** Cung cấp event channel cho administration service.
**Tác dụng:** Chuyển selected change events ra khỏi service.
**Đầu vào:** Event từ Event Adapter.
**Đầu ra:** Event đã publish cho consumer phù hợp.
**Quan hệ chính:** Được Event Adapter dùng để publish events.

### 5.3. Luồng tổng quát

1. Administrator gửi planning, resource, device hoặc configuration request.
2. API boundary validate request và available authorization context.
3. Use case áp dụng lifecycle, assignment và consistency rules.
4. Service persist approved change và cập nhật explicit cache state khi liên quan.
5. Service cung cấp updated context đồng bộ hoặc publish change event.
6. Operations Core và Data Intelligence Hub nhận kết quả phù hợp qua ranh giới của chúng.

## 6. Project 3 — Fleet Data Intelligence Hub

### 6.1. C2 — Container View

Fleet Data Intelligence Hub là current service trong topology này. Topology C2 giống hai project trước để phần này có thể đọc độc lập.

#### Operations Client
**Nhiệm vụ:** Cung cấp client cho các luồng vận hành.
**Tác dụng:** Đưa yêu cầu tương tác vào Fleet Operations Core.
**Đầu vào:** Thao tác vận hành từ người dùng.
**Đầu ra:** REST hoặc gRPC request tới Fleet Operations Core service.
**Quan hệ chính:** Gọi Fleet Operations Core service qua REST hoặc gRPC.

#### Administration Client
**Nhiệm vụ:** Cung cấp client cho các luồng quản trị và điều phối.
**Tác dụng:** Đưa yêu cầu administration vào platform.
**Đầu vào:** Thao tác planning, resources hoặc coordination.
**Đầu ra:** REST hoặc gRPC request tới Fleet Administration & Dispatch service.
**Quan hệ chính:** Gọi Fleet Administration & Dispatch service qua REST hoặc gRPC.

#### Fleet Operations Core service
**Nhiệm vụ:** Xử lý workflow, lookup và reporting ở ranh giới operational core.
**Tác dụng:** Gọi current service cho lookup và search data.
**Đầu vào:** REST/gRPC requests từ Operations Client và dữ liệu từ Fleet Administration & Dispatch service.
**Đầu ra:** Lookup/search requests và operational events.
**Quan hệ chính:** Dùng Operations PostgreSQL và Operational Redis cache; gọi Fleet Data Intelligence Hub service; publish operational events tới Kafka.

#### Fleet Administration & Dispatch service
**Nhiệm vụ:** Cung cấp planning, resources và configuration cho platform.
**Tác dụng:** Gọi current service cho aggregated lookup data.
**Đầu vào:** REST/gRPC requests từ Administration Client.
**Đầu ra:** Plans, resources, configuration, aggregated lookup requests và reference/coordination events.
**Quan hệ chính:** Cung cấp dữ liệu cho Fleet Operations Core service; gọi Fleet Data Intelligence Hub service; dùng Administration PostgreSQL và Administration Redis cache; publish tới Kafka.

#### Fleet Data Intelligence Hub service
**Nhiệm vụ:** Cung cấp lookup, search và aggregated lookup theo kiến trúc đã công khai.
**Tác dụng:** Là current service của Project 3.
**Đầu vào:** Lookup/search requests, aggregated lookup requests và synchronization events từ Kafka.
**Đầu ra:** Dữ liệu lookup hoặc search; truy cập Intelligence PostgreSQL và Elasticsearch search index.
**Quan hệ chính:** Được Fleet Operations Core service và Fleet Administration & Dispatch service gọi qua REST/gRPC; nhận synchronization events từ Kafka.

#### Kafka event broker
**Nhiệm vụ:** Vận chuyển event giữa các service theo hướng bất đồng bộ.
**Tác dụng:** Đưa synchronization events tới current service.
**Đầu vào:** Operational events từ Core và reference/coordination events từ Administration & Dispatch.
**Đầu ra:** Synchronization events tới Fleet Data Intelligence Hub service.
**Quan hệ chính:** Nhận publication từ Core và Administration & Dispatch, rồi chuyển event cho Data Intelligence Hub.

#### Operations PostgreSQL
**Nhiệm vụ:** Lưu relational data thuộc Fleet Operations Core service.
**Tác dụng:** Cung cấp persistence riêng cho operational core.
**Đầu vào:** Truy cập persistence từ Fleet Operations Core service.
**Đầu ra:** Dữ liệu relational phục vụ Fleet Operations Core service.
**Quan hệ chính:** Được Fleet Operations Core service sử dụng.

#### Operational Redis cache
**Nhiệm vụ:** Lưu cache state rõ ràng cho Fleet Operations Core service.
**Tác dụng:** Hỗ trợ các read hoặc workflow state phù hợp.
**Đầu vào:** Truy cập cache từ Fleet Operations Core service.
**Đầu ra:** Cache state cho Fleet Operations Core service.
**Quan hệ chính:** Được Fleet Operations Core service sử dụng.

#### Administration PostgreSQL
**Nhiệm vụ:** Lưu relational data thuộc Fleet Administration & Dispatch service.
**Tác dụng:** Cung cấp persistence riêng cho administration.
**Đầu vào:** Truy cập persistence từ Fleet Administration & Dispatch service.
**Đầu ra:** Dữ liệu relational phục vụ Fleet Administration & Dispatch service.
**Quan hệ chính:** Được Fleet Administration & Dispatch service sử dụng.

#### Administration Redis cache
**Nhiệm vụ:** Lưu cache state cho Fleet Administration & Dispatch service.
**Tác dụng:** Hỗ trợ cache và coordination responsibility đã công khai.
**Đầu vào:** Truy cập cache từ Fleet Administration & Dispatch service.
**Đầu ra:** Cache state cho Fleet Administration & Dispatch service.
**Quan hệ chính:** Được Fleet Administration & Dispatch service sử dụng.

#### Intelligence PostgreSQL
**Nhiệm vụ:** Lưu relational read data thuộc current service.
**Tác dụng:** Là persistence cho read-oriented data intelligence.
**Đầu vào:** Truy cập dữ liệu từ Fleet Data Intelligence Hub service.
**Đầu ra:** Dữ liệu relational phục vụ lookup và aggregation.
**Quan hệ chính:** Được Fleet Data Intelligence Hub service sử dụng.

#### Elasticsearch search index
**Nhiệm vụ:** Cung cấp search-oriented projection cho current service.
**Tác dụng:** Hỗ trợ search trong data intelligence.
**Đầu vào:** Truy cập search từ Fleet Data Intelligence Hub service.
**Đầu ra:** Kết quả search phục vụ data intelligence.
**Quan hệ chính:** Được Fleet Data Intelligence Hub service sử dụng.

### 6.2. C3 — Component View

#### Kafka
**Nhiệm vụ:** Cung cấp input event cho data synchronization.
**Tác dụng:** Đưa asynchronous source changes vào current service.
**Đầu vào:** Synchronization events đã được publish.
**Đầu ra:** Events tới Kafka Consumers.
**Quan hệ chính:** Deliver events tới Kafka Consumers.

#### Kafka Consumers
**Nhiệm vụ:** Nhận events từ Kafka.
**Tác dụng:** Chuyển event input vào synchronization path.
**Đầu vào:** Events từ Kafka.
**Đầu ra:** Dữ liệu source change tới Synchronization Workers.
**Quan hệ chính:** Nhận từ Kafka và cùng Integration Adapters cung cấp input cho Synchronization Workers.

#### Approved Source Systems
**Nhiệm vụ:** Đại diện source system đã được phê duyệt.
**Tác dụng:** Xác định external integration boundary cho data service.
**Đầu vào:** Không mô tả input nội bộ chi tiết ở C3 công khai.
**Đầu ra:** REST/gRPC calls tới Integration Adapters.
**Quan hệ chính:** Gọi Integration Adapters qua REST hoặc gRPC.

#### Integration Adapters
**Nhiệm vụ:** Nhận và cô lập integration từ approved source systems.
**Tác dụng:** Tách source contract khỏi synchronization work.
**Đầu vào:** REST/gRPC calls từ Approved Source Systems.
**Đầu ra:** Dữ liệu source change tới Synchronization Workers.
**Quan hệ chính:** Cùng Kafka Consumers cung cấp Synchronization Workers.

#### Synchronization Workers
**Nhiệm vụ:** Điều phối xử lý synchronization background.
**Tác dụng:** Tách event/integration intake khỏi normalization.
**Đầu vào:** Source changes từ Kafka Consumers và Integration Adapters.
**Đầu ra:** Công việc được delegate tới Normalization and Mapping.
**Quan hệ chính:** Delegate tới Normalization and Mapping.

#### Normalization and Mapping
**Nhiệm vụ:** Validate, map và normalize records đã nhận.
**Tác dụng:** Chuyển dữ liệu nhiều nguồn thành read model đã chuẩn hóa.
**Đầu vào:** Công việc từ Synchronization Workers.
**Đầu ra:** Updates cho repositories, search và integration state.
**Quan hệ chính:** Update Data Repositories, Search Adapter và Integration State Tracking.

#### Data Repositories
**Nhiệm vụ:** Cô lập truy cập read data persistence.
**Tác dụng:** Cung cấp dữ liệu cho query/aggregation và normalization.
**Đầu vào:** Update từ Normalization and Mapping; query từ Query and Aggregation Services.
**Đầu ra:** Dữ liệu read model hoặc kết quả persistence.
**Quan hệ chính:** Truy cập PostgreSQL và được Query and Aggregation Services sử dụng.

#### Search Adapter
**Nhiệm vụ:** Cô lập truy cập search projection.
**Tác dụng:** Cho phép query service dùng search-backed access khi phù hợp.
**Đầu vào:** Update từ Normalization and Mapping; query từ Query and Aggregation Services.
**Đầu ra:** Update hoặc kết quả search.
**Quan hệ chính:** Truy cập Elasticsearch và được Query and Aggregation Services sử dụng.

#### Integration State Tracking
**Nhiệm vụ:** Theo dõi integration và resynchronization state ở mức tổng quát.
**Tác dụng:** Giữ state integration tường minh và quan sát được trong phạm vi công khai.
**Đầu vào:** Update từ Normalization and Mapping.
**Đầu ra:** Integration state đã cập nhật.
**Quan hệ chính:** Được Normalization and Mapping update.

#### REST and gRPC Lookup API
**Nhiệm vụ:** Nhận lookup và aggregation request.
**Tác dụng:** Tách lookup transport boundary khỏi query service.
**Đầu vào:** REST hoặc gRPC lookup/aggregation request.
**Đầu ra:** Request đã delegate và normalized response.
**Quan hệ chính:** Delegate requests tới Query and Aggregation Services.

#### Query and Aggregation Services
**Nhiệm vụ:** Điều phối lookup và aggregation read path.
**Tác dụng:** Chọn relational hoặc search-backed access cho request.
**Đầu vào:** Request từ REST and gRPC Lookup API.
**Đầu ra:** Dữ liệu đọc đã tổng hợp và normalized response.
**Quan hệ chính:** Dùng Data Repositories và Search Adapter.

#### PostgreSQL
**Nhiệm vụ:** Cung cấp relational persistence cho read data.
**Tác dụng:** Lưu operational read data của intelligence service.
**Đầu vào:** Truy cập từ Data Repositories.
**Đầu ra:** Dữ liệu persistence cho Data Repositories.
**Quan hệ chính:** Được Data Repositories truy cập.

#### Elasticsearch
**Nhiệm vụ:** Cung cấp search projection cho read path.
**Tác dụng:** Hỗ trợ search-oriented access.
**Đầu vào:** Truy cập từ Search Adapter.
**Đầu ra:** Kết quả search hoặc projection update.
**Quan hệ chính:** Được Search Adapter truy cập.

### 6.3. Luồng tổng quát

1. Kafka Consumers hoặc approved Integration Adapters nhận source changes.
2. Synchronization Workers validate, map và normalize records.
3. Service persist operational read data và update search projections.
4. REST hoặc gRPC interface nhận lookup và aggregation requests.
5. Query services chọn PostgreSQL hoặc Elasticsearch-backed access cho request.
6. Normalized response trả về Operations Core hoặc Administration and Dispatch.

## 7. Thuật ngữ kỹ thuật dùng trong architecture

- **REST:** Kiểu giao tiếp request/response qua HTTP được mô tả ở ranh giới service và client.
- **gRPC:** Kiểu giao tiếp service-to-service hoặc client-to-service được mô tả song song với REST.
- **Kafka:** Event broker cho publication và synchronization events trong các diagram.
- **Redis:** Data store cho explicit cache state; trong administration C3 còn hỗ trợ coordination qua ShedLock.
- **PostgreSQL:** Relational database được mô tả là persistence của ba project architecture.
- **Elasticsearch:** Search index/projection được Data Intelligence Hub dùng cho search-backed access.
- **ShedLock:** Cơ chế coordination được mô tả cùng Redis trong administration component view.
- **OpenFeign:** Client abstraction có trong technology context công khai; C4 diagram chỉ khẳng định REST/gRPC service integration, không mở rộng chi tiết client implementation.
- **Document/Report Renderer:** Thành phần tạo approved document, report hoặc export output theo use case được hỗ trợ.

## 8. Ghi chú bảo mật và giới hạn mô hình

- Tên project, ranh giới service và quan hệ đã được tổng quát hóa.
- Tài liệu không công bố endpoint, event channel, schema, bảng dữ liệu, identifier, địa chỉ hạ tầng, cấu hình deployment hoặc số liệu production.
- PostgreSQL là database được mô tả trong ba project architecture.
- Những chi tiết không xuất hiện trong C4 Model công khai được xem là ngoài phạm vi tài liệu.
