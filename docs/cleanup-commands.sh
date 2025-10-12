#!/bin/bash

# ============================================================================
# 文档清理和组织脚本
# ============================================================================
# 将文档从根目录移动到docs/子目录
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 文档清理和组织"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 确保目录存在
mkdir -p docs/setup docs/guides docs/archive/debug-scripts docs/archive/diagnostic-tools docs/archive/deprecated

echo "✅ 文档目录已创建"

# ============================================================================
# 1. 移动设置指南到 docs/setup/
# ============================================================================
echo ""
echo "📦 移动设置指南..."

# Wallet认证设置
if [ -f "ADD-WALLET-AUTH-SCHEMA.sql" ]; then
    mv ADD-WALLET-AUTH-SCHEMA.sql docs/setup/wallet-auth-setup.sql
    echo "  ✓ wallet-auth-setup.sql"
fi

if [ -f "ADD-WALLET-AUTH-STEP-BY-STEP.sql" ]; then
    mv ADD-WALLET-AUTH-STEP-BY-STEP.sql docs/setup/wallet-auth-step-by-step.sql
    echo "  ✓ wallet-auth-step-by-step.sql"
fi

# Chat Sessions设置
if [ -f "FIX-CHAT-SESSIONS-SCHEMA.sql" ]; then
    mv FIX-CHAT-SESSIONS-SCHEMA.sql docs/setup/chat-sessions-setup.sql
    echo "  ✓ chat-sessions-setup.sql"
fi

if [ -f "CHAT-MARKDOWN-SETUP.sql" ]; then
    mv CHAT-MARKDOWN-SETUP.sql docs/setup/chat-markdown-setup.sql
    echo "  ✓ chat-markdown-setup.sql"
fi

# RLS策略设置
if [ -f "SETUP-ALL-RLS-POLICIES-FIXED.sql" ]; then
    mv SETUP-ALL-RLS-POLICIES-FIXED.sql docs/setup/rls-policies-setup.sql
    echo "  ✓ rls-policies-setup.sql"
fi

if [ -f "SETUP-ALL-RLS-POLICIES.sql" ]; then
    mv SETUP-ALL-RLS-POLICIES.sql docs/archive/deprecated/
    echo "  ✓ 旧版RLS已归档"
fi

# 域名和Supabase配置
if [ -f "DOMAIN-SETUP-GUIDE.md" ]; then
    mv DOMAIN-SETUP-GUIDE.md docs/setup/domain-configuration.md
    echo "  ✓ domain-configuration.md"
fi

if [ -f "SUPABASE-SECRET-KEY-SETUP.md" ]; then
    mv SUPABASE-SECRET-KEY-SETUP.md docs/setup/supabase-keys.md
    echo "  ✓ supabase-keys.md"
fi

# Storage策略
if [ -f "BP-STORAGE-POLICIES-PURE-SQL.md" ]; then
    mv BP-STORAGE-POLICIES-PURE-SQL.md docs/setup/storage-policies.md
    echo "  ✓ storage-policies.md"
fi

# CloudConvert设置
if [ -f "CLOUDCONVERT-SETUP.md" ]; then
    mv CLOUDCONVERT-SETUP.md docs/setup/cloudconvert.md
    echo "  ✓ cloudconvert.md"
fi

# ============================================================================
# 2. 移动使用指南到 docs/guides/
# ============================================================================
echo ""
echo "📚 移动使用指南..."

# 认证指南
if [ -f "MULTI-AUTH-IMPLEMENTATION-GUIDE.md" ]; then
    mv MULTI-AUTH-IMPLEMENTATION-GUIDE.md docs/guides/authentication.md
    echo "  ✓ authentication.md"
fi

# Chat Sessions指南
if [ -f "FIX-CHAT-SESSIONS-GUIDE.md" ]; then
    mv FIX-CHAT-SESSIONS-GUIDE.md docs/guides/chat-sessions.md
    echo "  ✓ chat-sessions.md"
fi

# BP分析指南
if [ -f "ENHANCED-BP-ANALYSIS.md" ]; then
    mv ENHANCED-BP-ANALYSIS.md docs/guides/bp-analysis.md
    echo "  ✓ bp-analysis.md"
fi

