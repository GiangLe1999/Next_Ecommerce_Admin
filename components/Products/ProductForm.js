/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { RemoveIamgeIcon, SaveIcon, UploadIcon } from "./ProductsFormIcons";
import Spinner from "../UI/Spinner";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
  title: existingTitle,
  price: existingPrice,
  description: existingDescription,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
  _id,
  heading,
}) => {
  const router = useRouter();
  const [title, setName] = useState(existingTitle || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );

  // Xử lý tác vụ up ảnh
  const uploadImagesHandler = async (e) => {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("files", file);
      }
      const response = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...response.data.links];
      });
      setIsUploading(false);
    }
  };

  // Xử lý khi Submit form
  const saveProductHandler = async (e) => {
    e.preventDefault();

    const data = {
      title,
      price,
      description,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      // Edit existing product
      const response = await axios.put(`/api/products/${_id}`, data);
      if (response) {
        router.push("/products");
      }
    } else {
      // Create new product
      const response = await axios.post("/api/products", data);
      if (response) {
        router.push("/products");
      }
    }
  };

  // Sort ảnh bằng cách kéo thả
  const orderImagesHandler = (images) => {
    setImages(images);
  };

  // Remove ảnh
  const removeImageHandler = (index) => {
    setImages((prev) => {
      const images = [...prev];
      images.splice(index, 1);
      return images;
    });
  };

  // Fetch Categories khi vừa mount
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const propertiesToFill = [];

  if (categories.length > 0 && category) {
    let selectedCategory = categories.find(({ _id }) => category === _id);
    propertiesToFill.push(...selectedCategory.properties);
    while (selectedCategory?.parent?._id) {
      const selectedParentCategory = selectedCategory.parent;
      propertiesToFill.push(...selectedParentCategory.properties);
      selectedCategory = selectedParentCategory;
    }
    // if (selectedCategory?.parent?._id) {
    //   const selectedParentCategory = selectedCategory.parent;
    //   propertiesToFill.push(...selectedParentCategory.properties);
    // }
  }

  return (
    <form onSubmit={saveProductHandler}>
      <h1>{heading}</h1>
      {/* Product name */}
      <div className="">
        <label htmlFor="name">Product name</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          placeholder="Maximum 150 character"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Category & Price */}
      <div className="grid grid-cols-2 gap-2">
        <div className="">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">Uncategorized</option>
            {categories.length > 0 &&
              categories.map((c) => {
                return (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="">
          <label htmlFor="price">Price in USD ($)</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Only number (99.00)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Properties */}
      <div className="mb-4">
        <label>Properties</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {propertiesToFill.length > 0
            ? propertiesToFill.map((p) => (
                <div key={p._id} className="">
                  <label className="text-xs italic font-medium capitalize">
                    {p.name}
                  </label>
                  <select
                    className="m-0"
                    onChange={(e) =>
                      setProductProperties((prev) => ({
                        ...prev,
                        [p.name]: e.target.value,
                      }))
                    }
                    value={productProperties[p.name]}
                  >
                    <option value="">Unset</option>
                    {p.value.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))
            : "There is no property."}
        </div>
      </div>

      {/* Photo */}
      <div className="mb-4">
        <label htmlFor="photo">Photos</label>
        <div className="md:flex md:items-center gap-4 mb-3">
          <label
            htmlFor="photo"
            className="bg-white shadow-md hover:bg-gray-50 w-full py-3 md:w-32 md:h-32 border border-gray-200 text-center
            flex flex-col items-center justify-center rounded-sm gap-1 text-gray-500 cursor-pointer mb-3 md:mb-0"
          >
            <UploadIcon />
            Add image
          </label>
          <input
            id="photo"
            type="file"
            className="hidden"
            onChange={uploadImagesHandler}
            multiple
          />
          <ReactSortable
            list={images}
            setList={orderImagesHandler}
            className="flex gap-3 flex-wrap"
          >
            {!!images?.length &&
              images.map((image, index) => (
                <div
                  className="productImageWrapper w-32 h-32 object-cover object-center flex items-center justify-center overflow-hidden relative bg-white shadow-md rounded-sm border border-gray-200"
                  key={image}
                >
                  <img
                    src={image}
                    alt={image}
                    className="cursor-pointer hover:scale-110 rounded-md transition duration-300 ease-in-out w-3/4"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageHandler(index)}
                    className="removeImageBtn absolute top-0 right-0 hidden"
                  >
                    <RemoveIamgeIcon />
                  </button>
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 w-24 flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="">
        <label htmlFor="">Description</label>
        <textarea
          placeholder="Maximum 3000 characters"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
        ></textarea>
      </div>
      {/* Form Save button */}
      <div>
        <button className="btn-primary py-2 px-4" type="submit">
          <SaveIcon /> Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
