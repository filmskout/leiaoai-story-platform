# 文档结构说明

## 📁 新的文档组织结构

```
/
├── README.md (精简的公开README)
├── docs/
│   ├── setup/           # 初始设置指南（已完成的配置）
│   ├── guides/          # 使用指南和参考
│   ├── archive/         # 已完成/过时的文档
│   └── DOCUMENTATION-STRUCTURE.md
├── VERIFY-ALL-FEATURES.sql # 功能验证脚本
└── [其他项目文件]
```

## 📋 文档分类

### ✅ 保留在根目录（必需）
- `README.md` - 项目简介（精简版）
- `VERIFY-ALL-FEATURES.sql` - 验证所有功能
- `package.json`, `tsconfig.json` 等配置文件

### 📦 移至 docs/setup/ （设置指南）
已完成的配置文档：
- `ADD-WALLET-AUTH-SCHEMA.sql` → `docs/setup/wallet-auth-setup.sql`
- `ADD-WALLET-AUTH-STEP-BY-STEP.sql` → `docs/setup/wallet-auth-step-by-step.sql`
- `FIX-CHAT-SESSIONS-SCHEMA.sql` → `docs/setup/chat-sessions-setup.sql`
- `DOMAIN-SETUP-GUIDE.md` → `docs/setup/domain-configuration.md`
- `SUPABASE-SECRET-KEY-SETUP.md` → `docs/setup/supabase-keys.md`

### 📚 移至 docs/guides/ （使用指南）
参考和使用文档：
- `MULTI-AUTH-IMPLEMENTATION-GUIDE.md` → `docs/guides/authentication.md`
- `PROJECT-STATUS.md` → `docs/PROJECT-STATUS.md` (保留在docs根目录)
- `FIX-CHAT-SESSIONS-GUIDE.md` → `docs/guides/chat-sessions.md`

### 🗄️ 移至 docs/archive/ （归档）
已过时或已完成的诊断文档：
- `CHECK-*.sql` 系列
- `DIAGNOSE-*.sql` 系列
- `DEBUG-*.sql` 系列
- `BROWSER-DEBUG-*.md` 系列
- `BP-*-DEBUG-*.md` 系列
- 所有带 `-old` 后缀的文件

## 🧹 清理原则

### 删除（已合并到主文档）
- 重复的设置脚本
- 临时调试文件
- 已过时的版本

### 归档（保留但移至archive）
- 诊断脚本（已完成验证）
- 调试指南（问题已解决）
- 历史版本的设置文件

### 保留（组织到合适位置）
- 当前有效的设置脚本
- 使用指南
- 项目状态文档

## 📝 执行清理

运行清理脚本：
```bash
# 查看将要移动的文件
cat docs/cleanup-commands.sh

# 执行清理
bash docs/cleanup-commands.sh
```

## ✅ 清理后的结构

```
/
├── README.md                          # 精简的公开README
├── VERIFY-ALL-FEATURES.sql            # 唯一的验证脚本
├── package.json
├── vite.config.ts
├── ...其他配置文件
│
├── docs/
│   ├── PROJECT-STATUS.md              # 项目状态
│   ├── DOCUMENTATION-STRUCTURE.md     # 本文档
│   │
│   ├── setup/                         # 设置指南
│   │   ├── wallet-auth-setup.sql
│   │   ├── chat-sessions-setup.sql
│   │   ├── domain-configuration.md
│   │   └── supabase-keys.md
│   │
│   ├── guides/                        # 使用指南
│   │   ├── authentication.md
│   │   ├── chat-sessions.md
│   │   └── deployment.md
│   │
│   └── archive/                       # 归档（已完成）
│       ├── debug-scripts/
│       ├── diagnostic-tools/
│       └── deprecated/
│
├── src/                               # 源代码
├── public/                            # 公共资源
└── api/                               # API函数
```

## 🎯 目标

1. **根目录简洁** - 只保留必需的配置和README
2. **文档有序** - 按用途分类到docs/子目录
3. **易于查找** - 清晰的命名和结构
4. **历史保留** - 重要的历史文档归档而不是删除

