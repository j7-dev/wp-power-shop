# Visor 專案憲章
<!-- 捷運軌道監視系統 - 全棧開發憲法 -->

## 憲法優先級聲明

**本憲章具有憲法效力，超越所有其他開發文件。發生衝突時以本憲章為準。**

---

## 核心原則 (Core Principles)

### I. 領域驅動設計優先 (DDD-First Development)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **共同語言強制執行**: 所有程式碼、文件、API 端點必須使用業務領域術語（Camera、Term、Recording、Live Monitor），禁止技術行話優先於業務語言
* **聚合邊界明確**: 每個聚合（Camera、Term、Replay）必須維護清晰的一致性邊界，不允許跨聚合的直接引用
* **領域層純粹性**: 領域層（Visor.Domain）禁止依賴基礎設施或應用層，業務邏輯必須封裝於領域實體與服務
* **領域事件發布**: 所有業務狀態變化（攝影機啟動/停止、錄影開始/結束）必須透過領域事件傳播，確保可稽核性與解耦
* **豐富領域模型**: 反貧血模型（Anemic Domain Model）被視為架構違規，實體必須包含業務行為（如 `Camera.Start()`、`Camera.Stop()`）

**理由**: 捷運監視系統的業務複雜度需要清晰的領域建模，DDD 確保系統設計直接映射業務需求，降低溝通成本，提升長期可維護性。

### II. 測試驅動開發 (Test-Driven Development - TDD)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **紅-綠-重構循環**: 必須先撰寫失敗測試 → 實作最小化程式碼通過測試 → 重構改善設計
* **測試命名慣例**: 所有測試必須遵循 `MethodName_Condition_ExpectedResult()` 格式（範例: `Start_WhenCameraIsOffline_ShouldChangeStatusToRecording()`）
* **測試覆蓋率門檻**: 
  - 領域層（Visor.Domain）: ≥ 90%
  - 應用層（Visor.Application）: ≥ 85%
  - 基礎設施層（Visor.EntityFrameworkCore）: ≥ 70%
* **測試分類明確**: 
  - 單元測試（聚合/值物件） → `Visor.Domain.Tests`
  - 整合測試（應用服務/Repository） → `Visor.Application.Tests`
  - UI 測試（ViewModel/View） → 前端測試專案
* **測試先行審查**: 功能開發的 Pull Request 必須先展示測試案例，經審查通過後才能實作

**理由**: 捷運監視系統的關鍵業務邏輯（錄影管理、即時監控）不容許迴歸錯誤，TDD 確保程式碼可測試性與需求符合度。

### III. MVVM 架構強制遵循 (前端)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **View-ViewModel 分離**: View (.axaml) 僅負責 UI 結構，不包含業務邏輯
* **ViewModel 純粹性**: ViewModel 不直接引用 View，透過資料繫結與命令通訊
* **ViewLocator 約定**: 遵循命名約定 `XXXViewModel` → `XXXView`（自動對映）
* **訊息傳遞解耦**: 模組間通訊使用 `WeakReferenceMessenger`，禁止直接引用（避免緊耦合）
* **UI Thread 強制**: 所有 UI 屬性變更必須在 `Dispatcher.UIThread` 上執行（防止 UI 凍結）

**理由**: Avalonia UI 跨平台應用需要清晰的職責分離，MVVM 確保可測試性與多平台相容性（Windows/Linux/macOS）。

### IV. SOLID 原則遵循

**非協商規則 (NON-NEGOTIABLE RULES):**

* **單一職責原則（SRP）**: 類別僅有一個變動原因（範例: `CameraService` 僅處理攝影機業務邏輯，不處理錄影排程）
* **開放封閉原則（OCP）**: 軟體實體應可擴充但不可修改（使用繼承、介面、策略模式）
* **里氏替換原則（LSP）**: 子型別必須可替換其基型別（介面實作不得破壞契約）
* **介面隔離原則（ISP）**: 客戶端不應依賴其不使用的方法（避免臃腫介面）
* **依賴反轉原則（DIP）**: 依賴抽象而非具體實現（使用 `ICameraRepository` 而非 `CameraRepository`）

