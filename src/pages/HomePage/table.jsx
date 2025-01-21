import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userRequest from "../../utils/userRequest/userRequest";
const HomePageTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem("userId"); 
      console.log("userId",userId);
      // Assuming userId is stored in userData
      const response = await userRequest.get(`disable/get-all-alter-form-by-user-id/${userId}`);
      if (response.status === 200) {
        setData(response.data.data); // Adjust based on your API response structure
      }
    };

    fetchData();
  }, []);

  return (
    <div class="font-sans overflow-x-auto mt-10">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 whitespace-nowrap">
          <tr>
            <th class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              CNIC No
            </th>
            
            <th class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Contact Number
            </th>
            <th class="px-4 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
              Alter
            </th>
            <th class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
          {data.map((item) => (
            <tr key={item._id}>
              <td class="px-4 py-4 text-sm text-gray-800">{item.childName}</td>
              <td class="px-4 py-4 text-sm text-gray-800">{item.cnicNo}</td>
              <td class="px-4 py-4 text-sm text-gray-800">{item.contactNumber}</td>
              <td class="px-4 py-4 text-sm text-green-800">{item.productIds.map(product => product.productName).join(', ')}</td>
              <td class="px-4 py-4 text-sm text-gray-800">
                <button class="text-green-600">Done</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePageTable;
