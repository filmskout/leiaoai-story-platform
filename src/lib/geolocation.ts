// IP geolocation detection and platform selection utilities

interface GeolocationInfo {
  country: string;
  countryCode: string;
  isChina: boolean;
}

interface Platform {
  name: string;
  icon: string;
  action: (url: string, title: string) => void;
  color: string;
}

// Cache for geolocation to avoid repeated API calls
let cachedLocation: GeolocationInfo | null = null;

// Get user's location (simplified version - in production, use a proper geolocation service)
export async function getUserLocation(): Promise<GeolocationInfo> {
  if (cachedLocation) {
    return cachedLocation;
  }

  try {
    // For demo purposes, we'll use a simple approach
    // In production, you'd use a proper IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const location: GeolocationInfo = {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      isChina: data.country_code === 'CN'
    };
    
    cachedLocation = location;
    return location;
  } catch (error) {
    console.warn('Failed to detect location, defaulting to international:', error);
    // Default to international if detection fails
    const defaultLocation: GeolocationInfo = {
      country: 'Unknown',
      countryCode: 'XX',
      isChina: false
    };
    cachedLocation = defaultLocation;
    return defaultLocation;
  }
}

// Chinese social platforms
const chinesePlatforms: Platform[] = [
  {
    name: '微信',
    icon: 'W',
    color: '#07C160',
    action: (url: string, title: string) => {
      // WeChat sharing - typically done through WeChat JS SDK
      // For now, copy to clipboard with instructions
      navigator.clipboard.writeText(`${title} ${url}`);
      alert('链接已复制，请在微信中分享');
    }
  },
  {
    name: 'QQ空间',
    icon: 'Q',
    color: '#12B7F5',
    action: (url: string, title: string) => {
      const qqUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      window.open(qqUrl, '_blank');
    }
  },
  {
    name: '微博',
    icon: '微',
    color: '#FF8200',
    action: (url: string, title: string) => {
      const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      window.open(weiboUrl, '_blank');
    }
  },
  {
    name: '抖音',
    icon: '抖',
    color: '#000000',
    action: (url: string, title: string) => {
      // TikTok/Douyin sharing is typically done through their SDK
      navigator.clipboard.writeText(`${title} ${url}`);
      alert('链接已复制，请在抖音中分享');
    }
  },
  {
    name: '小红书',
    icon: '小',
    color: '#FF2442',
    action: (url: string, title: string) => {
      navigator.clipboard.writeText(`${title} ${url}`);
      alert('链接已复制，请在小红书中分享');
    }
  },
  {
    name: '快手',
    icon: '快',
    color: '#FF6A00',
    action: (url: string, title: string) => {
      navigator.clipboard.writeText(`${title} ${url}`);
      alert('链接已复制，请在快手中分享');
    }
  }
];

// International social platforms
const internationalPlatforms: Platform[] = [
  {
    name: 'Facebook',
    icon: 'f',
    color: '#1877F2',
    action: (url: string, title: string) => {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, '_blank');
    }
  },
  {
    name: 'Twitter/X',
    icon: '𝕏',
    color: '#000000',
    action: (url: string, title: string) => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
  },
  {
    name: 'LinkedIn',
    icon: 'in',
    color: '#0A66C2',
    action: (url: string, title: string) => {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedinUrl, '_blank');
    }
  },
  {
    name: 'WhatsApp',
    icon: 'W',
    color: '#25D366',
    action: (url: string, title: string) => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  },
  {
    name: 'Telegram',
    icon: 'T',
    color: '#0088CC',
    action: (url: string, title: string) => {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(telegramUrl, '_blank');
    }
  },
  {
    name: 'Reddit',
    icon: 'R',
    color: '#FF4500',
    action: (url: string, title: string) => {
      const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      window.open(redditUrl, '_blank');
    }
  }
];

// Universal sharing options
const universalPlatforms: Platform[] = [
  {
    name: 'Copy Link',
    icon: '📋',
    color: '#6B7280',
    action: async (url: string, title: string) => {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      }
    }
  },
  {
    name: 'Email',
    icon: '✉',
    color: '#4F46E5',
    action: (url: string, title: string) => {
      const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this story: ${title}\n\n${url}`)}`;
      window.location.href = emailUrl;
    }
  }
];

// Get platforms based on user location
export async function getAvailablePlatforms(): Promise<Platform[]> {
  const location = await getUserLocation();
  
  if (location.isChina) {
    return [...chinesePlatforms, ...universalPlatforms];
  } else {
    return [...internationalPlatforms, ...universalPlatforms];
  }
}

// Add native sharing if available
export function addNativeSharing(platforms: Platform[], url: string, title: string): Platform[] {
  if (navigator.share) {
    const nativeShare: Platform = {
      name: 'Share',
      icon: '↗',
      color: '#10B981',
      action: async (url: string, title: string) => {
        try {
          await navigator.share({
            title,
            url
          });
        } catch (error) {
          console.warn('Native sharing failed:', error);
        }
      }
    };
    return [nativeShare, ...platforms];
  }
  return platforms;
}

export type { Platform, GeolocationInfo };
