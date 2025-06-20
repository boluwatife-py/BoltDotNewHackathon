import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./NoticeCard.css";
import "swiper/css";
import "swiper/css/pagination";

const noticeItems = [
  "FDA has recalled Supplement A due to contamination.",
  "Don't take Supplement B with grapefruit juice.",
  "Update: New version of Supplement C is available.",
];

const NoticeCard: React.FC = () => {
  return (
    <div className="pt-[var(--lg)] pb-[var(--md)]">
      <span className="block text-[14px] text-[var(--text-primary)]/80 font-medium font-family-[var(--font-primary)]">
        Notice
      </span>

      <div className="relative">
        {/* Notice Box */}
        <div className="h-[10.75rem] rounded-[12px] bg-[var(--accent-bg-yellow)] p-[var(--sm)]">
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
            spaceBetween={8}
            className="h-full"
          >
            {noticeItems.map((notice, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center h-full text-sm text-gray-800 text-center">
                  {notice}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination Position */}
        <div className="flex justify-center mt-1">
          <div className="notice-pagination swiper-pagination !static"></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
