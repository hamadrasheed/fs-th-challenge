import React, { useEffect, useMemo, useState } from "react";
import dataStore from "../../store/dataStore";
import { titleScroller, wordLimit } from "../../utils/Utils";
import Extend from "../../components/layouts/Extend";
import Hero from "../../components/hero/Hero";
import EmptyState from "../../components/others/EmptyState";
import LoadingForm from "../../components/LoadingForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loadingStore from "../../store/loadingStore";
import { L_CHECK, L_DATA } from "../../vars/loading";
import authStore from "../../store/authStore";
import paramsStore from "../../store/paramsStore";
import Preloader from "../../components/others/Preloader";
import Overlay1 from "../../components/overlays/Overlay1";
import CardContent from "../../components/card/CardContent";
import DefaultAction from "../../action/DefaultAction";
import {
  A_NEWS_FEEDS,
  A_NEWS_HERO,
  A_NEWS_PREFERED_FEEDS,
} from "../../vars/api";
import { AUTH3_IMG } from "../../vars/assets";
import { setDateFormat } from "../../helpers/DateHelper";
import { W_NEWS } from "../../vars/web";

export default function Home() {
  const [updateLock] = useState("home");
  const { getHeroData, getFeedsData } = DefaultAction();
  const { heroData, feedsData, menuData, setLock, lock } = dataStore(
    (state) => state
  );

  const location = useLocation();
  const { pathname, search } = location;

  const navigate = useNavigate();

  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_CHECK], [getLoading]);
  const loadingFeeds = useMemo(() => getLoading[L_DATA], [getLoading]);

  const { token } = authStore((state) => state);
  const { setParams } = paramsStore((state) => state);

  const [moreTime, setMoreTime] = useState(true);

  // init
  useEffect(() => {
    setLock(updateLock);
  }, []);

  useEffect(() => titleScroller(), []);

  // params trigger
  useEffect(() => {
    if (search.includes("=")) setParams(searchParamsToObj(search));
  }, [search]);

  useEffect(() => {
    if (loading) {
      setMoreTime(true);
    }
  }, [loading]);

  useEffect(() => {
    let timeout;
    if (moreTime) {
      timeout = setTimeout(() => setMoreTime(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [moreTime]);

  useEffect(() => {
    if (!loading) {
      const check = pathname.includes("news");

      if (check && !token) navigate("/signin", { replace: true });

      if (!check && !token) navigate("/", { replace: true });
    }
  }, [loading, token, pathname]);

  useEffect(() => {
    getHeroData(A_NEWS_HERO, {}, {}, false);
  }, []);

  useEffect(() => {
    getFeedsData(token ? A_NEWS_PREFERED_FEEDS : A_NEWS_FEEDS, {}, {}, false);
  }, [token]);

  return loading || moreTime ? (
    <Preloader />
  ) : (
    <Extend isSlate={true}>
      {/* hero */}
      <Hero data={heroData} />
      {/* feeds */}
      <main className="relative w-full text-slate-800">
        {menuData.map((e, i) => (
          <section
            key={`${e.code}-cat`}
            className="relative w-full bg-slate-100 mb-28"
          >
            {/* overlay */}
            <Overlay1 />

            <div className="relative container mx-auto">
              {/* head title*/}
              <div className="pb-8 text-center">
                <h2 className="uppercase text-3xl md:text-5xl font-['Helvetica'] font-bold pb-4">
                  <span className="text-primary-200">{e.name}</span> News
                </h2>
                <h4 className="w-fit mx-auto md:text-xl">
                  Stay Informed and Empowered with the Latest {e.name} News
                </h4>
              </div>

              {/* content */}
              {loadingFeeds && <LoadingForm />}
              {feedsData[e.code] && feedsData[e.code].length ? (
                <div className="grid xl:grid-cols-2 gap-6 py-4">
                  {!loadingFeeds &&
                    feedsData[e.code].map((v) => (
                      <CardContent
                        key={`${v.id}-news`}
                        image={v.url_to_image ? v.url_to_image : AUTH3_IMG()}
                        title={v.title}
                        subtitle={
                          v.description.length > 80
                            ? `${wordLimit(v.description, 80)}...`
                            : v.description
                        }
                        url={`/news/${v.category_code}/${v.permalink}`}
                        date={setDateFormat({
                          date: v.published_at,
                          withTime: true,
                          withWeekDay: true,
                        })}
                        sourceName={v.source_name}
                        sourceUrl={v.source_url}
                      />
                    ))}
                </div>
              ) : (
                <EmptyState
                  message={`There's no any ${e.name} News found!`}
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
          </section>
        ))}
      </main>
    </Extend>
  );
}
