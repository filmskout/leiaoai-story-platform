# 诊断脚本：检查OpenAI和Qwen的具体错误

## 测试OpenAI
```bash
curl -v -X POST "https://leiao.ai/api/ai-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "model": "openai", "language": "en"}' \
  --max-time 30
```

## 测试Qwen
```bash
curl -v -X POST "https://leiao.ai/api/ai-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "测试", "model": "qwen", "language": "zh"}' \
  --max-time 30
```

## 测试DeepSeek（参考基准）
```bash
curl -v -X POST "https://leiao.ai/api/ai-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "model": "deepseek", "language": "en"}' \
  --max-time 30
```

观察输出中的：
- HTTP状态码
- 响应时间
- 实际使用的模型
- 错误信息
