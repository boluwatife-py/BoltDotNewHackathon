import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./NoticeCard.css";
import "swiper/css";
import "swiper/css/pagination";

const noticeItems = [
  {
    id: 1,
    title: "Built with Bolt.new ⚡",
    description: "This app was created using Bolt.new - the fastest way to build full-stack web apps with AI!",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "https://bolt.new",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    textColor: "text-blue-900"
  },
  {
    id: 2,
    title: "Powered by StackBlitz 🚀",
    description: "Experience instant development environments in your browser with StackBlitz - the online IDE that runs natively in your browser.",
    image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "https://stackblitz.com",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
    textColor: "text-purple-900"
  },
  {
    id: 3,
    title: "AI-First Development 🤖",
    description: "Join thousands of developers building the future with AI-powered coding tools. Start your next project with Bolt.new today!",
    image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "https://bolt.new",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
    textColor: "text-green-900"
  },
];

const NoticeCard: React.FC = () => {
  const handleNoticeClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-[var(--lg)] pb-[var(--md)]">
      <span className="block text-[14px] text-[var(--text-primary)]/80 font-medium font-family-[var(--font-primary)]">
        Notice
      </span>

      <div className="relative">
        {/* Notice Box */}
        <div className="h-[12rem] rounded-[12px] overflow-hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".notice-pagination",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            spaceBetween={0}
            className="h-full"
          >
            {noticeItems.map((notice) => (
              <SwiperSlide key={notice.id}>
                <div 
                  className={`relative h-full ${notice.bgColor} cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]`}
                  onClick={() => handleNoticeClick(notice.link)}
                >
                  {/* Background Image with Overlay */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${notice.image})` }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className={`text-lg font-bold mb-2 ${notice.textColor}`}>
                        {notice.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${notice.textColor} opacity-90`}>
                        {notice.description}
                      </p>
                    </div>
                    
                    {/* Call to Action */}
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-xs font-medium ${notice.textColor} opacity-75`}>
                        Tap to learn more
                      </span>
                      <div className={`w-8 h-8 rounded-full ${notice.textColor.replace('text-', 'bg-')} bg-opacity-20 flex items-center justify-center`}>
                        <svg 
                          className={`w-4 h-4 ${notice.textColor}`} 
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination Position */}
        <div className="flex justify-center mt-3">
          <div className="notice-pagination swiper-pagination !static"></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;