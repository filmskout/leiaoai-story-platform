#!/bin/bash
# Cleanup repository - archive old SQL and MJS files

echo "🧹 Cleaning up repository..."

# Create archive directory
mkdir -p cleanup/archive

# Move old SQL files to archive
echo "📦 Archiving old SQL files..."
mv -v BILINGUAL-BATCH-*.sql cleanup/archive/ 2>/dev/null || true
mv -v BILINGUAL-DESCRIPTIONS*.sql cleanup/archive/ 2>/dev/null || true
mv -v COMPLETE-ALL-116-FOUNDATION-DATA.sql cleanup/archive/ 2>/dev/null || true
mv -v COMPLETE-ALL-116-FOUNDATION-DATA-FINAL.sql cleanup/archive/ 2>/dev/null || true
mv -v COMPLETE-MISSING-86-COMPANIES.sql cleanup/archive/ 2>/dev/null || true
mv -v COMPLETE-ALL-VALUATIONS.sql cleanup/archive/ 2>/dev/null || true
mv -v COMPLETE-FUNDINGS-VALUATIONS.sql cleanup/archive/ 2>/dev/null || true
mv -v diagnose-company-names.sql cleanup/archive/ 2>/dev/null || true
mv -v generate-*.sql cleanup/archive/ 2>/dev/null || true

# Move old MJS files
echo "📦 Archiving old MJS files..."
mv -v batch-complete-*.mjs cleanup/archive/ 2>/dev/null || true
mv -v generate-*.mjs cleanup/archive/ 2>/dev/null || true
mv -v quick-complete-*.mjs cleanup/archive/ 2>/dev/null || true
mv -v batch-enrich-*.mjs cleanup/archive/ 2>/dev/null || true
mv -v generate-missing-*.mjs cleanup/archive/ 2>/dev/null || true

# Move old markdown files
echo "📦 Archiving old docs..."
mv -v DATA-GENERATION-STATUS.md cleanup/archive/ 2>/dev/null || true
mv -v EXECUTION-GUIDE.md cleanup/archive/ 2>/dev/null || true
mv -v ESSENTIAL-FILES.md cleanup/archive/ 2>/dev/null || true

echo "✅ Cleanup complete! Archived files moved to cleanup/archive/"
echo "📊 Keeping essential files:"
echo "   - FINAL-FOUNDATION-COMPLETE.sql"
echo "   - UPDATE-FOUNDATION-DIRECT.sql"
echo "   - CHECK-FOUNDATION-STATUS.sql"
echo "   - QUERY-MISSING-FOUNDATION.sql"
echo "   - EXECUTE-SQL-SCRIPTS.md"

