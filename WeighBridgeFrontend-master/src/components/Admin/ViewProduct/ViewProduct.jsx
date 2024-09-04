import { useState, useEffect } from "react";
import { Table, Button, Tooltip } from "antd";
import SideBar from "../../SideBar/SideBar";
import "./ViewProduct.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("http://49.249.180.125:8080/api/v1/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleViewClick = (productName) => {
    fetch(
      `http://49.249.180.125:8080/api/v1/products/view/${productName}/parameters`
    )
      .then((response) => response.json())
      .then((data) => {
        setModalData(data);
        setSelectedProduct(productName);
        // Use Bootstrap's modal show method
        const modal = new window.bootstrap.Modal(
          document.getElementById("productModal")
        );
        modal.show();
      })
      .catch((error) =>
        console.error("Error fetching product parameters:", error)
      );
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Type Name",
      dataIndex: "productTypeName",
      key: "productTypeName",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Tooltip title="View Parameters">
          <Button
            icon={<VisibilityIcon />}
            onClick={() => handleViewClick(record.productName)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <SideBar>
      <div className="view-product-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Product</h2>
          <Link to={"/admin-dashboard"}>
            <FontAwesomeIcon
              icon={faHome}
              style={{ float: "right", fontSize: "1.5em" }}
              className="mb-2"
            />
          </Link>
        </div>
        <div className="table-responsive">
          <Table
            dataSource={products}
            columns={columns}
            rowKey="productId"
            className="user-table mt-3 custom-table"
          />
        </div>

        <div
          className="modal fade"
          id="productModal"
          tabIndex="-1"
          aria-labelledby="productModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "lightgray" }}
              >
                <h5 className="modal-title" id="productModalLabel">
                  {selectedProduct} Parameters
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {modalData.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="fw-bold mb-1">{item.parameterName}</p>
                    <p className="mb-0">
                      {item.rangeFrom}(Min) - {item.rangeTo}(Max)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default ViewProduct;
