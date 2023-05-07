import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

import {
  AddNewProductIcon,
  DeleteIcon,
  EditIcon,
} from "@/components/Products/ProductsFormIcons";
import Modal from "@/components/UI/DeletePopup/Modal";
import Backdrop from "@/components/UI/DeletePopup/Backdrop";
import Spinner from "@/components/UI/Spinner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deletedProduct, setDeletedProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const deleteProductHandler = async () => {
    await axios.delete(`/api/products/${deletedProduct._id}`);
    setModalIsOpen(false);
    fetchProducts();
  };

  const fetchProducts = () => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts();
  }, []);

  return (
    <>
      {/* Modal */}
      <Modal
        show={modalIsOpen}
        closed={closeModal}
        onDelete={deleteProductHandler}
        deletedItemName={deletedProduct?.title}
      />
      {modalIsOpen ? <Backdrop show /> : null}

      {/* Content */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-2">
          <Link
            href="/products/new"
            className="btn-primary md:w-44 justify-center p-2 text-sm"
          >
            <AddNewProductIcon /> Add new product
          </Link>
          {products.length > 0 && (
            <table className="basic mt-5">
              <thead>
                <tr>
                  <th>Product name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td className="flex gap-2">
                        <Link
                          className="inline-flex items-center"
                          href={`/products/edit/${product._id}`}
                        >
                          <EditIcon /> Edit
                        </Link>
                        <button
                          className="btn-red inline-flex items-center"
                          onClick={() => {
                            setDeletedProduct(product);
                            showModal();
                          }}
                        >
                          <DeleteIcon /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default Products;
