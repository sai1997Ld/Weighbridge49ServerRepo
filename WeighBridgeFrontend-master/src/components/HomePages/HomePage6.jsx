import { useState, useEffect } from 'react';
import { Table, Button, Pagination, Input, Tooltip, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SideBar6 from '../SideBar/Sidebar6';
import './HomePage6.css';
import Swal from "sweetalert2";

const { Search } = Input;

const HomePage6 = () => {
  const [sales, setSales] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [closeMessage, setCloseMessage] = useState('');
  const [selectedSaleOrderNo, setSelectedSaleOrderNo] = useState(null);
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:8080/api/v1/sales/getAll/sales/${userId}?page=${currentPage - 1}&size=${pageSize}`;

      if (searchValue.trim() !== '') {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/sales/searchBySo?saleOrderNo=${searchValue}&userId=${userId}`);
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to fetch search result');
          }
          const data = await response.json();
          setSearchResult(data);
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
          console.error('Error fetching search result:', error);
        }
        return;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setSales(data.sales);
        setTotalPages(data.totalPage);
        setTotalElements(data.totalElement);
        setSearchResult(null);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchData();
  }, [currentPage, pageSize, searchValue, userId]);

  const handleDelete = (saleOrderNo) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to close the sales order ${saleOrderNo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedSaleOrderNo(saleOrderNo);
        setIsModalVisible(true);
      }
    });
  };
  const handleModalOk = async () => {
    try {
      const queryParams = new URLSearchParams({
        saleOrderNo: selectedSaleOrderNo,
        message: closeMessage
      });

      const response = await fetch(`http://localhost:8080/api/v1/sales/closeOrder?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to close the sale order');
      }

      const data = await response.text();
      Swal.fire('Success', data, 'success');
      setIsModalVisible(false);
      setCloseMessage('');
      
      const updatedSales = sales.filter(sale => sale.saleOrderNo !== selectedSaleOrderNo);
      setSales(updatedSales);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };


  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCloseMessage('');
  };

  const columns = [
    {
      title: 'Sale Order No',
      dataIndex: 'saleOrderNo',
      key: 'saleOrderNo',
      render: (text, record) => (
        <Tooltip title="Create Sales Pass">
          <Button
            onClick={() => handleRowClick(record)}
            style={{ backgroundColor: "#88CCFA" }}
          >
            {text}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Purchase Order No',
      dataIndex: 'purchaseOrderNo',
      key: 'purchaseOrderNo',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Customer Address',
      dataIndex: 'customerAddress',
      key: 'customerAddress',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Broker Name',
      dataIndex: 'brokerName',
      key: 'brokerName',
    },
    {
      title: 'Ordered Qty',
      dataIndex: 'orderedQty',
      key: 'orderedQty',
    },
    {
      title: 'Progressive Qty',
      dataIndex: 'progressiveQty',
      key: 'progressiveQty',
    },
    {
      title: 'Lumps Balance',
      dataIndex: 'lumpsBalance',
      key: 'lumpsBalance',
    },
    {
      title: 'Fines Balance',
      dataIndex: 'finesBalance',
      key: 'finesBalance'
    },
    {
      title: 'Balance Qty',
      dataIndex: 'balanceQty',
      key: 'balanceQty',
    },
  
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className='d-flex gap-1'>
          <Tooltip title="View Sales Pass">
            <Button
              icon={<VisibilityIcon />}
              onClick={() => handleViewClick(record.saleOrderNo)}
             
            />
          </Tooltip>
        
          {record.balanceQty > 0 && record.balanceQty <= 8 && (
            <Tooltip title="Close Sales Order">
              <Button
                icon={<FontAwesomeIcon icon={faTimes} />}
                onClick={() => handleDelete(record.saleOrderNo)}
                style={{ backgroundColor: "#ff4d4f", color: "white" }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const handleRowClick = (record) => {
    navigate('/ProcessOrder', { state: { saleOrderNo: record.saleOrderNo, productName: record.productName, balanceQty: record.balanceQty, customerName: record.customerName, customerAddress: record.customerAddress, lumpsBalance: record.lumpsBalance, finesBalance: record.finesBalance } });
  };
  

  const handleViewClick = (saleOrderNo) => {
    navigate(`/SalesDisplay?saleOrderNo=${saleOrderNo}`);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (value) => {
    setCurrentPage(1); // Reset to the first page when searching
    setSearchValue(value);
    if (value.trim() === '') {
      setSearchResult(null); // Clear the search result when the search value is empty
    }
  };

  return (
    <SideBar6>
      <div className='home-page-6 container-fluid'>
        <h2 className="text-center">Sales Dashboard</h2>
        <div className="filters d-flex justify-content-start">
          <Search
            placeholder="Search Sale Order No"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
        </div>

        <div className="table-responsive">
          <Table
            columns={columns.map(col => {
              return {
                ...col,
                align: 'center'
              }
            })}
            dataSource={searchResult ? [searchResult] : sales}
            rowKey="saleOrderNo"
            className="user-table mt-3 custom-table "
            pagination={false}
          />
        </div>
        <div className="pagination-container d-flex justify-content-center mt-3 flex-wrap">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalElements}
            showSizeChanger
            showQuickJumper
            onChange={handlePageChange}
            showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
          />
        </div>

        <Modal
          title="Close Sales Order"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <p>Please enter a message for closing the sales order:</p>
          <Input.TextArea
            value={closeMessage}
            onChange={(e) => setCloseMessage(e.target.value)}
            rows={4}
          />
        </Modal>
      </div>
    </SideBar6>
  );
};

export default HomePage6;