#!/bin/bash
# Comprehensive cleanup of root directory - archive old/unused scripts

echo "🧹 Cleaning up root directory..."

# Ensure archive directory exists
mkdir -p cleanup/archive/$(date +%Y-%m-%d)

ARCHIVE_DIR="cleanup/archive/$(date +%Y-%m-%d)"

# Archive old batch SQL files (completed data generation)
echo "📦 Archiving batch SQL files..."
mv -v batch-*-companies-*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v complete-*-companies*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v complete-*-descriptions*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v FINAL-complete-all-companies.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v GENERATE-ALL-116-COMPANIES.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old fix SQL files (superseded by newer versions)
echo "📦 Archiving old fix SQL files..."
mv -v fix-*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v add-*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v remove-*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v separate-*.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v setup-*.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old classification SQL files
echo "📦 Archiving classification SQL files..."
mv -v CLASSIFY-COMPANIES-BY-TYPE-TIER.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v ENHANCED-COMPANY-CLASSIFICATION.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old foundation SQL files (keep only final versions)
echo "📦 Archiving old foundation SQL files..."
mv -v COMPLETE-FOUNDATION-ENHANCED.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v FIX-FOUNDATION-UPDATE-ALL.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old valuation SQL files (keep only fixed version)
echo "📦 Archiving old valuation SQL files..."
mv -v UPDATE-COMPANIES-VALUATIONS.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v complete-missing-company-urls.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old URL update SQL files (keep only known and all)
echo "📦 Archiving old URL update files..."
mv -v UPDATE-COMPANIES-URLS.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v UPDATE-PROJECT-URLS-MANUAL.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old tier SQL files (keep only V2)
echo "📦 Archiving old tier SQL files..."
mv -v UPDATE-TIER-NAMES.sql "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v FIX-TIERS-GIANTS-UNICORNS.sql "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old MJS scripts from root (keep scripts/ directory)
echo "📦 Archiving old MJS scripts from root..."
for file in *.mjs; do
  [ -f "$file" ] && mv -v "$file" "$ARCHIVE_DIR/" 2>/dev/null || true
done

# Archive old text/log files
echo "📦 Archiving text/log files..."
mv -v all-companies-list.txt "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v generate-bilingual.log "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old markdown guides (keep only essential)
echo "📦 Archiving old markdown guides..."
mv -v GENERATE-PROJECT-URLS-GUIDE.md "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v GUIDE-COMPLETE-URLS-AND-TIER.md "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v VALUATION-COMPLETION-REPORT.md "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v IMPLEMENTATION-SUMMARY.md "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v OPTIMIZED-BATCH-GENERATION-STRATEGY.md "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v FRONTEND-OPTIMIZATION-GUIDE.md "$ARCHIVE_DIR/" 2>/dev/null || true
mv -v QWEN-CONFIGURATION.md "$ARCHIVE_DIR/" 2>/dev/null || true

# Archive old test HTML
echo "📦 Archiving test files..."
mv -v test-ai-chat.html "$ARCHIVE_DIR/" 2>/dev/null || true

echo ""
echo "✅ Cleanup complete! Files moved to $ARCHIVE_DIR/"
echo ""
echo "📊 Keeping essential files in root:"
echo "   - Current tier fixes: FIX-TIERS-GIANTS-UNICORNS-V2.sql"
echo "   - Tier fill: TIER-FILL-INDEPENDENT-EMERGING.sql"
echo "   - Foundation: FINAL-FOUNDATION-COMPLETE.sql, UPDATE-FOUNDATION-DIRECT.sql"
echo "   - URLs: UPDATE-COMPANY-WEBSITES-KNOWN.sql, UPDATE-ALL-COMPANIES-URLS.sql"
echo "   - Valuations: COMPLETE-FUNDINGS-VALUATIONS-FIXED.sql"
echo "   - Verification: VERIFY-TIERS-AND-URLS.sql, QUERY-*"
echo "   - Templates: GENERATE-MISSING-URLS-TEMPLATE.sql"
echo "   - Scripts: scripts/enrich-companies-web.mjs"
echo "   - Schema: STEP-0-SETUP-SCHEMA.sql"
echo ""
echo "📝 To review before deleting permanently:"
echo "   ls -la $ARCHIVE_DIR/"