### V. 程式碼品質標準 (Code Quality Standards)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **C# 現代特性**: 強制使用 File-scoped namespace、Pattern Matching、Record types、Nullable Reference Types（C# 13/.NET 9.0）
* **命名慣例**: 
  - Public 成員: PascalCase（`GetCameraAsync`）
  - Private 欄位: camelCase + "_" 前綴（`_repository`）
  - 介面: "I" 前綴（`ICameraService`）
  - 使用 `nameof` 避免字串常數
* **註解與文件**: Public API 必須有完整 XML 文件註解（包含 `<summary>`、`<param>`、`<returns>`、`<example>`）
* **可為空型別檢查**: 所有專案必須啟用 Nullable Reference Types，使用 `is null`/`is not null` 進行檢查
* **非同步優先**: I/O 操作（資料庫查詢、API 呼叫、檔案讀寫）必須使用 `async`/`await`，避免阻塞執行緒

### VI. 效能與可擴展性 (Performance & Scalability)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **非阻塞 I/O**: 所有資料庫查詢、外部 API 呼叫必須使用非同步方法
* **分頁強制**: 返回集合的 API 端點必須實作分頁（預設 PageSize: 20，最大: 100）
* **查詢最佳化**: 
  - 禁止 N+1 查詢，必須使用 `.Include()` 或投影（Projection）最佳化 EF Core 查詢
  - 前端大型列表必須使用虛擬化（`VirtualizingStackPanel` 或 `DataGrid`）
* **快取策略**: 
  - 變動頻率低的資料（如配置、權限）必須實作記憶體快取或分散式快取
  - 前端 API 回應使用 LazyCache（預設 5 分鐘 TTL）
* **效能基準測試**: 關鍵 API 端點必須建立效能基準（範例: 回應時間 < 200ms at P95），並監控

### VII. 安全性與合規性 (Security & Compliance)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **授權於應用層**: 權限檢查必須在應用服務層執行，使用 ABP 授權框架（`[Authorize]` 或 Policy-based）
* **輸入驗證強制**: 所有外部輸入（API 參數、DTO）必須經過驗證，遵循零信任原則（Zero Trust）
* **敏感資料保護**: 
  - 密碼、金鑰必須加密儲存（OpenIddict 憑證使用 `openiddict.pfx`）
  - 日誌中禁止記錄敏感資料（密碼、Token）
* **稽核軌跡**: 所有資料變更必須透過領域事件或 ABP Auditing 機制記錄（Who, What, When）
* **HTTPS 強制**: 生產環境必須強制 HTTPS，使用有效憑證

### VIII. 使用者體驗一致性 (User Experience Consistency)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **API 回應格式標準化**: 所有 API 端點必須遵循 ABP 標準回應格式（成功: data wrapper，錯誤: Problem Details RFC 7807）
* **錯誤訊息本地化**: 所有使用者可見錯誤訊息必須支援繁體中文與英文，使用本地化資源檔（`Localization/Visor/zh-Hant.json`）
* **驗證回應一致**: 輸入驗證錯誤必須透過 FluentValidation 或 Data Annotations 統一處理
* **API 版本控制**: 引入破壞性變更時必須遵循語意化版本控制，並提供版本遷移指南
* **OpenAPI 文件完整**: Swagger/OpenAPI 文件必須包含所有端點的詳細描述、參數說明、範例與身份驗證方式

### IX. 背景任務架構 (Background Task Architecture)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **Background Job 優先**: 參數化、可重試、一次性執行的任務必須使用 ABP Background Job
* **Periodic Worker 用途**: 週期性、無參數、持續運行的任務使用 ABP Periodic Background Worker
* **動態參數傳遞**: Background Job 必須定義專屬的 Args Record 類別（如 `RecordingJobArgs`），支援執行期參數調整
* **啟動時排程**: 應用啟動時需要執行的背景任務必須在 `OnApplicationInitializationAsync` 中透過 `IBackgroundJobManager.EnqueueAsync()` 排程
* **重試策略規劃**: Background Job 必須實作適當的重試機制與錯誤處理（TODO: 錄影失敗重試策略）

**理由**: ABP Framework 提供兩種背景任務機制，正確選擇可確保系統穩定性與可維護性。Background Job 支援參數化與持久化，適合業務任務；Periodic Worker 適合定時清理、健康檢查等基礎設施任務。

