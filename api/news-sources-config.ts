// 主流媒体列表 - 国内和海外
const MAINSTREAM_NEWS_SOURCES = {
  // 海外科技媒体
  overseas: [
    { name: 'TechCrunch', url: 'https://techcrunch.com/tag/artificial-intelligence/' },
    { name: 'The Verge', url: 'https://www.theverge.com/ai-artificial-intelligence' },
    { name: 'Wired', url: 'https://www.wired.com/tag/artificial-intelligence/' },
    { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/' },
    { name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org/artificial-intelligence' },
    { name: 'ZDNet', url: 'https://www.zdnet.com/topic/artificial-intelligence/' },
    { name: 'Ars Technica', url: 'https://arstechnica.com/tag/artificial-intelligence/' },
    { name: 'VentureBeat', url: 'https://venturebeat.com/ai/' },
    { name: 'AI Business', url: 'https://aibusiness.com' },
    { name: 'AI Magazine', url: 'https://aimagazine.com' },
    { name: 'a16z Blog', url: 'https://a16z.com/topic/artificial-intelligence/' },
    { name: 'Emerj AI Research', url: 'https://emerj.com' },
    { name: 'Datafloq', url: 'https://datafloq.com/artificial-intelligence/' },
    { name: 'Nature Machine Intelligence', url: 'https://www.nature.com/natmachintell' },
    { name: 'Neural', url: 'https://thenextweb.com/artificial-intelligence' }
  ],
  
  // 国内科技媒体
  domestic: [
    { name: '36氪', url: 'https://36kr.com/motif', wechat: true },
    { name: '机器之心', url: 'https://www.jiqizhixin.com', wechat: true },
    { name: '量子位', url: 'https://www.qbitai.com', wechat: true },
    { name: '极客公园', url: 'https://www.geekpark.net', wechat: true },
    { name: '极客邦科技', url: 'https://www.infoq.cn', wechat: true },
    { name: '虎嗅', url: 'https://www.huxiu.com', wechat: true },
    { name: '钛媒体', url: 'https://www.tmtpost.com', wechat: true },
    { name: '智东西', url: 'https://zhidx.com', wechat: true },
    { name: 'APPSO', url: 'https://www.ifanr.com', wechat: true },
    { name: '硅星人', url: 'https://guixingren.com', wechat: true },
    { name: 'AI科技大本营', url: 'https://mp.weixin.qq.com', wechat: true },
    { name: 'AI科技评论', url: 'https://www.leiphone.com', wechat: true },
    { name: '新智元', url: 'https://www.aiera.cn', wechat: true },
    { name: 'AI前线', url: 'https://www.infoq.cn', wechat: true },
    { name: '雷锋网', url: 'https://www.leiphone.com', wechat: true }
  ]
};

// 不同级别公司需要的故事数量
const STORIES_BY_TIER = {
  'tier1': 4,  // 顶级公司（4篇故事）
  'tier2': 3,  // 重要公司（3篇故事）
  'tier3': 2,  // 普通公司（2篇故事）
  'default': 2 // 默认（2篇故事）
};
