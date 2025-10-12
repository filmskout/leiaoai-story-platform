# 浏览器调试脚本 - AI Chat Sessions

## 问题诊断

如果Dashboard不显示AI Chat Sessions，请在浏览器Console中运行以下脚本进行诊断。

### 步骤1: 检查用户登录状态

```javascript
// 在浏览器Console中运行
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');

const supabase = createClient(
  'YOUR_SUPABASE_URL',  // 替换为你的Supabase URL
  'YOUR_SUPABASE_ANON_KEY'  // 替换为你的Supabase Anon Key
);

// 检查登录状态
const { data: { user }, error } = await supabase.auth.getUser();

if (user) {
  console.log('✅ 用户已登录');
  console.log('User ID:', user.id);
  console.log('Email:', user.email);
} else {
  console.log('❌ 用户未登录');
  console.log('Error:', error);
}
```

### 步骤2: 检查chat_sessions表

```javascript
// 查询当前用户的所有会话
const { data: sessions, error: sessionsError } = await supabase
  .from('chat_sessions')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

console.log('📊 会话查询结果:');
console.log('Total sessions:', sessions?.length || 0);
console.log('Sessions:', sessions);
console.log('Error:', sessionsError);

// 如果有会话，显示详情
if (sessions && sessions.length > 0) {
  console.log('\n会话列表:');
  sessions.forEach((session, index) => {
    console.log(`${index + 1}. ${session.title}`);
    console.log(`   - ID: ${session.session_id}`);
    console.log(`   - Category: ${session.category || 'N/A'}`);
    console.log(`   - Created: ${session.created_at}`);
    console.log(`   - Messages: ${session.message_count || 0}`);
  });
}
```

### 步骤3: 检查chat_messages表

```javascript
// 查询消息
const { data: messages, error: messagesError } = await supabase
  .from('chat_messages')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);

console.log('💬 最近10条消息:');
console.log('Total messages:', messages?.length || 0);
console.log('Messages:', messages);
console.log('Error:', messagesError);
```

### 步骤4: 检查RLS策略

```javascript
// 测试是否可以读取
const { data: testRead, error: readError } = await supabase
  .from('chat_sessions')
  .select('count')
  .eq('user_id', user.id);

console.log('🔒 RLS策略测试:');
console.log('Can read:', !readError);
console.log('Error:', readError);
```

### 步骤5: 创建测试会话

```javascript
// 创建一个测试会话
const testSessionId = crypto.randomUUID();

const { data: newSession, error: createError } = await supabase
  .from('chat_sessions')
  .insert({
    session_id: testSessionId,
    user_id: user.id,
    title: '测试会话 - ' + new Date().toLocaleString(),
    category: 'test',
    message_count: 0
  })
  .select()
  .single();

console.log('🆕 创建测试会话:');
console.log('Success:', !!newSession);
console.log('Session:', newSession);
console.log('Error:', createError);

// 如果创建成功，添加测试消息
if (newSession) {
  const { data: newMessage, error: messageError } = await supabase
    .from('chat_messages')
    .insert([
      {
        session_id: testSessionId,
        role: 'user',
        content: '这是一条测试消息',
        ai_model: null,
        processing_time: null
      },
      {
        session_id: testSessionId,
        role: 'assistant',
        content: '这是AI的测试回复',
        ai_model: 'test-model',
        processing_time: 1000
      }
    ])
    .select();

  console.log('💬 添加测试消息:');
  console.log('Success:', !!newMessage);
  console.log('Messages:', newMessage);
  console.log('Error:', messageError);
}
```

### 步骤6: 重新查询验证

```javascript
// 再次查询所有会话
const { data: updatedSessions } = await supabase
  .from('chat_sessions')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

console.log('🔄 更新后的会话列表:');
console.log('Total:', updatedSessions?.length || 0);
console.log('Sessions:', updatedSessions);
```

### 步骤7: 统计分类会话

```javascript
// 统计各category的会话数
const { data: categoryCounts } = await supabase
  .from('chat_sessions')
  .select('category')
  .not('category', 'is', null);

const counts = {};
categoryCounts?.forEach(session => {
  counts[session.category] = (counts[session.category] || 0) + 1;
});

console.log('📈 分类统计:');
console.log('Total sessions with category:', categoryCounts?.length || 0);
console.log('By category:', counts);
```

## 简化版：一键诊断

复制以下完整脚本到浏览器Console，一次性运行所有诊断：

```javascript
(async () => {
  const SUPABASE_URL = 'YOUR_SUPABASE_URL';  // 替换
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // 替换

  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔍 开始诊断...\n');

  // 1. 检查用户
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('❌ 用户未登录');
    return;
  }
  console.log('✅ 用户已登录:', user.id);

  // 2. 查询会话
  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user.id);

  console.log(`\n📊 找到 ${sessions?.length || 0} 个会话`);
  if (error) {
    console.error('❌ 查询错误:', error);
  }

  // 3. 查询消息
  if (sessions && sessions.length > 0) {
    for (const session of sessions) {
      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session.session_id);

      console.log(`\n会话: ${session.title}`);
      console.log(`  - Category: ${session.category || 'N/A'}`);
      console.log(`  - Messages: ${count || 0}`);
      console.log(`  - Created: ${new Date(session.created_at).toLocaleString()}`);
    }
  }

  // 4. 分类统计
  const categoryMap = {};
  sessions?.forEach(s => {
    if (s.category) {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
    }
  });

  console.log('\n📈 分类统计:');
  Object.entries(categoryMap).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  console.log('\n✅ 诊断完成');
})();
```

## 常见问题解决方案

### 问题1: "用户未登录"

**解决方案**: 
1. 访问网站并登录
2. 重新运行诊断脚本

### 问题2: "找到0个会话"但实际创建过

**可能原因**:
1. user_id不匹配（会话保存时使用了不同的user_id）
2. RLS策略阻止读取
3. 会话保存失败（检查浏览器Console的错误日志）

**解决方案**:
1. 运行步骤5创建测试会话
2. 如果测试会话也创建失败，检查RLS策略
3. 查看`DEBUG-CHAT-SESSIONS.sql`中的RLS策略修复脚本

### 问题3: "RLS策略测试失败"

**解决方案**:
在Supabase Dashboard的SQL Editor中运行:

```sql
-- 添加RLS策略
CREATE POLICY "Users can view their own chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions"
ON chat_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### 问题4: Dashboard不刷新

**解决方案**:
1. 刷新页面 (Ctrl+R 或 Cmd+R)
2. 清除浏览器缓存
3. 检查浏览器Console是否有错误
4. 确认`loadChatSessions`函数被调用