**範例**:
```csharp
// ✅ Background Job（參數化任務）
public class RecordingJob : AsyncBackgroundJob<RecordingJobArgs> {
    public override async Task ExecuteAsync(RecordingJobArgs args) {
        // 使用 args.RecordingSegmentPeriod 參數
    }
}

// ✅ Periodic Worker（週期性任務）
public class DeleteWorker : AsyncPeriodicBackgroundWorkerBase {
    public DeleteWorker(AbpAsyncTimer timer, IServiceScopeFactory factory) : base(timer, factory) {
        timer.Period = 300000; // 5 分鐘執行一次
    }
}
```

### X. 配置管理原則 (Configuration Management)

**非協商規則 (NON-NEGOTIABLE RULES):**

* **ABP Setting 優先**: 業務邏輯相關配置必須透過 ABP Setting 系統管理，支援執行期動態調整
* **靜態配置禁令**: 業務邏輯配置禁止使用靜態常數（`const` 或 `static readonly`），必須透過依賴注入取得
* **配置服務單例**: 配置管理服務必須註冊為 `ISingletonDependency`，確保全域一致性
* **初始化非同步**: 配置服務必須提供 `InitAsync()` 方法，從資料庫或外部來源非同步載入配置
* **預設值定義**: 配置項目必須提供合理的預設值，確保系統在配置缺失時仍可運作

**理由**: 動態配置管理是現代應用程式的核心需求，避免每次調整配置都需要重新部署。ABP Setting 系統提供多層級配置（全域/租戶/使用者）與持久化支援。

**範例**:
```csharp
// ✅ 正確：使用 ABP Setting 系統
public class RecordingSetting : ISingletonDependency {
    private readonly ISettingProvider _settingProvider;
    public int RecordingSegmentPeriod { get; private set; }
    
    public async Task InitAsync() {
        RecordingSegmentPeriod = (await _settingProvider.GetOrNullAsync("RecordingSegment.Period"))?.To<int>() ?? 3600;
    }
}

// ❌ 錯誤：使用靜態常數
public static class RecordingSetting {
    public const int RecordingSegmentPeriod = 3600; // 無法動態調整
}
```

---

## 技術堆疊約束 (Technical Stack Constraints)

### 後端 API (Backend)

* **.NET 版本**: 必須使用 .NET 9.0 或更新版本（專案無法在較低版本運行）
* **ABP Framework**: 必須使用 ABP Framework 9.3.1+，遵循其模組化與 DDD 架構
* **ORM**: Entity Framework Core 9.0 作為主要資料存取技術
* **資料庫**: 
  - 開發環境: SQLite (`Visor.db`)
  - 生產環境: SQL Server 或 PostgreSQL（可擴展）
* **身份驗證**: OpenIddict + JWT Token（Token 有效期: 14 天）
* **日誌框架**: Serilog 作為結構化日誌提供者
* **測試框架**: xUnit + Shouldly 進行單元與整合測試
* **背景任務**: ABP Background Jobs + Background Workers
* **錄影處理**: Xabe.FFmpeg 6.0.2（FFmpeg 封裝）

### 前端桌面應用 (Frontend)

* **.NET 版本**: 必須使用 .NET 9.0 或更新版本
* **UI 框架**: Avalonia UI 11.3.9（跨平台桌面應用）
* **MVVM 工具包**: CommunityToolkit.Mvvm 8.4.0（`[ObservableProperty]`、`[RelayCommand]`）
* **依賴注入**: Autofac 9.0.0（IoC 容器）
* **視訊播放**: LibVLCSharp 3.9.4（RTSP 串流播放）
* **快取**: LazyCache 2.4.0（記憶體快取）
* **物件映射**: Mapster 7.4.0（DTO 與 Model 轉換）

### 跨平台相容性

* 程式碼必須在 Windows 與 Linux 環境下均可執行
* 路徑處理必須使用 `Path.Combine()` 等跨平台 API
* 避免平台特定的系統呼叫

---

## 強制思考流程 (Mandatory Thinking Process)

**在實作任何功能前，必須完成以下檢查點：**

### 檢查點 1: 領域分析
- ✅ 此需求屬於哪個界限上下文（Camera Management、Live Monitoring、Replay Management）？
- ✅ 涉及哪些聚合根（Camera、Term、CameraTerm、Replay）？它們的邊界清楚嗎？
- ✅ 需要建立哪些實體、值物件？
- ✅ 是否需要發布領域事件（CameraStartedEto、CameraStoppedEto）？
- ✅ 共同語言的業務術語是什麼（捷運監視系統業務語言）？

