# 哈尔滨师范大学Agent系统 技术文档

## 项目概述


**核心定位**：融合深度文档理解与 LLM 能力，为企业提供生产级 AI 系统的 RAG 引擎。

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              前端 (React + TypeScript)                    │
│                    web/ — React + Vite + Ant Design + Zustand            │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTP / WebSocket
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API 网关 (Go + Python)                        │
│         internal/ — Go Gin 服务 (管理面)                                  │
│         api/      — Python Quart 服务 (业务面)                            │
│         ragflow_server.py — 主入口                                       │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│   Agent 系统     │    │     RAG 引擎        │    │   DeepDoc       │
│   agent/        │    │     rag/            │    │   deepdoc/      │
│  - canvas.py    │    │  - llm/             │    │  - parser/      │
│  - component/   │    │  - flow/            │    │  - vision/      │
│  - tools/       │    │  - graphrag/        │    │                 │
└─────────────────┘    └─────────────────────┘    └─────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            存储层 (Docker 服务)                           │
│   MySQL (关系数据) │ Elasticsearch/Infinity (向量检索) │ Redis (缓存) │ MinIO (对象存储)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **后端语言** | Python 3.12 + Go | Python 处理业务逻辑，Go 处理管理面服务 |
| **Web 框架** | Quart (ASGI) + Gin | Quart 支持异步高并发，Gin 负责管理接口 |
| **前端框架** | React 18 + TypeScript | 现代化前端技术栈 |
| **构建工具** | Vite 7 | 快速的前端构建 |
| **UI 库** | Ant Design 5 + Tailwind CSS | 企业级 UI 组件 |
| **状态管理** | Zustand | 轻量级状态管理 |
| **向量数据库** | Elasticsearch / Infinity | 全文搜索和向量检索 |
| **关系数据库** | MySQL | 业务数据存储 |
| **缓存** | Redis | Session 和缓存 |
| **对象存储** | MinIO | S3 兼容的对象存储 |
| **依赖管理** | uv | Python 包管理器 |
| **LLM 集成** | LiteLLM | 支持 30+ LLM 提供商 |

---

## 目录结构

```
RAG-AGT/
├── api/                          # Python Quart API 服务 (业务面)
│   ├── ragflow_server.py         # 主入口
│   ├── apps/                     # API Blueprints
│   │   ├── kb_app.py            # 知识库管理
│   │   ├── dialog_app.py        # 对话管理
│   │   ├── document_app.py      # 文档处理
│   │   ├── canvas_app.py        # Agent 工作流
│   │   ├── chunk_app.py         # 分块管理
│   │   ├── llm_app.py           # LLM 配置
│   │   └── user_app.py          # 用户认证
│   ├── db/                      # 数据库
│   │   ├── db_models.py        # 数据模型
│   │   └── services/            # 业务服务层
│   └── utils/                   # 工具函数
│
├── rag/                          # 核心 RAG 引擎
│   ├── llm/                     # LLM 抽象层
│   │   ├── chat_model.py       # Chat LLM 抽象
│   │   ├── embedding_model.py  # Embedding 模型抽象
│   │   ├── rerank_model.py     # Rerank 模型抽象
│   │   └── cv_model.py         # 多模态模型抽象
│   ├── flow/                    # 文档处理流水线
│   │   └── pipeline.py         # 文档解析 → 分块 → 向量化
│   ├── app/                     # 不同文档类型的处理器
│   │   ├── naive.py            # 通用文档处理
│   │   ├── qa.py               # QA 文档处理
│   │   └── table.py            # 表格处理
│   ├── graphrag/               # 知识图谱 RAG
│   └── prompts/                # Prompt 模板
│
├── agent/                        # Agent 智能体系统
│   ├── canvas.py                # ⚠️ 核心：工作流编排引擎 (34KB)
│   ├── component/              # 工作流组件库
│   │   ├── llm.py              # LLM 调用组件
│   │   ├── retrieval.py        # 文档检索组件
│   │   ├── categorize.py       # 分类组件
│   │   ├── invoke.py           # 子 Agent 调用
│   │   ├── iteration.py        # 循环迭代组件
│   │   ├── docs_generator.py  # 文档生成组件
│   │   ├── message.py         # 消息组件
│   │   ├── switch.py          # 条件分支组件
│   │   ├── loop.py            # 循环组件
│   │   └── ...
│   ├── tools/                  # 外部工具集成
│   │   ├── tavily.py          # Tavily 搜索
│   │   ├── wikipedia.py       # Wikipedia 查询
│   │   ├── sql_executor.py    # SQL 执行
│   │   └── ...
│   ├── templates/              # 预置工作流模板
│   └── sandbox/               # 代码沙箱执行
│
├── deepdoc/                     # 文档解析引擎
│   ├── parser/                 # 文档解析器
│   │   ├── pdf_parser.py      # PDF 解析 (83KB)
│   │   ├── docx_parser.py     # Word 解析
│   │   ├── excel_parser.py    # Excel 解析
│   │   └── paddleocr_parser.py # OCR 解析
│   └── vision/                 # 视觉模型
│
├── web/                         # React 前端
│   └── src/
│       ├── main.tsx            # 前端入口
│       ├── pages/              # 页面组件
│       └── components/         # 通用组件
│
├── internal/                    # Go 管理面服务
│   └── ...
│
├── sdk/                         # Python SDK
│
├── docker/                      # Docker 部署配置
│   ├── docker-compose.yml      # 主部署配置
│   ├── docker-compose-base.yml # 基础服务 (MySQL, ES, Redis, MinIO)
│   └── .env                    # 环境变量
│
└── conf/                        # 配置文件
    ├── service_conf.yaml       # 服务配置
    └── llm_factories.json      # LLM 提供商配置
```

