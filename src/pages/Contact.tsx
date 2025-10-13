import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Mail, MapPin, Phone, Clock, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  const { actualTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isChina, setIsChina] = useState<boolean | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);

  // Detect if user is in China based on IP and fetch Google Maps API key
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use a simple IP geolocation service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIsChina(data.country_code === 'CN');
      } catch (error) {
        console.warn('Failed to detect location, defaulting to Google Maps:', error);
        setIsChina(false); // Default to Google Maps if detection fails
      }
    };

    const fetchGoogleMapsApiKey = async () => {
      try {
        const response = await fetch('/api/google-maps-key');
        if (response.ok) {
          const data = await response.json();
          setGoogleMapsApiKey(data.apiKey);
        } else {
          console.warn('Failed to fetch Google Maps API key');
        }
      } catch (error) {
        console.warn('Failed to fetch Google Maps API key:', error);
      }
    };

    detectLocation();
    fetchGoogleMapsApiKey();
  }, []);


  // Map configurations using Google Maps API with specific coordinates
  const getMapConfig = (officeType: 'shenzhen' | 'hong_kong' | 'san_jose') => {
    if (isChina === null) return null; // Still loading

    const configs = {
      shenzhen: {
        // Sunshine Financial Tower, Nanshan, Shenzhen, China
        google: googleMapsApiKey 
          ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=22.543099,113.764020&zoom=18&maptype=roadmap`
          : null,
        gaode: `https://uri.amap.com/marker?position=113.76401959277344,22.543099199999998&name=${encodeURIComponent('深圳市南山区后海阳光金融大厦')}&src=leiaoai`
      },
      hong_kong: {
        // The Hive, 21/F, The Phoenix, 23 Luard Rd, Wan Chai, Hong Kong
        google: googleMapsApiKey 
          ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=22.281337,114.149885&zoom=18&maptype=roadmap`
          : null,
        gaode: `https://uri.amap.com/marker?position=114.14988455,22.281337&name=${encodeURIComponent('香港灣仔盧押道23號The Phoenix 21樓.The Hive Wanchai')}&src=leiaoai`
      },
      san_jose: {
        // 1814 Brighten Avenue, San Jose, CA95124, USA
        google: googleMapsApiKey 
          ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=37.335237,-122.008221&zoom=18&maptype=roadmap`
          : null,
        gaode: `https://uri.amap.com/marker?position=-122.00822085,37.3352372&name=${encodeURIComponent('美国加州圣荷西1814 Brighten Avenue')}&src=leiaoai`
      }
    };

    return isChina ? configs[officeType].gaode : configs[officeType].google;
  };

  const offices = [
    {
      city: t('contact.shenzhen', 'Shenzhen Office'),
      address: t('contact.shenzhen_address', 'Sunshine Financial Tower, Nanshan, Shenzhen, China'),
      type: 'shenzhen' as const,
    },
    {
      city: t('contact.hong_kong', 'Hong Kong Office'),
      address: t('contact.hong_kong_address', 'The Hive, 21/F, The Phoenix, 23 Luard Rd, Wan Chai, Hong Kong'),
      type: 'hong_kong' as const,
    },
    {
      city: t('contact.san_jose', 'San Jose Office'),
      address: t('contact.san_jose_address', '1814 Brighten Avenue, San Jose, CA95124, USA'),
      type: 'san_jose' as const,
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
              {t('contact.title', 'Contact Us')}
              </h1>
              <p className={cn(
                "text-sm mt-1",
                actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
              {t('contact.subtitle', "We'd love to hear from you")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Contact Section - Desktop: 1/3 Email&Phone + 2/3 Form, Mobile: Stacked */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Email & Phone - Left Side (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email Section */}
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
                {t('contact.email_title', 'Email')}
              </h3>
              <div className={cn(
                "space-y-1",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                <p><strong>{t('contact.consultation', 'Consultation:')}</strong></p>
                <a href="mailto:info@leiao.ai" className="text-blue-500 hover:underline block">
                  info@leiao.ai
                </a>
              </div>
            </div>

            {/* Phone Section */}
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
                {t('contact.phone', 'Phone')}
              </h3>
              <div className={cn(
                "space-y-1",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                <p><strong>{t('contact.shenzhen', 'Shenzhen:')}</strong></p>
                <p>+86 755 xxxx xxxx</p>
                <p className="mt-3"><strong>{t('contact.hong_kong', 'Hong Kong:')}</strong></p>
                <p>+852 xxxx xxxx</p>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side (2/3) */}
          <div className="lg:col-span-2">
            <div className={cn(
              "p-8 rounded-xl h-full",
              actualTheme === 'dark'
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200 shadow-lg"
            )}>
              <h2 className={cn(
                "text-2xl font-bold mb-6 text-center",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('contact.send_message', 'Send Us a Message')}
              </h2>
              
              <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  {t('contact.name', 'Name')}
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    actualTheme === 'dark'
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                  placeholder={t('contact.name_placeholder', 'Your name')}
                />
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  {t('contact.email', 'Email')}
                </label>
                <input
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    actualTheme === 'dark'
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                  placeholder={t('contact.email_placeholder', 'your@email.com')}
                />
              </div>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}>
                {t('contact.subject', 'Subject')}
              </label>
              <input
                type="text"
                className={cn(
                  "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                  actualTheme === 'dark'
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={t('contact.subject_placeholder', 'How can we help you?')}
              />
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}>
                {t('contact.message', 'Message')}
              </label>
              <textarea
                rows={6}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none",
                  actualTheme === 'dark'
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={t('contact.message_placeholder', 'Please tell us your inquiry in detail...')}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {t('contact.send', 'Send Message')}
            </Button>

                <p className={cn(
                  "text-center text-sm",
                  actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
                )}>
                  {t('contact.response_time', 'We usually respond within 24 hours')}
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Office Locations with Maps */}
        <div className="space-y-8 mt-16">
          <h2 className={cn(
            "text-2xl font-bold text-center mb-8",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {t('contact.offices', 'Our Offices')}
          </h2>

          {/* Desktop: 3 maps in a row, Mobile: 1 map per row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {offices.map((office, index) => {
              const mapUrl = getMapConfig(office.type);
              
              return (
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
                    {mapUrl ? (
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${office.city} Office Location`}
                      />
                    ) : (
                      <div className={cn(
                        "w-full h-full flex items-center justify-center",
                        actualTheme === 'dark' ? "bg-gray-700" : "bg-gray-100"
                      )}>
                        <div className="text-center p-6">
                          <MapPin className={cn(
                            "mx-auto mb-4",
                            actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
                          )} size={48} />
                          <p className={cn(
                            "text-lg font-semibold mb-2",
                            actualTheme === 'dark' ? "text-white" : "text-gray-900"
                          )}>
                            {office.city}
                          </p>
                          <p className={cn(
                            "text-sm",
                            actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                          )}>
                            {office.address}
                          </p>
                          <p className={cn(
                            "text-xs mt-4",
                            actualTheme === 'dark' ? "text-gray-400" : "text-gray-500"
                          )}>
                            {!googleMapsApiKey && !isChina ? 'Google Maps API key not configured' : 'Map loading...'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

