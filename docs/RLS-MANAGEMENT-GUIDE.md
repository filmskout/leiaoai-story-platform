# RLS (Row Level Security) Management Guide

## 🔐 **What is RLS?**

Row Level Security (RLS) is a PostgreSQL feature that restricts which rows users can access in database tables. In Supabase, it's used to control data access based on user authentication and roles.

## 🎯 **RLS Adjustment Methods**

### **Method 1: Temporarily Disable RLS (Quick & Easy)**

```sql
-- Disable RLS temporarily
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;

-- Run your script
-- npm run fix-relationships

-- Re-enable RLS after script completes
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
```

**Pros:** Simple, works immediately
**Cons:** Temporarily removes all security

### **Method 2: Modify RLS Policies (Recommended)**

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "tools_insert_auth" ON public.tools;

-- Create new policy that allows service role
CREATE POLICY "tools_insert_service_role" ON public.tools FOR INSERT 
TO service_role WITH CHECK (true);

CREATE POLICY "tools_insert_auth" ON public.tools FOR INSERT 
TO authenticated WITH CHECK (true);
```

**Pros:** Maintains security, allows admin operations
**Cons:** Requires understanding of policies

### **Method 3: Use Service Role Key (Best Practice)**

Update your script to use the service role key:

```typescript
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});
```

**Pros:** Secure, follows best practices
**Cons:** Requires service role key

## 🛠️ **Step-by-Step Instructions**

### **Option A: Quick Fix (Disable RLS)**

1. **Run in Supabase SQL Editor:**
   ```sql
   ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;
   ```

2. **Run the script:**
   ```bash
   npm run fix-relationships
   ```

3. **Re-enable RLS:**
   ```sql
   ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
   ```

### **Option B: Policy Fix (Recommended)**

1. **Run in Supabase SQL Editor:**
   ```sql
   -- Use the migration file: 2025-01-20_fix_tools_rls_policies.sql
   ```

2. **Run the script:**
   ```bash
   npm run fix-relationships
   ```

### **Option C: Service Role (Best Practice)**

1. **Set environment variable:**
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   ```

2. **Run the script:**
   ```bash
   npm run fix-relationships
   ```

## 🔍 **Check Current RLS Status**

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tools', 'companies', 'fundings');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'tools';
```

## 🚨 **Common RLS Issues**

### **Issue 1: "new row violates row-level security policy"**
**Solution:** Use service role key or modify policies

### **Issue 2: "permission denied for table"**
**Solution:** Check if RLS is enabled and policies exist

### **Issue 3: "policy already exists"**
**Solution:** Use `DROP POLICY IF EXISTS` before creating

## 📋 **RLS Best Practices**

1. **Always use service role for admin scripts**
2. **Test policies with different user roles**
3. **Document policy purposes**
4. **Use `IF EXISTS` clauses in migrations**
5. **Regularly audit RLS policies**

## 🔧 **Environment Variables**

```bash
# For admin scripts
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# For regular app usage
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 **Monitoring RLS**

```sql
-- Check policy violations
SELECT * FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
AND n_tup_ins > 0;

-- Monitor failed queries
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%tools%' 
AND calls > 0;
```

## 🎯 **Recommended Approach**

For your current situation, I recommend **Option B (Policy Fix)**:

1. Run `2025-01-20_fix_tools_rls_policies.sql`
2. Run `npm run fix-relationships`
3. Verify success with `npm run check-data`

This maintains security while allowing your admin scripts to work properly.
