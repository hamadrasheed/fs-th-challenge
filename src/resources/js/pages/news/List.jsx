import React, { useEffect, useMemo, useState } from "react";
import dataStore from "../../store/dataStore";
import { titleScroller } from "../../utils/Utils";
import Extend from "../../components/layouts/Extend";
import EmptyState from "../../components/others/EmptyState";
import LoadingForm from "../../components/LoadingForm";
import { useNavigate } from "react-router-dom";
import loadingStore from "../../store/loadingStore";
import multiSelectStore from "../../store/multiSelectStore";
import { L_DATA, L_S_CATEGORY, L_S_SOURCE } from "../../vars/loading";
import Overlay1 from "../../components/overlays/Overlay1";
import CardContent from "../../components/card/CardContent";
import DefaultAction from "../../action/DefaultAction";
import { AUTH3_IMG } from "../../vars/assets";
import PageTitle from "../../components/layouts/partials/PageTitle";
import DropdownLimit from "../../components/dropdown/DropdownLimit";
import Datepicker from "../../components/form/Datepicker";
import Pagination from "../../components/button/Pagination";
import SearchForm from "../../components/form/SearchForm";
import { setDateFormat } from "../../helpers/DateHelper";
import { W_NEWS } from "../../vars/web";
import { DATA_PARAMS, KEY_PARAMS } from "../../vars/types";
import { LIMIT_DEFAULT } from "../../vars/limit";
import { objToParams } from "../../helpers/UrlHelper";
import { objChanger } from "../../helpers/ObjHelper";
import { A_NEWS_LIST, A_U_CATEGORY, A_U_SOURCE } from "../../vars/api";
import paramsStore from "../../store/paramsStore";
import { BsGridFill } from "react-icons/bs";
import classNames from "classnames";
import Tooltip from "../../components/Tooltip";
import { FaThList } from "react-icons/fa";
import SelectAsync from "../../components/form/SelectAsync";
import { useForm } from "react-hook-form";

