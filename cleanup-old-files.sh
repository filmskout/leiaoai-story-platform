#!/bin/bash
# Cleanup script - archive old SQL and documentation files

# Create archive directory
mkdir -p cleanup/archive

# Archive old/duplicate SQL files (already implemented)
echo "Archiving old SQL files..."
mv fix-logo-*.sql cleanup/archive/ 2>/dev/null
mv aiverse-logo-migration*.sql cleanup/archive/ 2>/dev/null
mv insert-aiverse-*.sql cleanup/archive/ 2>/dev/null
mv add-logo-fields.sql cleanup/archive/ 2>/dev/null
mv add-missing-logos.sql cleanup/archive/ 2>/dev/null
mv check-*.sql cleanup/archive/ 2>/dev/null
mv diagnose-*.sql cleanup/archive/ 2>/dev/null
mv comprehensive-fix.sql cleanup/archive/ 2>/dev/null
mv complete-company-*.sql cleanup/archive/ 2>/dev/null
mv simple-schema-update.sql cleanup/archive/ 2>/dev/null
mv optimize-*.sql cleanup/archive/ 2>/dev/null
mv generate-simple-*.sql cleanup/archive/ 2>/dev/null

# Archive old documentation
echo "Archiving old documentation..."
mv *-GUIDE.md cleanup/archive/ 2>/dev/null
mv *-GUIDE.md cleanup/archive/ 2>/dev/null
mv *.md cleanup/archive/ 2>/dev/null || true

# Keep only essential files
echo "Keeping only essential files..."

echo "Cleanup complete!"
