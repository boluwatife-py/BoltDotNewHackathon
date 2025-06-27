import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./NoticeCard.css";
import "swiper/css";
import "swiper/css/pagination";

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
              delay: 5000,
              disableOnInteraction: false,
            }}
            spaceBetween={0}
            className="h-full"
          >
            <SwiperSlide>
              <div 
                className="relative h-full cursor-pointer group overflow-hidden"
                onClick={() => handleNoticeClick("https://bolt.new")}
              >
                <img 
                  src="/src/assets/images/banner1Bolt.svg" 
                  alt="SafeDoser Banner" 
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
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