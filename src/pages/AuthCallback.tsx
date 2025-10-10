import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // 获取URL中的哈希片段
      const hashFragment = window.location.hash;

      if (hashFragment && hashFragment.length > 0) {
        // 将认证代码交换为会话
        const { data, error } = await supabase.auth.exchangeCodeForSession(hashFragment);

        if (error) {
          console.error('交换会话时出错:', error.message);
          navigate('/auth?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          // 登录成功，跳转到主页
          navigate('/');
          return;
        }
      }

      // 如果到达这里，说明出了问题
      navigate('/auth?error=' + encodeURIComponent('未找到有效的会话'));
    } catch (error: any) {
      console.error('认证回调处理错误:', error);
      navigate('/auth?error=' + encodeURIComponent(error.message || '认证失败'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在处理登录...</h2>
        <p className="text-gray-600">请稍等，我们正在验证您的账号信息。</p>
      </div>
    </div>
  );
}