### 檢查點 2: 分層架構驗證
- ✅ 此功能屬於哪一層（Domain/Application/HttpApi/Infrastructure/Frontend）？
- ✅ 依賴方向是否正確（從外層指向內層，絕不反向）？
- ✅ 是否遵循 ABP 模組約定（後端）或 MVVM 模組約定（前端）？
- ✅ 是否需要跨模組通訊？如何解耦（後端用領域事件，前端用 WeakReferenceMessenger）？

### 檢查點 3: 測試策略
- ✅ 測試命名是否遵循 `MethodName_Condition_ExpectedResult()`？
- ✅ 是否先撰寫失敗測試（TDD Red-Green-Refactor）？
- ✅ 測試覆蓋率是否達標（領域層 90%、應用層 85%）？
- ✅ 整合測試是否涵蓋聚合邊界與資料庫操作？

**若無法清楚回答上述問題，停止並要求澄清。**

---

## 品質門檻 (Quality Gates)

### Pull Request 必須通過以下檢查：

* ✅ 所有測試通過（單元 + 整合測試）
* ✅ 測試覆蓋率達標（領域/應用層 ≥ 85%）
* ✅ 程式碼風格符合 `.editorconfig` 規範
* ✅ 無編譯警告（Warnings as Errors）
* ✅ API 文件完整（Swagger/OpenAPI）
* ✅ 效能基準達標（若適用）
* ✅ 安全性檢查通過（無敏感資料洩漏、授權正確）
* ✅ 繁體中文文件與註解完整（Plan Task、Pull Request）

### Code Review 要求：

* 每個 PR 至少需一位 Reviewer 批准
* Reviewer 必須驗證 DDD 原則、SOLID 原則、測試品質
* 破壞性變更需額外的架構審查（Architecture Review）

---

## 開發工作流程 (Development Workflow)

### 功能開發流程（後端）

1. **領域分析** - 識別聚合、實體、值物件
2. **撰寫測試** - TDD Red-Green-Refactor
3. **實作領域** - 領域層實作業務邏輯
4. **應用服務** - 協調領域物件
5. **資料遷移** - 建立 EF Core Migration
6. **測試驗證** - 單元測試 + 整合測試

### 功能開發流程（前端）

1. **模組規劃** - 建立 Views/ViewModels/Models/Services
2. **ViewModel** - 實作業務邏輯與狀態管理
3. **View (AXAML)** - UI 結構與資料繫結
4. **訊息定義** - 模組間通訊訊息類別
5. **DI 註冊** - 在 App.axaml.cs 註冊服務
6. **測試驗證** - 功能測試與 UI 測試

---

## 治理機制 (Governance)

### 憲章優先級

本憲章具有憲法效力，超越所有其他開發指南。發生衝突時以本憲章為準。

### 修訂流程

* **提案**: 任何團隊成員可提出修訂提案，需包含理由與影響分析
* **討論**: 團隊會議討論，評估對現有程式碼的影響
* **批准**: 需至少 2/3 團隊成員同意
* **版本控制**: 依語意化版本控制（MAJOR.MINOR.PATCH）更新版本號
* **遷移計畫**: 破壞性變更需提供現有程式碼的遷移指南

### 版本控制規則

* **MAJOR**: 移除或重新定義核心原則（如: 取消 TDD 要求）
* **MINOR**: 新增原則或大幅擴展指引（如: 新增效能要求）
* **PATCH**: 澄清文字、修正錯字、非語意性改善

### 合規審查

* 每季執行一次憲法合規審查，檢查現有程式碼是否符合原則
* 發現違規時，必須建立技術債務工單（Tech Debt Ticket）並排程修復
* 新功能開發不得引入新的違規項目

### 執行階段指引

詳細的實作指引請參閱：

* **後端開發**: `.github/instructions/abp.instructions.md`（1700+ 行完整 DDD 架構指引）
* **前端開發**: `.github/instructions/avalonia.instructions.md`（950+ 行完整 MVVM 架構指引）
* **C# 通用規範**: `.github/instructions/csharp.instructions.md`（適用於所有 C# 程式碼）

---

**版本**: 1.1.0 | **通過日期**: 2025-01-30 | **最後修訂**: 2025-12-03
