import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Mail, MapPin, Phone, Clock, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  const { actualTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language.startsWith('en');

  const offices = [
    {
      city: isEnglish ? 'Shenzhen, China' : '深圳',
      address: isEnglish ? 'Nanshan District, Shenzhen, Guangdong' : '广东省深圳市南山区',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235527.43633136366!2d113.76401959277344!3d22.543099199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403f032e9d4f36d%3A0x6660c0765b5e2c8e!2sNanshan%20District%2C%20Shenzhen%2C%20Guangdong%20Province%2C%20China!5e0!3m2!1sen!2sus!4v1673958300000!5m2!1sen!2sus',
    },
    {
      city: isEnglish ? 'Hong Kong' : '香港',
      address: isEnglish ? 'Central, Hong Kong SAR' : '香港特别行政区中环',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29537.14883614609!2d114.14988455!3d22.281337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404007ec82c012d%3A0xc4941d8d8901de8f!2sCentral%2C%20Hong%20Kong!5e0!3m2!1sen!2sus!4v1673958400000!5m2!1sen!2sus',
    },
    {
      city: isEnglish ? 'San Jose, California' : '圣何塞，加利福尼亚',
      address: isEnglish ? 'Silicon Valley, San Jose, CA, USA' : '美国加利福尼亚州圣何塞硅谷',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202740.94456270126!2d-122.00822085!3d37.3352372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fcae48af93ff5%3A0x20a0dfd0d1d0b!2sSan%20Jose%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1673958500000!5m2!1sen!2sus',
    },
  ];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              actualTheme === 'dark' ? "bg-green-900/30" : "bg-green-100"
            )}>
              <Mail className="text-green-500" size={32} />
            </div>
            <div>
              <h1 className={cn(
                "text-3xl font-bold",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {isEnglish ? 'Contact Us' : '联系我们'}
              </h1>
              <p className={cn(
                "text-sm mt-1",
                actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
                {isEnglish ? "We'd love to hear from you" : '我们期待您的联系'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Email */}
          <div className={cn(
            "p-6 rounded-xl",
            actualTheme === 'dark'
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200 shadow-sm"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              actualTheme === 'dark' ? "bg-blue-900/30" : "bg-blue-100"
            )}>
              <Mail className="text-blue-500" size={24} />
            </div>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              actualTheme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              {isEnglish ? 'Email' : '电子邮箱'}
            </h3>
            <div className={cn(
              "space-y-1",
              actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              <p><strong>{isEnglish ? 'General:' : '一般咨询：'}</strong></p>
              <a href="mailto:info@leiao.ai" className="text-blue-500 hover:underline block">
                info@leiao.ai
              </a>
              <p className="mt-3"><strong>{isEnglish ? 'Support:' : '技术支持：'}</strong></p>
              <a href="mailto:support@leiao.ai" className="text-blue-500 hover:underline block">
                support@leiao.ai
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className={cn(
            "p-6 rounded-xl",
            actualTheme === 'dark'
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200 shadow-sm"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              actualTheme === 'dark' ? "bg-green-900/30" : "bg-green-100"
            )}>
              <Phone className="text-green-500" size={24} />
            </div>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              actualTheme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              {isEnglish ? 'Phone' : '电话'}
            </h3>
            <div className={cn(
              "space-y-1",
              actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              <p><strong>{isEnglish ? 'Shenzhen:' : '深圳：'}</strong></p>
              <p>+86 755 xxxx xxxx</p>
              <p className="mt-3"><strong>{isEnglish ? 'Hong Kong:' : '香港：'}</strong></p>
              <p>+852 xxxx xxxx</p>
              <p className="mt-3"><strong>{isEnglish ? 'San Jose:' : '圣何塞：'}</strong></p>
              <p>+1 (408) xxx-xxxx</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className={cn(
            "p-6 rounded-xl",
            actualTheme === 'dark'
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200 shadow-sm"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              actualTheme === 'dark' ? "bg-purple-900/30" : "bg-purple-100"
            )}>
              <Clock className="text-purple-500" size={24} />
            </div>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              actualTheme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              {isEnglish ? 'Business Hours' : '营业时间'}
            </h3>
            <div className={cn(
              "space-y-2",
              actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              <p><strong>{isEnglish ? 'Monday - Friday:' : '周一至周五：'}</strong></p>
              <p>9:00 AM - 6:00 PM</p>
              <p className="mt-3"><strong>{isEnglish ? 'Weekend:' : '周末：'}</strong></p>
              <p>{isEnglish ? 'Closed' : '休息'}</p>
              <p className="mt-3 text-sm">
                {isEnglish ? '(Local time in each office)' : '（各办公室当地时间）'}
              </p>
            </div>
          </div>
        </div>

        {/* Office Locations with Maps */}
        <div className="space-y-12">
          <h2 className={cn(
            "text-2xl font-bold text-center mb-8",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {isEnglish ? 'Our Offices' : '我们的办公室'}
          </h2>

          {offices.map((office, index) => (
            <div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden",
                actualTheme === 'dark'
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200 shadow-lg"
              )}
            >
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    actualTheme === 'dark' ? "bg-orange-900/30" : "bg-orange-100"
                  )}>
                    <MapPin className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-xl font-bold mb-1",
                      actualTheme === 'dark' ? "text-white" : "text-gray-900"
                    )}>
                      {office.city}
                    </h3>
                    <p className={cn(
                      actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                    )}>
                      {office.address}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="aspect-video w-full">
                <iframe
                  src={office.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${office.city} Office Location`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className={cn(
          "mt-16 p-8 rounded-xl",
          actualTheme === 'dark'
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200 shadow-lg"
        )}>
          <h2 className={cn(
            "text-2xl font-bold mb-6 text-center",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {isEnglish ? 'Send Us a Message' : '发送消息给我们'}
          </h2>
          
          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  {isEnglish ? 'Name' : '姓名'}
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    actualTheme === 'dark'
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                  placeholder={isEnglish ? 'Your name' : '您的姓名'}
                />
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  {isEnglish ? 'Email' : '电子邮箱'}
                </label>
                <input
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    actualTheme === 'dark'
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                  placeholder={isEnglish ? 'your@email.com' : '您的邮箱'}
                />
              </div>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}>
                {isEnglish ? 'Subject' : '主题'}
              </label>
              <input
                type="text"
                className={cn(
                  "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                  actualTheme === 'dark'
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={isEnglish ? 'How can we help?' : '我们能为您做什么？'}
              />
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}>
                {isEnglish ? 'Message' : '消息'}
              </label>
              <textarea
                rows={6}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none",
                  actualTheme === 'dark'
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={isEnglish ? 'Tell us more about your inquiry...' : '告诉我们您的咨询...'}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {isEnglish ? 'Send Message' : '发送消息'}
            </Button>

            <p className={cn(
              "text-center text-sm",
              actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
            )}>
              {isEnglish 
                ? 'We typically respond within 24 hours'
                : '我们通常在24小时内回复'
              }
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