# PDF处理指南
if [ -f "BP-PDF-WORKAROUND.md" ]; then
    mv BP-PDF-WORKAROUND.md docs/guides/pdf-processing.md
    echo "  ✓ pdf-processing.md"
fi

# 项目状态
if [ -f "PROJECT-STATUS.md" ]; then
    mv PROJECT-STATUS.md docs/PROJECT-STATUS.md
    echo "  ✓ PROJECT-STATUS.md"
fi

if [ -f "SESSION-PROGRESS-SUMMARY.md" ]; then
    mv SESSION-PROGRESS-SUMMARY.md docs/archive/deprecated/
    echo "  ✓ 旧版状态已归档"
fi

# ============================================================================
# 3. 归档调试和诊断工具到 docs/archive/
# ============================================================================
echo ""
echo "🗄️  归档调试工具..."

# 调试脚本
for file in CHECK-*.sql DEBUG-*.sql DIAGNOSE-*.sql; do
    if [ -f "$file" ]; then
        mv "$file" docs/archive/debug-scripts/
        echo "  ✓ $file"
    fi
done

# 诊断工具Markdown
for file in CHECK-*.md DEBUG-*.md BROWSER-DEBUG-*.md; do
    if [ -f "$file" ]; then
        mv "$file" docs/archive/diagnostic-tools/
        echo "  ✓ $file"
    fi
done

# BP相关调试文档
for file in BP-*-DEBUG-*.md FIX-BP-*.md BP-DIAGNOSTIC-*.md; do
    if [ -f "$file" ]; then
        mv "$file" docs/archive/diagnostic-tools/
        echo "  ✓ $file"
    fi
done

# 已过时的Storage策略文档
if [ -f "BP-STORAGE-POLICIES-COPY-PASTE.md" ]; then
    mv BP-STORAGE-POLICIES-COPY-PASTE.md docs/archive/deprecated/
    echo "  ✓ 旧版Storage策略已归档"
fi

if [ -f "BP-STORAGE-POLICIES-GUIDE.md" ]; then
    mv BP-STORAGE-POLICIES-GUIDE.md docs/archive/deprecated/
    echo "  ✓ Storage策略指南已归档"
fi

# 上传调试指南
if [ -f "BP-UPLOAD-DEBUG-GUIDE.md" ]; then
    mv BP-UPLOAD-DEBUG-GUIDE.md docs/archive/diagnostic-tools/
    echo "  ✓ BP上传调试已归档"
fi

# OCR解决方案
if [ -f "BP-OCR-ALTERNATIVE-SOLUTION.md" ]; then
    mv BP-OCR-ALTERNATIVE-SOLUTION.md docs/archive/deprecated/
    echo "  ✓ OCR方案已归档"
fi

# 验证脚本
if [ -f "VERIFY-BP-STORAGE-POLICIES.md" ]; then
    mv VERIFY-BP-STORAGE-POLICIES.md docs/archive/diagnostic-tools/
    echo "  ✓ Storage验证已归档"
fi

# Fixes摘要
for file in FIXES-*.md FIX-*.md; do
    if [ -f "$file" ] && [ "$file" != "FIX-CHAT-SESSIONS-GUIDE.md" ]; then
        mv "$file" docs/archive/deprecated/
        echo "  ✓ $file"
    fi
done

# ============================================================================
# 4. 清理临时和重复文件
# ============================================================================
echo ""
echo "🧹 清理临时文件..."

# 删除空文件和临时文件
find . -maxdepth 1 -type f -name "*.tmp" -delete
find . -maxdepth 1 -type f -name "*~" -delete
find . -maxdepth 1 -type f -size 0 -delete

echo "  ✓ 临时文件已清理"

# ============================================================================
# 5. 总结
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 文档整理完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 新的结构:"
echo "  docs/setup/          - 设置指南"
echo "  docs/guides/         - 使用指南"
echo "  docs/archive/        - 归档文档"
echo ""
echo "🔍 剩余根目录文件:"
ls -1 *.md *.sql 2>/dev/null | head -10 || echo "  (已清理完毕)"
echo ""
echo "📝 下一步:"
echo "  1. 检查docs/目录结构"
echo "  2. 更新README.md"
echo "  3. 提交更改"

