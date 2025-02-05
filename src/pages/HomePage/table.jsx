import React, { useEffect, useState } from 'react';
import userRequest from "../../utils/userRequest/userRequest";
import toast from 'react-hot-toast';
import DataTable from '../../components/Datagrid/DataTable';
import DonePopUp from './DonePopUp';

const HomePageTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userData?.data?.user?._id;

  const columns = [
    {
      header: "Name",
      key: "childName"
    },
    {
      header: "CNIC No",
      key: "cnicNo"
    },
    {
      header: "Contact Number",
      key: "contactNumber"
    },
    {
      header: "Alter",
      key: "productIds",
      render: (item) => item.productIds.map(product => product.productName).join(', ')
    },
    {
      header: "Actions",
      render: (item) => (
        <button 
          onClick={() => handleDoneClick(item)}
          className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        >
          Done
        </button>
      )
    }
  ];

  const fetchData = async () => {
    try {
      const res = await userRequest.get(`disable/get-all-alter-form-by-user-id/${userId}`);
      // console.log(res.data.data);
      setData(res.data.data);
    } 
    catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Error fetching data");
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDoneClick = (rowData) => {
    setSelectedRow(rowData);
    setIsPopupOpen(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        searchPlaceholder="Search records..."
        showSearch={true}
        showPagination={true}
        currentPage={1}
        totalItems={data.length}
        itemsPerPage={10}
        onSearch={handleSearch}
        onPageChange={(page) => console.log('Page changed to:', page)}
      />

      {isPopupOpen && (
        <DonePopUp 
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          rowData={selectedRow}
          fetchData={fetchData}
        />
      )}
    </>
  );
};

export default HomePageTable;
