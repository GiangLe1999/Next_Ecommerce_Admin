/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/UI/Spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { ChangeIcon, SaveIcon } from "@/components/Products/ProductsFormIcons";
import Notification from "@/components/UI/Notification/Notification";

const SettingsPage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'

  // Xử lý submit form dể thay đổi Featured Product
  const submitHandler = async (e) => {
    setRequestStatus("pending");

    e.preventDefault();

    await axios.put("/api/settings", {
      name: "featuredProduct",
      value: {
        featuredProductId,
        featuredImage,
      },
    });

    await axios.put("api/settings", {
      name: "shippingFee",
      value: shippingFee,
    });

    setRequestStatus("success");
  };

  // Fetch tất cả dữ liệu cần thiết khi vừa load trang: products, featuredProduct và shipping fee
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("/api/products"),
      axios.get("/api/settings?name=featuredProduct"),
      axios.get("api/settings?name=shippingFee"),
    ]).then((res) => {
      console.log(res);
      setProducts(res[0].data);
      setFeaturedProductId(res[1].data.value.featuredProductId);
      setFeaturedImage(res[1].data.value.featuredImage);
      setShippingFee(res[2].data.value);
      setIsLoading(false);
    });
  }, []);

  // Xử lý khi thay đổi ảnh đại diện
  const changeImageHandler = async (e) => {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("files", file);
      }
      const response = await axios.post("/api/upload", data);
      setFeaturedImage(...response.data.links);
      setIsUploading(false);
    }
  };

  // Xử lý khi thay đổi Value của Featured Product
  const featuredProductChangeHandler = async (e) => {
    setFeaturedProductId(e.target.value);

    // Fetch data để kiểm tra nếu option được chọn là Featured Product thì lấy ra ảnh đại diện trên database
    const res = await axios.get("/api/settings?name=featuredProduct");
    if (res.data.value.featuredProductId === e.target.value) {
      setFeaturedImage(res.data.value.featuredImage);
    } else {
      // Nếu option được chọn không phải là Featured Produc thì lấy ảnh đại diện số 1 của Produc để thay thế
      const defaultFeaturedImage = products.find(
        (p) => e.target.value === p._id
      )?.images[0];

      setFeaturedImage(defaultFeaturedImage);
    }
  };

  //   Xử lý ẩn/hiện Notifcation
  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      setTimeout(() => {
        setRequestStatus(null);
      }, 3000);
    }
  }, [requestStatus]);

  //   Set up nội dung của Notification
  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Updating settings...",
      message: "Your request is on its way!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Successfully updated newest settings!",
    };
  }

  return (
    <>
      <h1>Settings</h1>
      {isLoading && (
        <div className="p-8">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <form>
          {/* Choose Product */}
          <div>
            <label htmlFor="featured">Set home page featured product</label>
            <select
              id="featured"
              onChange={(e) => {
                featuredProductChangeHandler(e);
              }}
              value={featuredProductId}
            >
              {products.length > 0 &&
                products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Choose image */}
          <div className="mb-4">
            <label htmlFor="photo">
              Choose home page featured product&apos;s photo
            </label>
            <div className="md:flex md:items-center gap-4 mb-3">
              <label
                htmlFor="photo"
                className="bg-white shadow-md hover:bg-gray-50 w-full py-3 md:w-32 md:h-32 border border-gray-200 text-center
            flex flex-col items-center justify-center rounded-sm gap-1 text-gray-500 cursor-pointer mb-3 md:mb-0"
              >
                <ChangeIcon />
                Change image
              </label>
              <input
                id="photo"
                type="file"
                className="hidden"
                onChange={changeImageHandler}
              />
              <div className="flex gap-3 flex-wrap">
                <div className="productImageWrapper w-32 h-32 object-cover object-center flex items-center justify-center overflow-hidden relative bg-white shadow-md rounded-sm border border-gray-200">
                  {!isUploading && (
                    <img
                      src={featuredImage}
                      alt="Product main image"
                      className="cursor-pointer hover:scale-110 rounded-md transition duration-300 ease-in-out w-3/4"
                    />
                  )}
                  {isUploading && (
                    <div className="h-24 w-24 flex items-center justify-center">
                      <Spinner />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping fee */}
          <div>
            <label htmlFor="shippingFee">Shipping price in USD ($)</label>
            <input
              type="number"
              id="shippingFee"
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
            />
          </div>

          <button onClick={submitHandler} className="btn-primary py-2 px-4">
            <SaveIcon /> Save settings
          </button>
        </form>
      )}
      {/* Notification khi Thêm mới Gmail */}
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
    </>
  );
};

export default SettingsPage;