export default function List() {
  const [updateLock] = useState("News List");

  const { params, resetParams } = paramsStore((state) => state);
  const navigate = useNavigate();

  const { getData, selectData } = DefaultAction();

  const {
    setLock,
    lock,
    data,
    details: getDetails,
    setDetail,
    isNotFound,
    setRequestDataToggle,
  } = dataStore((state) => state);

  const { resetSelected, selected: ids } = multiSelectStore((state) => state);

  const { loading: getLoading } = loadingStore((state) => state);
  const loading = useMemo(() => getLoading[L_DATA], [getLoading]);

  const [gridView, setGridView] = useState(false);

  const [tempParams, setTempParams] = useState(null);
  const [goNavigate, setGoNavigate] = useState(null);
  const [fireNavigate, setFireNavigate] = useState(false);

  const paramsEvent = (key, value) => {
    const path = window.location.pathname;

    if (value != params[key]) {
      setFireNavigate(true);
      setGoNavigate(
        path +
          objToParams({
            ...objChanger(params, {
              except: [key, "page"],
            }),
            [key]: value,
          })
      );
    }
  };

  const paramsMultiEvent = (e = {}) => {
    const path = window.location.pathname;
    const search = objToParams({
      ...objChanger(params, {
        except: ["only_active", "page"],
      }),
      ...e,
    });

    if (!search) return setRequestDataToggle(true);

    if (tempParams != search) {
      setTempParams(search);
      setFireNavigate(true);
      setGoNavigate(path + search);
    }
  };

  const edit = useMemo(
    () => Object.keys(params).filter((e) => KEY_PARAMS.includes(e)).length,
    [params]
  );

  useEffect(() => {
    if (goNavigate && fireNavigate) {
      resetSelected();
      navigate(goNavigate);
    }
  }, [goNavigate]);

  useEffect(() => {
    setLock(updateLock);
  }, []);

  useEffect(() => titleScroller("News List"), []);

  useEffect(() => {
    const res = objChanger(params, { only: DATA_PARAMS });
    const check = objToParams(res);

    if (
      !params.id &&
      lock == updateLock &&
      check !== tempParams &&
      !edit &&
      !isNotFound
    ) {
      getData(A_NEWS_LIST, res);
      setTempParams(check);
    }
  }, [params, lock, tempParams]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  const updateValue = (name, value, isSelected = false) => {
    setValue(name, isSelected ? value?.value : value);
    navigate(
      W_NEWS +
        objToParams({
          ...params,
          [name]: value?.value ?? value ?? undefined,
        })
    );
  };

  return (
    <Extend isSlate={true}>
      {/* page title */}
      <PageTitle
        title="News List"
        links={[{ name: "Home", url: "/" }, { name: "News" }]}
        imageUrl="/images/page-title/news.jpg"
      />

      <main className="relative w-full text-slate-800">
        <section className="relative w-full bg-slate-100 mb-28">
          {/* overlay */}
          <Overlay1 />

          <div className="relative container mx-auto">
            {/* head title*/}
            <div className="pb-8 text-center">
              <h2 className="uppercase text-3xl md:text-5xl font-['Helvetica'] font-bold pb-4">
                Seach <span className="text-primary-200 uppercase">News</span>
              </h2>
              <h4 className="w-fit mx-auto md:text-xl">
                Stay Informed and Empowered with the Latest News
              </h4>
            </div>

            <div className="w-full grid md:grid-cols-2 justify-between items-center gap-2">
              <div className="flex gap-2 justify-start">
                <button
                  onClick={() => setGridView(!gridView)}
                  className="btn group bg-white dark:bg-navy-700 border-slate-200 dark:border-navy-500 text-slate-500 dark:text-navy-100 hover:border-primary-50 hover:text-primary-50 dark:hover:border-primary-50 dark:hover:text-primary-50"
                >
                  <span className="sr-only">View</span>
                  <wbr />
                  <Tooltip content={gridView ? "List View" : "Grid View"}>
                    {gridView ? (
                      <FaThList className="w-4 h-4 flex-none" />
                    ) : (
                      <BsGridFill className="w-4 h-4 flex-none" />
                    )}
                  </Tooltip>
                </button>
                <SearchForm
                  defaultValue={params.q}
                  placeholder="News Title / Content&hellip;"
                  onChange={(value) => paramsEvent("q", value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Datepicker
                  onChange={(e) => {
                    paramsMultiEvent({
                      start_date_range: e[0],
                      end_date_range: e[1],
                    });
                  }}
                  data={{
                    dateStart: params.start_date_range ?? null,
                    dateEnd: params.end_date_range ?? null,
                  }}
                />
                <DropdownLimit
                  options={LIMIT_DEFAULT}
                  defaultValue={params.limit ?? 10}
                  onChange={(value) => paramsEvent("limit", value)}
                  classMinWidth="min-w-[8rem]"
                />
              </div>

              <div className="flex justify-start">
                <SelectAsync
                  setClass="no-padding min-w-[26.6rem] max-w-[604px]"
                  defaultValueMulti={
                    params.category &&
                    params.category.split(",").map((e) => ({
                      label: e,
                      value: e,
                    }))
                  }
                  placeholder="-- Select Categories --"
                  name="category"
                  isMulti={true}
                  preventLabel={true}
                  isClearable={true}
                  register={register}
                  isLoading={getLoading[L_S_CATEGORY]}
                  loadAPI={(search, cb) =>
                    selectData({
                      path: A_U_CATEGORY,
                      search,
                      loadingVar: L_S_CATEGORY,
                      cb,
                    })
                  }
                  setValueMulti={(e) => setValue("category", e)}
                  onChange={(e) => {
                    updateValue(
                      "category",
                      e.map((v) => v.value).join(","),
                      true
                    );
                  }}
                />
              </div>

              <div className="flex justify-end">
                <SelectAsync
                  setClass="no-padding min-w-[26.6rem] max-w-[604px]"
                  defaultValueMulti={
                    params.source &&
                    params.source.split(",").map((e) => ({
                      label: e,
                      value: e,
                    }))
                  }
                  placeholder="-- Select Sources --"
                  name="source"
                  isMulti={true}
                  preventLabel={true}
                  isClearable={true}
                  register={register}
                  isLoading={getLoading[L_S_SOURCE]}
                  loadAPI={(search, cb) =>
                    selectData({
                      path: A_U_SOURCE,
                      search,
                      loadingVar: L_S_SOURCE,
                      cb,
                    })
                  }
                  setValueMulti={(e) => setValue("source", e)}
                  onChange={(e) => {
                    updateValue(
                      "source",
                      e.map((v) => v.value).join(","),
                      true
                    );
                  }}
                />
              </div>
            </div>

            {/* content */}
            {loading && <LoadingForm />}
            {data.length ? (
              <>
                <div
                  className={classNames("w-full grid gap-6 py-4", {
                    "xl:grid-cols-2": gridView,
                    "grid-cols-1": !gridView,
                  })}
                >
                  {!loading &&
                    data.map((v) => (
                      <CardContent
                        key={`${v.id}-news`}
                        image={v.url_to_image ? v.url_to_image : AUTH3_IMG()}
                        title={v.title}
                        subtitle={v.description}
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
                <div className="mt-8">
                  <Pagination
                    loading={loading}
                    updatePage={(page) => {
                      setFireNavigate(true);
                      paramsEvent("page", page);
                    }}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                message={`There's no any News found!`}
                addClass={"text-center"}
                htmlFor="action-search"
                noBg={false}
              >
                <div className="flex justify-center mb-8">
                  <button
                    onClick={(e) => e}
                      className="w-36 md:w-48 text-sm md:text-lg uppercase p-2 md:p-3 text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white bg-primary-400 hover:bg-primary-400/70"
                  >
                    Sync News
                  </button>
                </div>
              </EmptyState>
            )}
          </div>
        </section>
      </main>
    </Extend>
  );
}
