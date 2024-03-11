"use client";
import React, { useEffect, useState } from "react";
import CasesCard from "@/components/CasesCard";
import { ICases } from "@/types";
import fetchCases from "@/apiHelper/fetchCases";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@/components/Breadcrumbs";
import { addNotification } from "@/stores/reducers/notificationReducer";
import { useDispatch } from "react-redux";
const Cases = () => {
  const dispatch = useDispatch();
  const [cases, setCases] = useState<ICases[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAllCases = async () => {
    try {
      setLoading(true);
      const apiResult = await fetchCases({
        page: page,
        limit: limit,
      });

      if (apiResult.success === true) {
        setTotalItems(apiResult.data.pagination.total);
        const allCases = apiResult.data?.allCases;

        if (allCases && allCases.length > 0) {
          setCases(allCases);
          setLoading(false);
        } else {
          dispatch(
            addNotification({
              id: new Date().valueOf(),
              severity: "error",
              message: "Failed to fetch data",
              open: true,
            })
          );
        }
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            severity: "error",
            message: "Failed to fetch data",
            open: true,
          })
        );
      }
    }
  };

  useEffect(() => {
    fetchAllCases();
  }, [page, limit]);
  return (
    <div>
      <div className="h-[20vh] bg-brand_bggray pt-16 text-center ">
        <div className="text-[11px] uppercase">
          <Breadcrumbs />
        </div>
        <p className="text-3xl pt-3 font-bold">Cases</p>
      </div>
      <div className=" hidden md:block">
        <img className="w-full" src="/assets/images/layer2.png" />
      </div>
      <div className="px-10 lg:px-20 pt-10">
        <div>
          <p className="text-3xl font-semibold">
            Learn more about case we&apos;ve worked on
          </p>
          <p className="text-sm text-brand_text pt-4">
          Welcome to our case studies page.Transparency has been core of our
            business. We proudly present the real success stories of our
            clients, allowing you to make informed judgments. Examine these case
            studies to gain valuable insights into our proven strategies and
            envision the possibilities for your own business success. From
            increased brand visibility to enhanced conversions, these stories
            highlight the transformative impact of our strategic approaches.
          </p>
        </div>
      </div>
      <div className="py-10">
        {loading ? (
              <div className="flex justify-center items-center min-h-screen w-full">
                <div className="text-blue-500 ">
                  <CircularProgress color="inherit" size={20} />
                </div>
              </div>
            ) : !cases || cases.length < 1 ? (
              <p className=" h-screen justify-center items-center">No Cases Found</p>
            ) : (
          cases &&
          cases.map((item) => <CasesCard key={item?._id} item={item} refresh={()=> fetchAllCases()} />)
        )}
      </div>
      <div className="flex justify-center pb-20">
        <Pagination
          count={Math.ceil(totalItems / limit)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default Cases;