---

## 核心模块详解

### 1. Agent 系统 (agent/)

Agent 系统是 哈尔滨师范大学Agent系统 的**智能编排核心**，支持可视化工作流编排。

```
Agent 工作流 = 节点 (Component) + 边 (连接关系)
```

**核心组件类型**：

| 组件 | 文件 | 功能 |
|------|------|------|
| **LlmComponent** | `component/llm.py` | 调用 LLM 生成内容 |
| **RetrievalComponent** | `component/retrieval.py` | 从知识库检索相关文档 |
| **CategorizeComponent** | `component/categorize.py` | 对输入进行分类 |
| **InvokeComponent** | `component/invoke.py` | 调用子 Agent |
| **IterationComponent** | `component/iteration.py` | 循环迭代执行 |
| **DocsGeneratorComponent** | `component/docs_generator.py` | 生成文档内容 |
| **SwitchComponent** | `component/switch.py` | 条件分支路由 |
| **LoopComponent** | `component/loop.py` | 循环结构 |

**工具集成** (`agent/tools/`)：
- `tavily.py` — Tavily 搜索 API
- `wikipedia.py` — Wikipedia 查询
- `sql_executor.py` — SQL 数据库查询
- `rabbitmq.py` — 消息队列集成

### 2. RAG 引擎 (rag/)

**LLM 抽象层** (`rag/llm/`)：

```python
ChatModel    # 通用的 Chat 接口，支持 OpenAI、Anthropic、DeepSeek 等
EmbeddingModel # 向量化模型接口
RerankModel  # 重排序模型接口
CVModel      # 多模态视觉模型接口
```

**文档处理流水线** (`rag/flow/pipeline.py`)：

```
文档上传 → 解析 (DeepDoc) → 分块 (Chunking) → 向量化 → 存储
                                     ↓
用户查询 → 检索 (Retrieval) → 重排序 (Rerank) → LLM 生成 → 返回
```

**分块策略** (`rag/app/`)：
- `naive.py` — 通用文本分块
- `qa.py` — QA 问答对提取
- `table.py` — 表格结构保持

### 3. DeepDoc 文档解析 (deepdoc/)

支持多种文档格式的**深度解析**：

| 解析器 | 支持格式 | 特点 |
|--------|----------|------|
| `pdf_parser.py` | PDF | 支持扫描件 OCR、表格提取、布局分析 |
| `docx_parser.py` | Word | 保留格式和结构 |
| `excel_parser.py` | Excel | 表格结构保持 |
| `paddleocr_parser.py` | 图片扫描件 | PaddleOCR 文字识别 |

### 4. API 层 (api/)

基于 Quart (ASGI) 构建的 RESTful API：

| API 模块 | 路径 | 功能 |
|----------|------|------|
| `kb_app.py` | `/api/v1/kb` | 知识库 CRUD |
| `dialog_app.py` | `/api/v1/dialog` | 对话管理 |
| `document_app.py` | `/api/v1/documents` | 文档上传和处理 |
| `canvas_app.py` | `/api/v1/canvas` | Agent 工作流管理 |
| `chunk_app.py` | `/api/v1/chunks` | 文档分块管理 |
| `llm_app.py` | `/api/v1/llm` | LLM 提供商配置 |

---

## 数据流

### 文档处理流程

