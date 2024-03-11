"use client";
import React, { useEffect, useState } from "react";
import { ICategories } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import AddCategory from "@/apiHelper/addCategory";
import { addNotification } from "@/stores/reducers/notificationReducer";
import fetchCategory from "@/apiHelper/fetchCategory";
import {
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import AddBlog from "@/apiHelper/addBlogs";
import ReactQuillComponent from "@/components/ReactQuillComponent";

export default function Page() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.general.user);
  const [title, setTitle] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [long_description, setLongDescription] = useState("");
  const [cover_image, setCoverImage] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<ICategories[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    const response = await AddBlog({
      title: title,
      short_description: short_description,
      long_description: long_description,
      cover_image: cover_image,
      category: blogCategory,
      slug: slug,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Blog added successfully",
          open: true,
          severity: "success",
        })
      );
      setLoading(false);
      setTitle("");
      setSlug("");
      setBlogCategory("");
      setCoverImage("");
      setLongDescription("");
      setShortDescription("");
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

  const handleCategorySubmit = async () => {
    const response = await AddCategory({
      name: category,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Category added successfully",
          open: true,
          severity: "success",
        })
      );
      setCategory("");
      getCategory();
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Form submission failed",
          open: true,
          severity: "error",
        })
      );
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setBlogCategory(event.target.value as string);
  };

  const getCategory = async () => {
    const response = await fetchCategory({});
    console.log(response.data, "data");
    setCategories(response.data.allCategories);
  };

  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]+/g, ""); 
    setSlug(generatedSlug);
  }, [title]);

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="lg:px-20 px-10">
      <div className="pt-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none"
        />
      </div>

      <div className="pt-4">
        <label
          htmlFor="short_description"
          className="block text-sm font-medium text-gray-700"
        >
          Short Description
        </label>
        <textarea
          id="short_description"
          value={short_description}
          onChange={(e) => setShortDescription(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none"
        ></textarea>
      </div>

      <div className="pt-4">
        <label
          htmlFor="long_description"
          className="block text-sm font-medium text-gray-700"
        >
          Long Description
        </label>
        <ReactQuillComponent
          long_description={long_description}
          setLongDescription={setLongDescription}
        />
      </div>

      <div className="pt-4">
        <label
          htmlFor="cover_image"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Image URL
        </label>
        <input
          type="text"
          id="cover_image"
          value={cover_image}
          onChange={(e) => setCoverImage(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none"
        />
      </div>

      <div className="pt-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Categories
        </label>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={blogCategory}
          label="Category"
          onChange={handleChange}
          className="w-full"
        >
          {categories &&
            categories.length > 0 &&
            categories.map((item: any) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
      </div>

      <button
        onClick={() => handleSubmit()}
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

      <div className="pt-4 bg-gray-300 rounded-xl shadow-xl my-16 py-6 px-3">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-900"
        >
          Add New Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none"
        />

        <div>
          <button
            onClick={handleCategorySubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
