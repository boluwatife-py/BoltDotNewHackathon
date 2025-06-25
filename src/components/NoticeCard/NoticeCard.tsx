import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./NoticeCard.css";
import "swiper/css";
import "swiper/css/pagination";

const noticeItems = [
  {
    id: 1,
    title: "Built with Bolt.new",
    subtitle: "AI-Powered Development",
    description: "This app was created using Bolt.new - the fastest way to build full-stack web apps with AI assistance!",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://bolt.new",
    bgGradient: "from-[#08B5A6] via-[#066B65] to-[#044A46]",
    accentColor: "bg-[#08B5A6]",
    icon: "⚡"
  },
  {
    id: 2,
    title: "Powered by StackBlitz",
    subtitle: "Instant Development",
    description: "Experience lightning-fast development environments that run natively in your browser with zero setup time.",
    image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://stackblitz.com",
    bgGradient: "from-[#066B65] via-[#08B5A6] to-[#0A9B8A]",
    accentColor: "bg-[#066B65]",
    icon: "🚀"
  },
  {
    id: 3,
    title: "AI-First Development",
    subtitle: "Future of Coding",
    description: "Join thousands of developers building the future with AI-powered coding tools. Start your next project today!",
    image: "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://bolt.new",
    bgGradient: "from-[#0A9B8A] via-[#08B5A6] to-[#066B65]",
    accentColor: "bg-[#0A9B8A]",
    icon: "🤖"
  },
];

const NoticeCard: React.FC = () => {
  const handleNoticeClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-[var(--lg)] pb-[var(--md)]">
      <div className="flex items-center justify-between mb-3">
        <span className="block text-[14px] text-[var(--text-primary)]/80 font-medium font-family-[var(--font-primary)]">
          Notice
        </span>
      </div>

      <div className="relative">
        {/* Notice Box */}
        <div className="h-[14rem] rounded-[16px] overflow-hidden shadow-lg">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".notice-pagination",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={0}
            className="h-full"
          >
            {noticeItems.map((notice) => (
              <SwiperSlide key={notice.id}>
                <div 
                  className={`relative h-full bg-gradient-to-br ${notice.bgGradient} cursor-pointer group overflow-hidden`}
                  onClick={() => handleNoticeClick(notice.link)}
                >
                  {/* Subtle Pattern Overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="medical-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                          <circle cx="20" cy="20" r="2" fill="white" opacity="0.3"/>
                          <path d="M18 20h4M20 18v4" stroke="white" strokeWidth="1" opacity="0.2"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#medical-pattern)"/>
                    </svg>
                  </div>
                  
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full group-hover:opacity-75 transition-opacity duration-700"></div>
                    <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/15 rounded-full group-hover:opacity-75 transition-opacity duration-700"></div>
                    <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full group-hover:opacity-75 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Subtle Background Image with Medical Theme */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-8 group-hover:opacity-12 transition-opacity duration-300"
                    style={{ 
                      backgroundImage: `url(https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=600)`,
                      filter: 'blur(1px)'
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full p-5 flex flex-col justify-between text-white">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl filter drop-shadow-sm">{notice.icon}</span>
                          <span className="text-xs font-medium bg-white/25 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                            {notice.subtitle}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 transition-all duration-300 filter drop-shadow-sm">
                          {notice.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="flex-1 flex items-center">
                      <p className="text-sm leading-relaxed opacity-95 group-hover:opacity-100 transition-opacity duration-300 filter drop-shadow-sm">
                        {notice.description}
                      </p>
                    </div>
                    
                    {/* Call to Action */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse filter drop-shadow-sm"></div>
                        <span className="text-xs font-medium opacity-90 filter drop-shadow-sm">
                          Click to learn more
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/35 transition-all duration-300 border border-white/20">
                          <svg 
                            className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-300 filter drop-shadow-sm" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Click Ripple Effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity duration-150 pointer-events-none"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex justify-center mt-4">
          <div className="notice-pagination swiper-pagination !static px-3 py-2"></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;