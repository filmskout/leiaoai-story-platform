#!/bin/bash
# Archive old SQL and documentation files that are no longer needed

echo "Starting cleanup..."

# Archive old SQL files (duplicates and obsolete)
mv fix-logo-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived logo fix SQLs"
mv aiverse-logo-migration*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived AIverse migration SQLs"
mv insert-aiverse-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived AIverse insert SQLs"
mv add-logo-fields.sql cleanup/archive/ 2>/dev/null
mv add-missing-logos.sql cleanup/archive/ 2>/dev/null
mv check-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived check SQLs"
mv diagnose-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived diagnose SQLs"
mv comprehensive-fix.sql cleanup/archive/ 2>/dev/null
mv fix-database-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived database fix SQLs"
mv complete-company-*.sql cleanup/archive/ 2>/dev/null
mv simple-schema-update.sql cleanup/archive/ 2>/dev/null
mv migrate-aiverse-*.sql cleanup/archive/ 2>/dev/null
mv simple-schema-update.sql cleanup/archive/ 2>/dev/null
mv projects-migration-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived migration SQLs"
mv tools-to-projects-*.sql cleanup/archive/ 2>/dev/null
mv create-adobe-vercel*.sql cleanup/archive/ 2>/dev/null
mv fix-company-*.sql cleanup/archive/ 2>/dev/null
mv fix-v0-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived v0 fix SQLs"
mv insert-*.sql cleanup/archive/ 2>/dev/null && echo "✓ Archived insert SQLs"

# Archive old documentation
mv *-GUIDE.md cleanup/archive/ 2>/dev/null && echo "✓ Archived guide docs"
mv *-DIAGNOSIS.md cleanup/archive/ 2>/dev/null
mv *-SUMMARY.md cleanup/archive/ 2>/dev/null
mv *-NOTES.md cleanup/archive/ 2>/dev/null
mv *-FIX*.md cleanup/archive/ 2>/dev/null
mv *-COMPLETION*.md cleanup/archive/ 2>/dev/null && echo "✓ Archived completion docs"
mv *-PLAN.md cleanup/archive/ 2>/dev/null

# Archive old JS files (generators, testers)
mv *-generator.js cleanup/archive/ 2>/dev/null && echo "✓ Archived generator scripts"
mv test-*.js cleanup/archive/ 2>/dev/null && echo "✓ Archived test scripts"
mv monitor-*.js cleanup/archive/ 2>/dev/null
mv download-*.mjs cleanup/archive/ 2>/dev/null
mv generate-*.mjs cleanup/archive/ 2>/dev/null
mv generate-*.js cleanup/archive/ 2>/dev/null
mv optimize-*.mjs cleanup/archive/ 2>/dev/null
mv migrate-*.mjs cleanup/archive/ 2>/dev/null
mv batch-enhanced-*.js cleanup/archive/ 2>/dev/null
mv optimized-*.js cleanup/archive/ 2>/dev/null
mv migrate-*.mjs cleanup/archive/ 2>/dev/null

# Archive shell scripts
mv *.sh cleanup/archive/ 2>/dev/null && echo "✓ Archived shell scripts"

# Archive JSON data files
mv *.json cleanup/archive/ 2>/dev/null && echo "✓ Archived JSON data files"

echo ""
echo "Cleanup complete! Files archived to cleanup/archive/"
echo ""
echo "Keeping only essential files:"
echo "- API files in api/"
echo "- Source code in src/"
echo "- Supabase migrations in supabase/"
echo "- Essential SQL files (see ESSENTIAL-FILES.md)"
echo ""
