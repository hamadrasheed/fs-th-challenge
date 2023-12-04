import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper";
import TabContent from "./TabContent";
import Overlay from "./Overlay";
import { FaClock, FaEdit } from "react-icons/fa";
import { setDateFormat } from "../../helpers/DateHelper";
import { wordLimit } from "../../utils/Utils";
import { BsNewspaper } from "react-icons/bs";
import { AUTH3_IMG } from "../../vars/assets";
import { Link } from "react-router-dom";

const Hero = ({ data }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const progressContent = useRef(null);
  const indexMarker = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressContent?.current?.style)
      progressContent.current.style.width = 100 * (1 - progress) + "%";
  };

  const slideChange = ({ activeIndex }) => {
    if (indexMarker?.current?.style)
      indexMarker.current.style.marginLeft = `${activeIndex * 25}%`;
  };

  const linkTo = (e) => {
    e.preventDefault();
    let id = e.target.getAttribute("href").toString();

    if (id.includes("/")) id = id.slice(1);

    // escape when not have #
    if (!id.includes("#")) return;

    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="relative top-[-101px] w-full h-full flex justify-center">
      <Swiper
        onSlideChange={slideChange}
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
          height: "100vh",
        }}
        rewind={true}
        spaceBetween={0}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper2"
      >
        {data &&
          data.map((e) => (
            <SwiperSlide key={`${e.id}-content`}>
              <Overlay src={e.url_to_image ? e.url_to_image : AUTH3_IMG()}>
                <div className="flex flex-col gap-y-2 text-left pt-48 md:pt-40">
                  <h3 className="flex gap-x-2 items-center text-sm md:text-lg font-semibold">
                    <FaClock className="w-4 h-4 flex-none text-slate-400" />
                    {setDateFormat({
                      date: e.published_at,
                      withTime: true,
                      withWeekDay: true,
                    })}
                  </h3>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-primary-50">
                    {e.title}
                  </h1>
                  <div className="bg-secondary-800/70 py-2 px-3 tracking-wide relative w-fit">
                    <h2 className="w-full text-sm md:text-lg font-semibold">
                      {e.description}
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-y-1 pt-2 pb-6 font-light text-sm md:text-base">
                    <li className="flex gap-x-2 items-center">
                      <FaEdit className="w-3 h-3 flex-none text-slate-400" />
                      <div className="flex gap-x-1">
                        by
                        <span className="font-medium">
                          {e.author_name ? e.author_name : "Anonymous"}
                        </span>
                      </div>
                    </li>
                    <li className="flex gap-x-2 items-center">
                      <BsNewspaper className="w-3 h-3 flex-none text-slate-400" />
                      <div className="flex gap-x-1">
                        from
                        <a
                          href={e.source_url}
                          target="_blank"
                          className="font-medium text-primary-50 transition-all hover:text-primary-500 duration-300"
                        >
                          {e.source_name ? e.source_name : "Anonymous"}
                        </a>
                      </div>
                    </li>
                  </ul>
                  <Link
                    to={`/news/${e.category_code}/${e.permalink}`}
                    className="w-32 md:w-48 uppercase p-2 md:p-3 text-sm md:text-lg text-center font-bold rounded-full hover-box-shadow transition-all ease-in-out duration-300 hover:scale-x-105 text-white bg-primary-200 hover:bg-primary-200/70"
                  >
                    Read More
                  </Link>
                </div>
              </Overlay>
            </SwiperSlide>
          ))}

        {/* progress line top*/}
        <div
          ref={progressContent}
          className="absolute top-0 z-[1] w-1/2 h-1 rounded-xl bg-primary-200/40"
        ></div>
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="container !mx-auto mySwiper !hidden xl:!block"
      >
        {data &&
          data.map((e, i) => (
            <SwiperSlide key={`${e.id}-pagination`}>
              <TabContent
                number={i + 1}
                title={
                  e.title.length > 15 ? `${wordLimit(e.title, 15)}...` : e.title
                }
                subtitle={`${e.category_name}, ${e.source_name}`}
              />
            </SwiperSlide>
          ))}

        {/* current mark line*/}
        <div
          slot="container-start"
          className="relative w-full h-1.5 bg-primary-200/40 rounded-full mb-2"
        >
          <div
            ref={indexMarker}
            className="bg-primary-200 relative w-1/4 h-1.5 rounded-full transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </Swiper>
    </div>
  );
};

export default Hero;