```
┌─────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐    ┌─────────┐
│ 用户上传 │ →  │ DeepDoc   │ →  │ Chunking │ →  │ Embedding │ →  │ 存储    │
│ 文档     │    │ 解析      │    │ 分块      │    │ 向量化    │    │ ES/MySQL│
└─────────┘    └───────────┘    └──────────┘    └───────────┘    └─────────┘
```

### 问答流程

```
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐    ┌─────────┐
│ 用户提问 │ →  │ 检索      │ →  │ Rerank   │ →  │ LLM 生成 │ →  │ 返回答案 │
│         │    │ Retrieval │    │ 重排序    │    │          │    │ + 引用  │
└─────────┘    └───────────┘    └───────────┘    └──────────┘    └─────────┘
                              ↓
                        ┌───────────┐
                        │  引用溯源   │
                        │ Citations  │
                        └───────────┘
```

### Agent 工作流执行

```
Canvas (编排引擎)
    │
    ├──▶ Component: retrieval  → 从知识库检索
    │
    ├──▶ Component: llm         → 调用 LLM 分析
    │
    ├──▶ Component: categorize → 分类判断
    │
    ├──▶ Component: invoke      → 调用子 Agent
    │
    └──▶ Component: iteration   → 循环处理
```

---

## 部署架构

### Docker 服务划分

```
┌────────────────────────────────────────────────────────┐
│                   哈尔滨师范大学Agent系统 Container                     │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Python API      │  │  Go Admin        │           │
│  │  (Quart :9380)   │  │  (Gin :9384)     │           │
│  └────────┬─────────┘  └────────┬─────────┘           │
│           │                      │                     │
│  ┌────────▼─────────┐  ┌─────────▼─────────┐           │
│  │  DeepDoc         │  │  Task Executor   │           │
│  │  (文档处理)       │  │  (异步任务)       │           │
│  └──────────────────┘  └──────────────────┘           │
└────────────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────┐
│                    基础服务 (docker-compose-base)        │
│  ┌────────┐  ┌─────────────┐  ┌───────┐  ┌────────┐  │
│  │ MySQL  │  │ Elasticsearch│  │ Redis │  │ MinIO  │  │
│  │ :3306  │  │   :1200     │  │ :6379 │  │ :9000  │  │
│  └────────┘  └─────────────┘  └───────┘  └────────┘  │
│              (或 Infinity)                              │
└────────────────────────────────────────────────────────┘
```

### 环境要求

| 资源 | 最低要求 |
|------|----------|
| CPU | ≥ 4 核 |
| 内存 | ≥ 16 GB |
| 磁盘 | ≥ 50 GB |
| Docker | ≥ 24.0.0 |

---

## LLM 支持

通过 `conf/llm_factories.json` 配置，支持 30+ LLM 提供商：

| 提供商 | 状态 |
|--------|------|
| OpenAI (GPT-4, GPT-5) | ✅ |
| Anthropic (Claude) | ✅ |
| DeepSeek | ✅ |
| Gemini | ✅ |
| Azure OpenAI | ✅ |
| Ollama (本地) | ✅ |
| Moonshot | ✅ |
| ... | ✅ |

---

## 快速开始

### Docker 部署

```bash
cd ragflow/docker
docker compose -f docker-compose.yml up -d

# 查看状态
docker logs -f docker-ragflow-cpu-1

# 访问
open http://localhost  # 默认端口 80
```

### 源码开发

```bash
# 1. 安装依赖
uv sync --python 3.12 --all-extras

# 2. 启动基础服务
docker compose -f docker/docker-compose-base.yml up -d

# 3. 添加 hosts
echo "127.0.0.1 es01 infinity mysql minio redis sandbox-executor-manager" | sudo tee -a /etc/hosts

# 4. 启动后端
source .venv/bin/activate
export PYTHONPATH=$(pwd)
bash docker/launch_backend_service.sh

# 5. 启动前端
cd web && npm install && npm run dev
```

---

## 关键文件速查

| 功能 | 文件路径 |
|------|----------|
| API 主入口 | `api/ragflow_server.py` |
| Agent 编排引擎 | `agent/canvas.py` (34KB) |
| LLM 抽象 | `rag/llm/chat_model.py` |
| PDF 解析 | `deepdoc/parser/pdf_parser.py` (83KB) |
| 分块策略 | `rag/app/naive.py` |
| 知识图谱 | `rag/graphrag/` |
| 前端入口 | `web/src/main.tsx` |
| Docker 配置 | `docker/docker-compose.yml` |
| LLM 配置 | `conf/llm_factories.json` |

---

