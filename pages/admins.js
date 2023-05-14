/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";

import Notification from "@/components/UI/Notification/Notification";
import { SaveIcon } from "@/components/Products/ProductsFormIcons";
import Spinner from "@/components/UI/Spinner";
import prettyDate from "@/lib/date";
import { DeleteIcon } from "@/components/Products/ProductsFormIcons";
import Modal from "@/components/UI/DeletePopup/Modal";
import Backdrop from "@/components/UI/DeletePopup/Backdrop";

const AdminPage = () => {
  const [formIsVisble, setFormIsVisble] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deletedAdmin, setDeletedAdmin] = useState("");

  //   Delete Admin
  const deleteAdminHandler = () => {
    axios.delete("/api/admins?id=" + deletedAdmin._id);
    closeModal();
    fetchAdminData();
  };

  // Ẩn hiện Modal
  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Fetch data admin Gmail function
  const fetchAdminData = async () => {
    const res = await axios.get("/api/admins");
    setAdminEmails(res.data);
    setIsLoading(false);
  };

  //   Fetch toàn bộ admin Gmail khi vừa load trang
  useEffect(() => {
    setIsLoading(true);
    fetchAdminData();
  }, []);

  //   Xử lý khi submit Form tạo mới admin Gmail
  const addAdminHandler = async (e) => {
    setRequestStatus("pending");
    e.preventDefault();
    try {
      const res = await axios.post("/api/admins", { email: enteredEmail });
      setRequestStatus("success");

      if (res.status === 401) {
        throw new Error();
      }
    } catch (err) {
      setRequestStatus("error");
      setRequestError(err.response.data.message);
    }
    setEnteredEmail("");
    setFormIsVisble(false);
    fetchAdminData();
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
      title: "Adding new admin Gmail...",
      message: "Your request is on its way!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Successfully added new admin Gmail!",
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    };
  }

  return (
    <>
      <h1>Admins</h1>
      <table className="basic my-5">
        <thead>
          <tr className="grid grid-cols-3">
            <th>Admin google email</th>
            <th>Time created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="p-5">
                  <Spinner />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.map((a) => (
            <tr key={a._id} className="grid grid-cols-3">
              <td className="flex items-center">{a.email}</td>
              <td className="flex items-center">{prettyDate(a.createdAt)}</td>
              <td className="flex items-center">
                <button
                  className="btn-red flex"
                  onClick={() => {
                    setDeletedAdmin(a);
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
      {!formIsVisble ? (
        <div className="">
          <button
            className="btn-primary justify-center p-2 text-sm w-full md:w-52"
            onClick={() => setFormIsVisble(true)}
          >
            <img
              className="w-6"
              src="/assets/google-icon-4.png"
              alt="Google icon"
            />
            <p>Add new Gmail admin</p>
          </button>
        </div>
      ) : (
        <form onSubmit={addAdminHandler}>
          <div>
            <label>Add new Gmail admin</label>
            <div className="flex gap-2">
              <input
                type="email"
                className="m-0 w-1/3"
                placeholder="example@gmail.com"
                value={enteredEmail}
                onChange={(e) => setEnteredEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary py-2 px-4">
                <SaveIcon /> Save
              </button>
            </div>
          </div>
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

      {/* Modal xác nhận xoá Category hay không */}
      <Modal
        show={modalIsOpen}
        closed={closeModal}
        onDelete={deleteAdminHandler}
        deletedItemName={deletedAdmin.email}
      />
      {modalIsOpen ? <Backdrop show /> : null}
    </>
  );
};

export default AdminPage;
