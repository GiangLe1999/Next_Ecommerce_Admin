import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ProductForm from "@/components/Products/ProductForm";
import Spinner from "@/components/UI/Spinner";

const EditProductPage = () => {
  const router = useRouter();
  const id = router.query.slug[0];

  const [productInfo, setProductInfo] = useState();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  if (!productInfo) {
    return (
      <div className="p-10">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <ProductForm
        heading="Edit Product"
        title={productInfo.title}
        price={productInfo.price}
        description={productInfo.description}
        images={productInfo.images}
        _id={productInfo._id}
        category={productInfo.category}
        properties={productInfo.properties}
      />
    </>
  );
};

export default EditProductPage;
