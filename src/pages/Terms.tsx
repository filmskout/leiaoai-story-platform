import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FileText, Scale, AlertTriangle, UserX, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms: React.FC = () => {
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
            <span>{t('common.back_to_home', 'Back to Home')}</span>
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-lg",
              actualTheme === 'dark' ? "bg-purple-900/30" : "bg-purple-100"
            )}>
              <FileText className="text-purple-500" size={32} />
            </div>
            <div>
              <h1 className={cn(
                "text-3xl font-bold",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('terms.title')}
              </h1>
              <p className={cn(
                "text-sm mt-1",
                actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
                {t('terms.last_updated')}
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
                  <Scale className="inline mr-2 mb-1" size={24} />
                  Agreement to Terms
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  These Terms of Service ("Terms") govern your access to and use of LeiaoAI's website, platform, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  If you do not agree to these Terms, you may not access or use our Services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Services Description
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  LeiaoAI provides an AI-powered investment intelligence platform that includes:
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• AI chat consultations for investment and business questions</li>
                  <li>• Business plan analysis and evaluation</li>
                  <li>• Business Model Canvas generation and optimization</li>
                  <li>• Community platform for sharing stories and experiences</li>
                  <li>• Professional service recommendations across multiple domains</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  User Accounts
                </h2>
                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Account Creation
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  You may create an account using email/password, Google OAuth, or Web3 wallet authentication. You are responsible for:
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• Maintaining the confidentiality of your account credentials</li>
                  <li>• All activities that occur under your account</li>
                  <li>• Notifying us immediately of any unauthorized access</li>
                  <li>• Providing accurate and current information</li>
                </ul>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Age Requirements
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  You must be at least 18 years old to use our Services. By using our Services, you represent that you meet this age requirement.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <AlertTriangle className="inline mr-2 mb-1" size={24} />
                  Acceptable Use
                </h2>
                <p className={cn("leading-relaxed mb-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  You agree not to use our Services to:
                </p>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Infringe on intellectual property rights of others</li>
                  <li>• Upload malicious code, viruses, or harmful content</li>
                  <li>• Engage in fraudulent or deceptive practices</li>
                  <li>• Harass, abuse, or harm other users</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Use automated systems to scrape or collect data</li>
                  <li>• Interfere with or disrupt the Services</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Intellectual Property
                </h2>
                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Our Rights
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  All content, features, and functionality of the Services (including but not limited to software, text, graphics, logos, and designs) are owned by LeiaoAI and protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Your Content
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  You retain ownership of content you submit (business plans, stories, comments). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content for the purpose of providing and improving our Services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  AI-Generated Content
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  Our Services use AI models (including OpenAI, DeepSeek, and Qwen) to generate responses and analysis. You understand that:
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• AI-generated content may not always be accurate or complete</li>
                  <li>• You should not rely solely on AI responses for critical business decisions</li>
                  <li>• We are not responsible for investment or business decisions made based on AI-generated content</li>
                  <li>• AI responses are for informational purposes only, not professional advice</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Disclaimer of Warranties
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Limitation of Liability
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEIAOAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR GOODWILL.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <UserX className="inline mr-2 mb-1" size={24} />
                  Termination
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We may terminate or suspend your account and access to the Services at any time, without prior notice, for any reason, including if you violate these Terms. Upon termination, your right to use the Services will immediately cease.
                </p>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  You may terminate your account at any time by contacting us or using the account deletion feature.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Governing Law
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  These Terms shall be governed by and construed in accordance with the laws of the People's Republic of China and the State of California, without regard to conflict of law principles.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  Changes to Terms
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Services after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Mail className="inline mr-2 mb-1" size={24} />
                  Contact Us
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  For questions about these Terms, please contact us:
                </p>
                <div className={cn("mt-4 p-4 rounded-lg", actualTheme === 'dark' ? "bg-gray-800" : "bg-gray-100")}>
                  <p className={cn("font-medium", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>LeiaoAI Legal Team</p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    Email: <a href="mailto:legal@leiao.ai" className="text-blue-500 hover:underline">legal@leiao.ai</a>
                  </p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    Website: <a href="https://leiao.ai" className="text-blue-500 hover:underline">leiao.ai</a>
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Chinese Version */}
              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Scale className="inline mr-2 mb-1" size={24} />
                  条款协议
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  本服务条款（"条款"）规定了您访问和使用蕾奥AI的网站、平台和服务（统称为"服务"）的条件。通过访问或使用我们的服务，即表示您同意受本条款和我们的隐私政策的约束。
                </p>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  如果您不同意这些条款，您不得访问或使用我们的服务。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  服务描述
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  蕾奥AI提供AI驱动的投资智能平台，包括：
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• AI聊天咨询，解答投资和商业问题</li>
                  <li>• 商业计划书分析和评估</li>
                  <li>• 商业模式画布生成和优化</li>
                  <li>• 社区平台，分享故事和经验</li>
                  <li>• 多领域专业服务推荐</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  用户账户
                </h2>
                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  账户创建
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  您可以使用电子邮件/密码、Google OAuth或Web3钱包认证创建账户。您需要负责：
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• 保持账户凭证的机密性</li>
                  <li>• 账户下发生的所有活动</li>
                  <li>• 立即通知我们任何未经授权的访问</li>
                  <li>• 提供准确和最新的信息</li>
                </ul>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  年龄要求
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  您必须年满18岁才能使用我们的服务。使用我们的服务即表示您符合此年龄要求。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <AlertTriangle className="inline mr-2 mb-1" size={24} />
                  可接受使用
                </h2>
                <p className={cn("leading-relaxed mb-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  您同意不将我们的服务用于：
                </p>
                <ul className={cn("space-y-2", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• 违反任何适用法律或法规</li>
                  <li>• 侵犯他人的知识产权</li>
                  <li>• 上传恶意代码、病毒或有害内容</li>
                  <li>• 从事欺诈或欺骗行为</li>
                  <li>• 骚扰、辱骂或伤害其他用户</li>
                  <li>• 试图未经授权访问我们的系统</li>
                  <li>• 使用自动化系统抓取或收集数据</li>
                  <li>• 干扰或破坏服务</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  知识产权
                </h2>
                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  我们的权利
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  服务的所有内容、功能和特性（包括但不限于软件、文本、图形、徽标和设计）均由蕾奥AI拥有，并受版权、商标和其他知识产权法保护。
                </p>

                <h3 className={cn("text-xl font-semibold mt-6 mb-3", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  您的内容
                </h3>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  您保留提交内容（商业计划书、故事、评论）的所有权。通过提交内容，您授予我们全球性、非独占、免版税的许可，以使用、复制和展示您的内容，用于提供和改进我们的服务。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  AI生成内容
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们的服务使用AI模型（包括OpenAI、DeepSeek和Qwen）生成响应和分析。您理解：
                </p>
                <ul className={cn("space-y-2 mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  <li>• AI生成的内容可能并不总是准确或完整</li>
                  <li>• 您不应仅依赖AI响应做出关键业务决策</li>
                  <li>• 我们对基于AI生成内容做出的投资或业务决策不承担责任</li>
                  <li>• AI响应仅供参考，不构成专业建议</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  免责声明
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  服务按"现状"和"可用"提供，不提供任何形式的保证。我们不提供任何明示或暗示的保证，包括适销性、特定用途适用性和非侵权性。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  责任限制
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  在法律允许的最大范围内，蕾奥AI不对任何间接、附带、特殊、后果性或惩罚性损害，或任何利润或收入损失（无论直接或间接），或任何数据、使用或商誉损失承担责任。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <UserX className="inline mr-2 mb-1" size={24} />
                  终止
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们可以随时终止或暂停您的账户和服务访问权限，无需事先通知，原因包括但不限于您违反本条款。终止后，您使用服务的权利将立即终止。
                </p>
                <p className={cn("leading-relaxed mt-4", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  您可以随时通过联系我们或使用账户删除功能来终止您的账户。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  适用法律
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  本条款应根据中华人民共和国和加利福尼亚州的法律进行管辖和解释，不考虑法律冲突原则。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  条款变更
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  我们保留随时修改本条款的权利。我们将通过在我们的网站上发布更新的条款并更新"最后更新"日期来通知您重大更改。更改后继续使用服务即表示接受新条款。
                </p>
              </section>

              <section className="mb-12">
                <h2 className={cn("text-2xl font-bold mb-4", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>
                  <Mail className="inline mr-2 mb-1" size={24} />
                  联系我们
                </h2>
                <p className={cn("leading-relaxed", actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  有关这些条款的问题，请联系我们：
                </p>
                <div className={cn("mt-4 p-4 rounded-lg", actualTheme === 'dark' ? "bg-gray-800" : "bg-gray-100")}>
                  <p className={cn("font-medium", actualTheme === 'dark' ? "text-white" : "text-gray-900")}>蕾奥AI法务团队</p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    电子邮箱：<a href="mailto:legal@leiao.ai" className="text-blue-500 hover:underline">legal@leiao.ai</a>
                  </p>
                  <p className={cn(actualTheme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                    网站：<a href="https://leiao.ai" className="text-blue-500 hover:underline">leiao.ai</a>
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

export default Terms;

