import { useState, useEffect } from "react";
import { Table, Button, Tooltip } from "antd";
import SideBar from "../../SideBar/SideBar";
import "./ViewMaterial.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/materials")
      .then((response) => response.json())
      .then((data) => setMaterials(data))
      .catch((error) => console.error("Error fetching materials:", error));
  }, []);

  const handleViewClick = (materialName) => {
    fetch(
      `http://localhost:8080/api/v1/materials/view/${materialName}/parameters`
    )
      .then((response) => response.json())
      .then((data) => {
        setModalData(data);
        setSelectedMaterial(materialName);
        // Use Bootstrap's modal show method
        const modal = new window.bootstrap.Modal(
          document.getElementById("materialModal")
        );
        modal.show();
      })
      .catch((error) =>
        console.error("Error fetching material parameters:", error)
      );
  };

  const columns = [
    {
      title: "Material ID",
      dataIndex: "materialId",
      key: "materialId",
    },
    {
      title: "Material Name",
      dataIndex: "materialName",
      key: "materialName",
    },
    {
      title: "Material Type Name",
      dataIndex: "materialTypeName",
      key: "materialTypeName",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Tooltip title="View Parameters">
          <Button
            icon={<VisibilityIcon />}
            onClick={() => handleViewClick(record.materialName)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <SideBar>
      <div className="view-material-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Material</h2>
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
            dataSource={materials}
            columns={columns}
            rowKey="materialId"
            className="user-table mt-3 custom-table"
          />
        </div>

        {/* Bootstrap Modal */}
        <div
          className="modal fade"
          id="materialModal"
          tabIndex="-1"
          aria-labelledby="materialModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "lightgray" }}
              >
                <h5 className="modal-title" id="materialModalLabel">
                  {selectedMaterial} Parameters
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
                  <div key={index} className="mb-4">
                    <p>
                      <strong>Supplier Name:</strong> {item.supplierName}
                    </p>
                    <p>
                      <strong>Supplier Address:</strong> {item.supplierAddress}
                    </p>
                    {item.parameters.map((parameter, paramIndex) => (
                      <div key={paramIndex} className="mt-3">
                        <p>
                          <strong>{parameter.parameterName}</strong>
                        </p>
                        <p>
                          {parameter.rangeFrom}(Min) - {parameter.rangeTo}(Max)
                        </p>
                      </div>
                    ))}
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

export default ViewMaterial;
