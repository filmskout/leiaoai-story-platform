import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
  const { actualTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language.startsWith('en') || (!i18n.language.startsWith('zh'));

  const lastUpdated = 'January 12, 2025';
  const lastUpdatedCN = '2025年1月12日';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      actualTheme === 'dark' ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "border-b",
        actualTheme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className={cn(
              "flex items-center gap-2 mb-4 px-3 py-2 rounded-lg transition-colors",
              actualTheme === 'dark'
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={20} />
            <span>{i18n.language.startsWith('zh') ? '返回主页' : 'Back to Home'}</span>
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-lg",
              actualTheme === 'dark' ? "bg-blue-900/30" : "bg-blue-100"
            )}>
              <Shield className="text-blue-500" size={32} />
            </div>
            <div>
              <h1 className={cn(
                "text-3xl font-bold",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('privacy.title')}
              </h1>
              <p className={cn(
                "text-sm mt-1",
                actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
                {t('privacy.last_updated')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={cn(
          "prose max-w-none",
          actualTheme === 'dark' ? "prose-invert" : "prose-gray"
        )}>
          {isEnglish ? (
            <>
              {/* English Version */}
              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Lock className="inline mr-2 mb-1" size={24} />
                  Introduction
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  Shenzhen Leiao Artificial Intelligence Operations Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered investment intelligence platform, including our website leiao.ai and related services (collectively, the "Services").
                </p>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  By accessing or using our Services, you agree to this Privacy Policy. If you do not agree with our practices, please do not use our Services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Database className="inline mr-2 mb-1" size={24} />
                  Information We Collect
                </h2>
                
                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  1. Information You Provide to Us
                </h3>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>Account Information:</strong> Email address, name, and password when you create an account</li>
                  <li><strong>Profile Information:</strong> Username, bio, avatar, and other profile details</li>
                  <li><strong>Authentication Data:</strong> Google OAuth credentials, Web3 wallet addresses (Ethereum/Solana)</li>
                  <li><strong>Business Documents:</strong> Business plans, financial documents, and Business Model Canvas data you upload</li>
                  <li><strong>Communication Content:</strong> AI chat conversations, questions, and feedback</li>
                  <li><strong>User-Generated Content:</strong> Stories, comments, and community interactions</li>
                </ul>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  2. Automatically Collected Information
                </h3>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent, interaction patterns</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                  <li><strong>Location Data:</strong> Approximate geographic location based on IP address for model recommendations</li>
                  <li><strong>Performance Metrics:</strong> AI model response times, system performance data</li>
                  <li><strong>Cookies and Similar Technologies:</strong> Session management, preferences, analytics</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Eye className="inline mr-2 mb-1" size={24} />
                  How We Use Your Information
                </h2>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>Provide and Improve Services:</strong> Process your AI chat requests, analyze business plans, generate insights</li>
                  <li><strong>Personalization:</strong> Recommend AI models based on your location and preferences</li>
                  <li><strong>Account Management:</strong> Manage your account, authentication, and profile</li>
                  <li><strong>Communication:</strong> Send service updates, security alerts, and respond to inquiries</li>
                  <li><strong>Analytics:</strong> Track platform performance, optimize user experience</li>
                  <li><strong>Security:</strong> Detect and prevent fraud, unauthorized access, and security threats</li>
                  <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Globe className="inline mr-2 mb-1" size={24} />
                  Information Sharing and Disclosure
                </h2>
                
                <p className={cn("leading-relaxed mb-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Third-Party Service Providers
                </h3>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>AI Model Providers:</strong> OpenAI, DeepSeek, Qwen (for AI chat and analysis)</li>
                  <li><strong>Authentication Services:</strong> Google OAuth, Supabase Auth</li>
                  <li><strong>Cloud Infrastructure:</strong> Supabase (database and storage), Vercel (hosting)</li>
                  <li><strong>Analytics:</strong> Usage analytics and performance monitoring</li>
                </ul>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Legal Requirements
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We may disclose your information if required by law, court order, or government request, or to protect the rights, property, or safety of LeiaoAI, our users, or others.
                </p>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Business Transfers
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Lock className="inline mr-2 mb-1" size={24} />
                  Data Security
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• Encryption in transit (HTTPS/TLS) and at rest</li>
                  <li>• Row-level security (RLS) policies in our database</li>
                  <li>• Secure authentication with password hashing</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Access controls and monitoring</li>
                </ul>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Database className="inline mr-2 mb-1" size={24} />
                  Business Plan Privacy
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <strong>Important:</strong> Business plans uploaded to our platform will not be made public under any circumstances. They are used exclusively for:
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• Internal research and analysis purposes</li>
                  <li>• Investor introduction purposes when explicitly requested by the user</li>
                  <li>• AI-powered business plan analysis and scoring</li>
                </ul>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  All business plan records will be permanently deleted when:
                </p>
                <ul className={cn("space-y-2 mt-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• User manually deletes them via the dashboard</li>
                  <li>• User account is closed (within 6 months)</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <UserCheck className="inline mr-2 mb-1" size={24} />
                  Your Rights and Choices
                </h2>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Export:</strong> Download your data (chat sessions, uploaded documents)</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Cookie Management:</strong> Control cookies through your browser settings</li>
                </ul>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  To exercise these rights, please contact us at <a href="mailto:privacy@leiao.ai" className="text-blue-500 hover:underline">privacy@leiao.ai</a>
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Data Retention
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We retain your information for as long as necessary to provide our Services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  International Data Transfers
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Children's Privacy
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  Our Services are not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Changes to This Policy
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of the Services after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Mail className="inline mr-2 mb-1" size={24} />
                  Contact Us
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className={cn("mt-4 p-4 rounded-lg", actualTheme === 'dark' ? "bg-gray-800" : "bg-gray-100")}>
                  <p className={cn("font-medium", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                    {isEnglish ? 'LeiaoAI Privacy Team' : '蕾奥AI隐私团队'}
                  </p>
                  <p className={cn("text-sm", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    {isEnglish ? 'Shenzhen Leiao Artificial Intelligence Operations Limited' : '深圳市蕾奥人工智能运营有限公司'}
                  </p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    Email: <a href="mailto:privacy@leiao.ai" className="text-blue-500 hover:underline">privacy@leiao.ai</a>
                  </p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    Website: <a href="https://leiao.ai" className="text-blue-500 hover:underline">leiao.ai</a>
                  </p>
                  <p className={cn("mt-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    {isEnglish ? 'Offices: Shenzhen, Hong Kong, San Jose, California' : '办公室：深圳、香港、圣何塞（加利福尼亚）'}
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Chinese Version */}
              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Lock className="inline mr-2 mb-1" size={24} />
                  简介
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  蕾奥AI（"我们"、"我们的"）致力于保护您的隐私。本隐私政策说明了当您使用我们的AI驱动的投资智能平台（包括我们的网站 leiao.ai 和相关服务，统称为"服务"）时，我们如何收集、使用、披露和保护您的信息。
                </p>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  通过访问或使用我们的服务，即表示您同意本隐私政策。如果您不同意我们的做法，请不要使用我们的服务。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Database className="inline mr-2 mb-1" size={24} />
                  我们收集的信息
                </h2>
                
                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  1. 您提供给我们的信息
                </h3>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>账户信息：</strong>创建账户时的电子邮箱、姓名和密码</li>
                  <li><strong>个人资料信息：</strong>用户名、简介、头像和其他资料详情</li>
                  <li><strong>认证数据：</strong>Google OAuth凭证、Web3钱包地址（Ethereum/Solana）</li>
                  <li><strong>业务文档：</strong>您上传的商业计划书、财务文档和商业模式画布数据</li>
                  <li><strong>通信内容：</strong>AI聊天对话、问题和反馈</li>
                  <li><strong>用户生成内容：</strong>故事、评论和社区互动</li>
                </ul>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  2. 自动收集的信息
                </h3>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>使用数据：</strong>访问的页面、使用的功能、花费的时间、交互模式</li>
                  <li><strong>设备信息：</strong>浏览器类型、操作系统、设备标识符</li>
                  <li><strong>位置数据：</strong>基于IP地址的大致地理位置，用于模型推荐</li>
                  <li><strong>性能指标：</strong>AI模型响应时间、系统性能数据</li>
                  <li><strong>Cookie和类似技术：</strong>会话管理、偏好设置、分析</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Eye className="inline mr-2 mb-1" size={24} />
                  我们如何使用您的信息
                </h2>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>提供和改进服务：</strong>处理您的AI聊天请求、分析商业计划书、生成洞察</li>
                  <li><strong>个性化：</strong>根据您的位置和偏好推荐AI模型</li>
                  <li><strong>账户管理：</strong>管理您的账户、认证和个人资料</li>
                  <li><strong>通信：</strong>发送服务更新、安全警报和回复咨询</li>
                  <li><strong>分析：</strong>跟踪平台性能、优化用户体验</li>
                  <li><strong>安全：</strong>检测和防止欺诈、未经授权的访问和安全威胁</li>
                  <li><strong>法律合规：</strong>遵守适用的法律法规</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Globe className="inline mr-2 mb-1" size={24} />
                  信息共享和披露
                </h2>
                
                <p className={cn("leading-relaxed mb-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们不出售您的个人信息。在以下情况下，我们可能会共享您的信息：
                </p>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  第三方服务提供商
                </h3>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>AI模型提供商：</strong>OpenAI、DeepSeek、Qwen（用于AI聊天和分析）</li>
                  <li><strong>认证服务：</strong>Google OAuth、Supabase Auth</li>
                  <li><strong>云基础设施：</strong>Supabase（数据库和存储）、Vercel（托管）</li>
                  <li><strong>分析：</strong>使用分析和性能监控</li>
                </ul>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  法律要求
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  如果法律、法院命令或政府要求，或为保护蕾奥AI、我们的用户或其他人的权利、财产或安全，我们可能会披露您的信息。
                </p>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  业务转让
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  在合并、收购或资产出售的情况下，您的信息可能会转移给收购实体。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Lock className="inline mr-2 mb-1" size={24} />
                  数据安全
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们实施行业标准的安全措施来保护您的信息：
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• 传输中（HTTPS/TLS）和静态加密</li>
                  <li>• 数据库中的行级安全（RLS）策略</li>
                  <li>• 使用密码哈希的安全认证</li>
                  <li>• 定期安全审计和更新</li>
                  <li>• 访问控制和监控</li>
                </ul>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  但是，没有任何通过互联网传输或电子存储的方法是100%安全的。我们无法保证绝对安全。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <UserCheck className="inline mr-2 mb-1" size={24} />
                  您的权利和选择
                </h2>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li><strong>访问：</strong>请求您的个人信息副本</li>
                  <li><strong>更正：</strong>更新或更正不准确的信息</li>
                  <li><strong>删除：</strong>请求删除您的账户和相关数据</li>
                  <li><strong>导出：</strong>下载您的数据（聊天记录、上传的文档）</li>
                  <li><strong>退出：</strong>取消订阅营销通信</li>
                  <li><strong>Cookie管理：</strong>通过浏览器设置控制Cookie</li>
                </ul>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  要行使这些权利，请通过 <a href="mailto:privacy@leiao.ai" className="text-blue-500 hover:underline">privacy@leiao.ai</a> 联系我们
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  数据保留
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们会在提供服务和遵守法律义务所需的时间内保留您的信息。当您删除账户时，我们将在30天内删除或匿名化您的个人信息，除非法律要求保留。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  国际数据传输
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  您的信息可能会被转移到您居住国以外的国家并在那里处理。我们确保采取适当的保护措施，按照本隐私政策保护您的信息。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  儿童隐私
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们的服务不适用于18岁以下的用户。我们不会故意收集儿童的信息。如果您认为我们收集了儿童的信息，请立即联系我们。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  政策变更
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们可能会不时更新本隐私政策。我们将通过在我们的网站上发布更新的政策并更新"最后更新"日期来通知您重大更改。在此类更改后继续使用服务即表示接受更新的政策。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Mail className="inline mr-2 mb-1" size={24} />
                  联系我们
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  如果您对本隐私政策或我们的隐私实践有疑问或顾虑，请联系我们：
                </p>
                <div className={cn("mt-4 p-4 rounded-lg", actualTheme === 'dark' ? "bg-gray-800" : "bg-gray-100")}>
                  <p className={cn("font-medium", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>蕾奥AI隐私团队</p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    电子邮箱：<a href="mailto:privacy@leiao.ai" className="text-blue-500 hover:underline">privacy@leiao.ai</a>
                  </p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    网站：<a href="https://leiao.ai" className="text-blue-500 hover:underline">leiao.ai</a>
                  </p>
                  <p className={cn("mt-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    办公室：深圳、香港、圣何塞（加利福尼亚）
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Privacy;

