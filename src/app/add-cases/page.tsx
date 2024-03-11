"use client";
import AddCases from "@/apiHelper/addCases";
import { addNotification } from "@/stores/reducers/notificationReducer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

const Cases = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.general.user);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [main_service, setMainService] = useState("");
  const [extra_service, setExtraService] = useState("");
  const [return_on_investment, setReturnOnInvestment] = useState("");
  const [description, setDescription] = useState("");
  const [cover_image, setCoverImage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await AddCases({
      title: title,
      year: year,
      timeframe: timeframe,
      main_service: main_service,
      extra_service: extra_service,
      return_on_investment: return_on_investment,
      description: description,
      cover_image: cover_image,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Cases added successfully",
          open: true,
          severity: "success",
        })
      );
      setLoading(false);
      setTitle("");
      setYear("");
      setTimeframe("");
      setMainService("");
      setExtraService("");
      setReturnOnInvestment("");
      setDescription("");
      setCoverImage("");
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Form submission failed",
          open: true,
          severity: "error",
        })
      );
      setLoading(false);
    }
  };

  return (
    <div id="add-cases" className="px-10 lg:px-20 p-4">
      <div className="pt-3">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="pt-3">
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-700"
        >
          Year
        </label>
        <input
          type="text"
          name="year"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="pt-3">
        <label
          htmlFor="timeframe"
          className="block text-sm font-medium text-gray-700"
        >
          Timeframe
        </label>
        <input
          type="text"
          name="timeframe"
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="pt-3">
        <label
          htmlFor="main_service"
          className="block text-sm font-medium text-gray-700"
        >
          Main Service
        </label>
        <input
          type="text"
          name="main_service"
          id="main_service"
          value={main_service}
          onChange={(e) => setMainService(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="pt-3">
        <label
          htmlFor="extra_service"
          className="block text-sm font-medium text-gray-700"
        >
          Extra Service
        </label>
        <input
          type="text"
          name="extra_service"
          id="extra_service"
          value={extra_service}
          onChange={(e) => setExtraService(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="pt-3">
        <label
          htmlFor="return_on_investment"
          className="block text-sm font-medium text-gray-700"
        >
          Return on Investment
        </label>
        <input
          type="text"
          name="return_on_investment"
          id="return_on_investment"
          value={return_on_investment}
          onChange={(e) => setReturnOnInvestment(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="pt-3">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        ></textarea>
      </div>

      <div className="pt-3">
        <label
          htmlFor="cover_image"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Image URL
        </label>
        <input
          type="text"
          name="cover_image"
          id="cover_image"
          value={cover_image}
          onChange={(e) => setCoverImage(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {loading ? (
            <div className="text-white ">
              <CircularProgress color="inherit" size={20} />
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default Cases;
