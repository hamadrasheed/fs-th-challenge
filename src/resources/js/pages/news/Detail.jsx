import React, { useEffect, useMemo, useState } from "react";
import dataStore from "../../store/dataStore";
import { titleScroller } from "../../utils/Utils";
import Extend from "../../components/layouts/Extend";
import LoadingForm from "../../components/LoadingForm";
import { Link, useParams } from "react-router-dom";
import loadingStore from "../../store/loadingStore";
import { L_DATA, L_DETAIL } from "../../vars/loading";
import authStore from "../../store/authStore";
import Overlay1 from "../../components/overlays/Overlay1";
import DefaultAction from "../../action/DefaultAction";
import { A_NEWS_DETAIL, A_NEWS_PREFERED_FEEDS } from "../../vars/api";
import { AUTH3_IMG, AUTH4_IMG } from "../../vars/assets";
import PageTitle from "../../components/layouts/partials/PageTitle";
import { setDateFormat } from "../../helpers/DateHelper";
import { FORM_NEWS_DETAIL } from "../../vars/formName";
import { W_NEWS } from "../../vars/web";
import { FaClock } from "react-icons/fa";
import EmptyState from "../../components/others/EmptyState";

export default function Detail() {
  const [updateLock] = useState("detail");
  const { detailData, getFeedsData } = DefaultAction();
  const {
    details: getDetails,
    feedsData,
    setLock,
    lock,
  } = dataStore((state) => state);

  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_DETAIL], [getLoading]);
  const loadingFeeds = useMemo(() => getLoading[L_DATA], [getLoading]);
  const { permalink } = useParams();

  const details = useMemo(
    () => getDetails[FORM_NEWS_DETAIL] ?? {},
    [getDetails]
  );

  // init
  useEffect(() => {
    setLock(updateLock);
    detailData({
      formName: FORM_NEWS_DETAIL,
      path: A_NEWS_DETAIL,
      id: permalink,
    });
  }, []);

  useEffect(() => {
    if (!loading)
      getFeedsData(
        A_NEWS_PREFERED_FEEDS,
        { category: details.code },
        {},
        false
      );
  }, [loading]);

  useEffect(() => titleScroller("News Detail"), []);

  return (
    <Extend isSlate={true}>
      {/* page title */}
      <PageTitle
        title="News Detail"
        links={[
          { name: "Home", url: "/" },
          { name: "News", url: W_NEWS },
          {
            name: details.category_name,
            url: `/news?category=${details.category_code}`,
          },
          { name: "Detail" },
        ]}
        imageUrl={AUTH4_IMG()}
      />

      <main className="relative w-full text-slate-800">
        <section className="relative w-full bg-slate-100 mb-28">
          {/* overlay */}
          <Overlay1 />

          <div className="relative container mx-auto md:flex gap-24">
            {loading ? (
              <LoadingForm />
            ) : (
              <>
                <div className="w-full md:w-2/3">
                  <h3 className="flex gap-x-2 pb-2 items-center text-sm md:text-base text-slate-500 font-semibold">
                    <FaClock className="w-4 h-4 flex-none" />
                    {setDateFormat({
                      date: details.published_at,
                      withTime: true,
                      withWeekDay: true,
                    })}
                  </h3>
                  <h1 className="uppercase text-3xl md:text-5xl font-['Helvetica'] font-bold pb-4">
                    <span className="text-primary-200 uppercase">
                      {details.title}
                    </span>
                  </h1>
                  <img
                    src={
                      details.url_to_image ? details.url_to_image : AUTH3_IMG()
                    }
                    className="w-full mb-4"
                  />
                  <h2 className="border-l-[6px] md:border-l-8 border-primary-100 pl-2 text-xl md:text-3xl mb-8">
                    {details.description}
                  </h2>
                  <h3 className="md:text-xl font-semibold">
                    by {details.author_name ? details.author_name : "Anonymous"}
                  </h3>
                  <h4 className="text-sm md:text-lg mb-3 transition-all hover:text-primary-200 duration-300">
                    <a href={details.source_url} target="_blank">
                      {details.source_name}
                    </a>
                  </h4>
                  <div className="bg-slate-400/50 w-10 h-[0.2rem] md:h-1 mb-8"></div>
                  <p className="text-xl md:text-3xl mb-12">{details.content}</p>
                  <a
                    href={details.url}
                    target="_blank"
                    className="uppercase py-3 px-5 text-sm md:text-base rounded-full hover-box-shadow font-medium transition-all duration-300 text-white bg-primary-200 hover:bg-primary-200/70"
                  >
                    Read Origin News
                  </a>
                </div>
                <div className="w-full mt-20 md:mt-0 md:w-1/3">
                  <h2 className="text-xl md:text-3xl mb-3 font-medium">
                    Related News
                  </h2>
                  <div className="bg-slate-400/50 w-20 h-[0.2rem] md:h-1 mb-4"></div>

                  {loadingFeeds && <LoadingForm />}

                  {feedsData[details.category_code] &&
                  feedsData[details.category_code].length ? (
                    <div className="grid md:grid-cols-1 gap-6 py-4">
                      {!loadingFeeds &&
                        feedsData[details.category_code].map((v) => (
                          <Link
                            to={`/news/${v.category_code}/${v.permalink}`}
                            key={`${v.id}-related-news`}
                            onClick={() =>
                              detailData({
                                formName: FORM_NEWS_DETAIL,
                                path: A_NEWS_DETAIL,
                                id: v.permalink,
                              })
                            }
                          >
                            <div className="flex flex-col items-center justify-center w-full relative shadow-md hover-box-shadow group hover:scale-105 transition-all duration-300 ease-in-out">
                              <img
                                className="grayscale w-full group-hover:grayscale-0"
                                src={
                                  v.url_to_image ? v.url_to_image : AUTH3_IMG()
                                }
                                alt="News"
                              />
                              <div className="flex flex-col gap-y-2 p-4 bg-slate-200/60 w-full relative">
                                <h2 className="uppercase font-['Helvetica'] font-medium">
                                  {v.title}
                                </h2>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <EmptyState
                      message={`There's no any Related News found!`}
                      addClass={"text-center"}
                      htmlFor="action-search"
                      noBg={false}
                    >
                      <div className="flex justify-center mb-8">
                        <Link
                          to={W_NEWS}
                          className="w-36 md:w-48 text-sm md:text-lg uppercase p-2 md:p-3 text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white bg-primary-400 hover:bg-primary-400/70"
                        >
                          Search More
                        </Link>
                      </div>
                    </EmptyState>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </Extend>
  );
}
