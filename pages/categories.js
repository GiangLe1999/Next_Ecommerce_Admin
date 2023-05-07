import {
  CancelIcon,
  DeleteIcon,
  EditIcon,
  MinusIcon,
  PlusIcon,
  SaveIcon,
} from "@/components/Products/ProductsFormIcons";
import axios from "axios";
import React, { useEffect, useState } from "react";

import Notification from "@/components/UI/Notification/Notification";
import Modal from "@/components/UI/DeletePopup/Modal";
import Backdrop from "@/components/UI/DeletePopup/Backdrop";
import Spinner from "@/components/UI/Spinner";

const Categories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [deletedCategory, setDeletedCategory] = useState(null);
  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [properties, setProperties] = useState([{ name: "", value: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  // Submit Form (Hoặc tạo mới hoặc edit category)
  const submitHandler = async (e) => {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        value: p.value.split(","),
      })),
    };
    setRequestStatus("pending");

    if (editedCategory) {
      try {
        await axios.put("/api/categories", {
          ...data,
          _id: editedCategory._id,
        });

        setRequestStatus("success");
      } catch (err) {
        setRequestStatus("error");
        setRequestError(err.message);
      }

      setEditedCategory(null);
    } else {
      try {
        const response = await axios.post("/api/categories", data);
        if (response.status == 500) {
          throw new Error();
        }
      } catch (err) {
        setRequestStatus("error");
        setRequestError(err.response.data.message);
        return;
      }

      setRequestStatus("success");
    }

    fetchCategories();
    setName("");
    setParentCategory("");
    setProperties([{ name: "", value: "" }]);
  };

  // Helper function fetch data
  const fetchCategories = () => {
    setIsLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  };

  // Fetch data khi vừa truy cập
  useEffect(() => {
    fetchCategories();
  }, []);

  // Hàm xử lý tác vụ edit category
  const editCategoryHandler = (category) => {
    setEditedCategory(category);
    setName(category.name);
    if (category.parent) {
      setParentCategory(category.parent._id);
    } else {
      setParentCategory("");
    }
    setProperties(
      category.properties.map(({ name, value }) => {
        return {
          name,
          value: value.join(","),
        };
      })
    );
  };

  // Update Status để ẩn/hiện Notification khi edit category
  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      setTimeout(() => {
        setRequestStatus(null);
      }, 3000);
    }
  }, [requestStatus]);

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Updating categories...",
      message: "Your request is on its way!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Updated category successfully!",
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    };
  }

  // Hàm xử lý tác vụ delete category
  const deleteCategoryHandler = () => {
    axios.delete("/api/categories?id=" + deletedCategory._id);
    closeModal();
    fetchCategories();
  };

  // Ẩn hiện Modal
  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Thêm số lượng Property input
  const addProperty = () => {
    setProperties((prev) => [...prev, { name: "", value: "" }]);
  };

  // Cập nhât Properties State
  const propertyNameChangeHandler = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };
  const propertyValueChangeHandler = (index, property, newValue) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  };

  // Remove Property
  const removePropertyHandler = (index) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties.splice(index, 1);
      return properties;
    });
  };

  return (
    <>
      <h1>Categories</h1>
      {/* Form */}
      <form onSubmit={submitHandler}>
        {/* Hàng 1: Category & Parent Category */}
        <div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label id="categoryName" htmlFor="categoryName">
                {editedCategory
                  ? `Edit category ${editedCategory.name}`
                  : "Create new category"}
              </label>
              <input
                type="text"
                placeholder="Category name"
                id="categoryName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="parentCategory">Parent Category</label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                id="parentCategory"
              >
                <option value="">No parent category</option>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Hàng 2: Property name & Property Value */}
          <div className="mb-2">
            <div className="flex justify-between">
              <label className="mb-1" htmlFor="properties">
                Properties
              </label>
              <button
                onClick={addProperty}
                type="button"
                className="flex text-xs items-center hover:text-primary font-bold"
              >
                <PlusIcon />
                Add more properties
              </button>
            </div>
            {properties?.length > 0 ? (
              properties.map((property, index) => (
                <div key={index}>
                  <div>
                    <button
                      className="py-0 text-xs hover:text-primary flex items-center my-1"
                      type="button"
                      onClick={() => removePropertyHandler(index)}
                    >
                      <MinusIcon /> Remove this property
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={property.name}
                      className="mb-2"
                      type="text"
                      placeholder="Property name (eg: color)"
                      onChange={(e) =>
                        propertyNameChangeHandler(
                          index,
                          property,
                          e.target.value
                        )
                      }
                    />
                    <input
                      value={property.value}
                      className="mb-2"
                      type="text"
                      placeholder="Property value (comma seperated & no space)"
                      onChange={(e) =>
                        propertyValueChangeHandler(
                          index,
                          property,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm">
                Let&lsquo;s add property for your product.
              </p>
            )}
          </div>

          {/* Form Submit Button */}
          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary py-2 px-4">
              <SaveIcon /> Save
            </button>
            {editedCategory && (
              <button
                type="button"
                className="bg-red-200 text-red-600 rounded-sm flex items-center gap-1 py-2 px-4 hover:bg-red-600 hover:text-white"
                onClick={() => {
                  setEditedCategory(null);
                  setName("");
                  setParentCategory("");
                  setProperties([{ name: "", value: "" }]);
                }}
              >
                <CancelIcon /> Cancel Editing
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      {!editedCategory && isLoading && (
        <div className="py-10">
          <Spinner />
        </div>
      )}
      {categories.length > 0 && !editedCategory && !isLoading && (
        <table className="basic mt-10">
          <thead>
            <tr className="grid grid-cols-3 sm:grid-cols-2">
              <th>Category name</th>
              <th className="sm:hidden">Parent category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr
                  className="grid grid-cols-3 sm:grid-cols-2"
                  key={category._id}
                >
                  <td>{category.name}</td>
                  <td className="sm:hidden">{category?.parent?.name}</td>
                  <td className="flex lg:flex-row flex-col lg:items-center gap-2">
                    <button
                      onClick={() => editCategoryHandler(category)}
                      className="flex"
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      className="btn-red flex"
                      onClick={() => {
                        setDeletedCategory(category);
                        showModal();
                      }}
                    >
                      <DeleteIcon /> Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Notification khi thực hiện Edit */}
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}

      {/* Modal xác nhận xoá Category hay không */}
      <Modal
        show={modalIsOpen}
        closed={closeModal}
        onDelete={deleteCategoryHandler}
        deletedItemName={deletedCategory?.name}
      />
      {modalIsOpen ? <Backdrop show /> : null}
    </>
  );
};

export default Categories;
