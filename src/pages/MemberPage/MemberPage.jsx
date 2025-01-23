import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import userRequest from "../../utils/userRequest/userRequest";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { Images } from "../../utils/ImagesConfig";
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const MemberPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  // Create refs for CNIC inputs
  const cnicRefs = Array(13).fill(0).map(() => useRef(null));
  const fatherCnicRefs = Array(13).fill(0).map(() => useRef(null));

  const initialFormState = {
    childName: "",
    guardianName: "",
    cnicNo: "",
    relation: "father",
    relationCnic: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    tehsil: "",
    district: "",
    religion: "",
    bloodGroup: "",
    qualification: "",
    profession: "",
    currentAddress: "",
    permanentAddress: "",
    contactNumber: "",
    contactNumber2: "",
    TypeOfAccommodation: "",
    noOfDependents: "",
    noOfChildren: "",
    noOfChildrenMale: "",
    noOfChildrenFemale: "",
    noOfChildrenInSchool: "",
    nameOfSchoolChildren: [
      { name: "", class: "", age: "", SchoolName: "" },
      { name: "", class: "", age: "", SchoolName: "" }
    ],
    addictiveDrugs: "",
    addictiveDrugsDescription: "",
    anyDisability: "",
    anyDisabilityDescription: "",
    politicalAffiliation: "",
    politicalAffiliationDescription: "",
    NGO: "",
    NGODescription: "",
    cnicFrontPic: null,
    cnicBackPic: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
  const [cnicBackPreview, setCnicBackPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChildrenDetailsChange = (index, field, value) => {
    const updatedChildren = [...formData.nameOfSchoolChildren];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      nameOfSchoolChildren: updatedChildren
    }));
  };

  const handleCnicInput = (e, index, refs, type) => {
    const value = e.target.value; 
    const singleDigit = value.slice(-1);
    
    if (!/^\d?$/.test(singleDigit)) {
      e.target.value = "";
      return;
    }
    e.target.value = singleDigit;
    if (singleDigit && index < 12) {
      refs[index + 1].current.focus();
    }
    // Update CNIC in formData
    const allCnicInputs = refs.map(ref => ref.current.value);
    allCnicInputs[index] = singleDigit;
    const cnicString = `${allCnicInputs.slice(0,5).join('')}-${allCnicInputs.slice(5,12).join('')}-${allCnicInputs[12] || ''}`;
    
    if (type === 'primary') {
      setFormData(prev => ({ ...prev, cnicNo: cnicString }));
    } else {
      setFormData(prev => ({ ...prev, relationCnic: cnicString }));
    }
  };

  const dobRefs = Array(8).fill(0).map(() => useRef(null));
  const handleDobInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 7) {
      dobRefs[index + 1].current.focus();
    }

    // Update DOB in formData
    const allDobInputs = dobRefs.map(ref => ref.current.value);
    // Format as YYYY-MM-DD directly for API compatibility
    const year = allDobInputs.slice(4,8).join('');
    const month = allDobInputs.slice(2,4).join('');
    const day = allDobInputs.slice(0,2).join('');
    
    if (day && month && year) {
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, dateOfBirth: dateString }));
    }
  };

  const handleKeyDown = (e, refs, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  // Add file handling function
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'cnicFrontPic') {
          setCnicFrontPreview(reader.result);
        } else if (field === 'cnicBackPic') {
          setCnicBackPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Create a copy of formData to modify
      const formDataToSubmit = { ...formData };
      
      // Append all non-file form fields
      Object.entries(formDataToSubmit).forEach(([key, value]) => {
        if (key !== 'cnicFrontPic' && key !== 'cnicBackPic') {
          if (key === 'nameOfSchoolChildren') {
            value.forEach((child, index) => {
              Object.entries(child).forEach(([childKey, childValue]) => {
                submitData.append(`nameOfSchoolChildren[${index}][${childKey}]`, childValue);
              });
            });
          } else {
            submitData.append(key, value);
          }
        }
      });
      
      // Append files
      if (formData.cnicFrontPic) {
        submitData.append('cnicFrontPic', formData.cnicFrontPic);
      }
      if (formData.cnicBackPic) {
        submitData.append('cnicBackPic', formData.cnicBackPic);
      }

      // Add userId
      submitData.append('userId', userData?.data?.user?._id);

      const response = await userRequest.post("/member/addnewmember", submitData);
      
      toast.success(response?.data?.message || "Member added successfully");
      
      // Clear form and previews
      setFormData(initialFormState);
      setCnicFrontPreview(null);
      setCnicBackPreview(null);
      
      // Clear CNIC inputs
      cnicRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      fatherCnicRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      // Clear DOB inputs
      dobRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });

      setLoading(false);
      // Navigate after delay
      setTimeout(() => {
        navigate('/home-page');
      }, 1500);

    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      toast.error(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to add member"
      );
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Add this function to handle adding new row
  const addNewChildRow = () => {
    setFormData(prev => ({
      ...prev,
      nameOfSchoolChildren: [
        ...prev.nameOfSchoolChildren,
        { name: "", class: "", age: "", SchoolName: "" }
      ]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loader />}
      <Navbar />
      <div className="p-2 md:p-3 rounded-lg bg-gray-100">
        <div className="max-w-6xl mx-auto p-3 md:p-6 relative bg-white">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src={Images.logo}
              alt="Watermark"
              className="w-[500px] md:w-[700px] h-[500px] md:h-[700px] object-contain"
            />
          </div>

          {/* Header Banner */}
          <div className="rounded-lg p-1 bg-white mb-6 md:mb-10">
            <div className="relative">
              <div className="bg-[#004F25] text-white relative">
                <div className="absolute left-0 top-0 bottom-0 w-4 md:w-8 bg-[#90CE5F] rounded-r-lg"></div>
                <div className="absolute right-0 top-0 bottom-0 w-4 md:w-8 bg-[#90CE5F] rounded-l-lg"></div>

                <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-2 md:py-0">
                  {/* Left logo */}
                  <div className="w-24 md:w-32 h-20 md:h-24 bg-white p-2 rounded-lg mb-2 md:mb-0">
                    <img
                      src={Images.logo}
                      alt="Help System Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Center text */}
                  <div className="text-center space-y-0.5 md:space-y-1 py-2 md:py-0">
                    <h1 className="text-2xl md:text-4xl font-extrabold">HELP SYSTEM</h1>
                    <h2 className="text-xl md:text-2xl font-bold">KHYBER PUKHTUNKHWA</h2>
                    <p className="text-base md:text-xl font-semibold">
                      Voluntary Social Welfare Organization
                    </p>
                    <p className="text-base md:text-xl font-semibold">
                      Health Education Livelihood & Peace for All
                    </p>
                  </div>

                  {/* Right QR code */}
                  <div className="w-24 md:w-32 h-20 md:h-24 bg-white p-2 rounded-lg mt-2 md:mt-0">
                    <img
                      src={Images.logo2}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* 1. Personal Details */}
            <div className="space-y-4">
              <h4 className="font-bold">1. Personal Details</h4>

              {/* Name and CNIC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[80px]">Full Name</label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                {/* User CNIC Input */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[50px]">CNIC</label>
                  <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                    {[...Array(13)].map((_, i) => (
                      <React.Fragment key={`user-cnic-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={cnicRefs[i]}
                          onChange={(e) => handleCnicInput(e, i, cnicRefs, 'primary')}
                          onKeyDown={(e) => handleKeyDown(e, cnicRefs, i)}
                          required
                        />
                        {(i === 4 || i === 11) && <span className="flex-shrink-0">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Father/Husband and Guardian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label>Father/Husband</label>
                    <select
                      name="relation"
                      value={formData.relation}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1"
                      required
                    >
                      <option value="father">Father</option>
                      <option value="husband">Husband</option>
                    </select>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      placeholder="Father/Husband Name"
                      className="border border-gray-400 bg-transparent p-1 flex-1"
                      required
                    />
                  </div>
                </div>

                {/* Father/Husband CNIC Input */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[50px]">CNIC</label>
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {[...Array(13)].map((_, i) => (
                      <React.Fragment key={`father-cnic-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center flex-shrink-0"
                          maxLength="1"
                          ref={fatherCnicRefs[i]}
                          onChange={(e) => handleCnicInput(e, i, fatherCnicRefs, 'secondary')}
                          onKeyDown={(e) => handleKeyDown(e, fatherCnicRefs, i)}
                          required
                        />
                        {(i === 4 || i === 11) && <span className="flex-shrink-0">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nationality, Religion, Tehsil, and District */}
              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
                {/* Nationality */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-1 w-full"
                    required
                  />
                </div>

                {/* Religion */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Religion</label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-1 w-full"
                    required
                  >
                    <option value="">Select Religion</option>
                    <option value="muslim">Muslim</option>
                    <option value="non-muslim">Non-Muslim</option>
                  </select>
                </div>

                {/* Tehsil */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Tehsil</label>
                  <input
                    type="text"
                    name="tehsil"
                    value={formData.tehsil}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-1 w-full"
                    required
                  />
                </div>

                {/* District */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-1 w-full"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth and Gender */}
              <div className="p-2">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap text-sm">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1"
                      required
                    />
                  </div> */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                    <label className="block text-sm whitespace-nowrap min-w-[10px]">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto">
                      {[...Array(8)].map((_, i) => (
                        <React.Fragment key={`date-${i}`}>
                          <input
                            type="text"
                            className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                            maxLength="1"
                            ref={dobRefs[i]}
                            onChange={(e) => handleDobInput(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, dobRefs, i)}
                          />
                          {(i === 1 || i === 3) && <span>-</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm">Gender</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleInputChange}
                          required
                        /> Male
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleInputChange}
                        /> Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marital Status */}
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <label className="text-sm">Marital Status</label>
                <div className="flex flex-wrap gap-4">
                  {["single", "married", "divorced", "widowed"].map((status) => (
                    <label key={status} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value={status}
                        checked={formData.maritalStatus === status}
                        onChange={handleInputChange}
                        required
                      /> 
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Blood Group, Qualification, and Profession */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Group */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="text-sm">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full md:w-auto"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Qualification */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="text-sm">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full md:w-auto"
                    required
                  />
                </div>

                {/* Profession */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="text-sm">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full md:w-auto"
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Current Address</label>
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Permanent Address</label>
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Alternative Contact</label>
                  <input
                    type="text"
                    name="contactNumber2"
                    value={formData.contactNumber2}
                    onChange={handleInputChange}
                    className="border border-gray-400 bg-transparent p-1 w-full"
                  />
                </div>
              </div>

              {/* Accommodation and Dependents */}
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-sm whitespace-nowrap">Type of Accommodation</label>
                    <select
                      name="TypeOfAccommodation"
                      value={formData.TypeOfAccommodation}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1 w-full md:w-auto"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="owned">Owned</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-sm whitespace-nowrap">Number of Dependents</label>
                    <input
                      type="number"
                      name="noOfDependents"
                      value={formData.noOfDependents}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1 w-full md:w-auto"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Total Children */}
              <div className="flex flex-col gap-1">
                <label className="text-sm">Total Children</label>
                <input
                  type="number"
                  name="noOfChildren"
                  value={formData.noOfChildren}
                  onChange={handleInputChange}
                  className="border border-gray-400 bg-transparent p-1 w-full"
                  required
                />
              </div>

              {/* Children Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[80px]">Total Children</label>
                  <input
                    type="number"
                    name="noOfChildren"
                    value={formData.noOfChildren}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[80px]">Children in School</label>
                  <input
                    type="number"
                    name="noOfChildrenInSchool"
                    value={formData.noOfChildrenInSchool}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[80px]">Male Children</label>
                  <input
                    type="number"
                    name="noOfChildrenMale"
                    value={formData.noOfChildrenMale}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[80px]">Female Children</label>
                  <input
                    type="number"
                    name="noOfChildrenFemale"
                    value={formData.noOfChildrenFemale}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
              </div>

              {/* School Children Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Children's School Details</h4>
                  <button
                    type="button"
                    onClick={addNewChildRow}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add Child</span>
                  </button>
                </div>
                
                {formData.nameOfSchoolChildren.map((child, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={child.name}
                      onChange={(e) => handleChildrenDetailsChange(index, 'name', e.target.value)}
                      className="border border-gray-400 bg-transparent p-1"
                    />
                    <input
                      type="text"
                      placeholder="Class"
                      value={child.class}
                      onChange={(e) => handleChildrenDetailsChange(index, 'class', e.target.value)}
                      className="border border-gray-400 bg-transparent p-1"
                    />
                    <input
                      type="text"
                      placeholder="Age"
                      value={child.age}
                      onChange={(e) => handleChildrenDetailsChange(index, 'age', e.target.value)}
                      className="border border-gray-400 bg-transparent p-1"
                    />
                    <input
                      type="text"
                      placeholder="School Name"
                      value={child.SchoolName}
                      onChange={(e) => handleChildrenDetailsChange(index, 'SchoolName', e.target.value)}
                      className="border border-gray-400 bg-transparent p-1"
                    />
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="font-semibold">Additional Information</h4>
                
                {/* Addictive Drugs */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label>Addictive Drugs?</label>
                    <select
                      name="addictiveDrugs"
                      value={formData.addictiveDrugs}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {formData.addictiveDrugs === 'yes' && (
                    <input
                      type="text"
                      name="addictiveDrugsDescription"
                      value={formData.addictiveDrugsDescription}
                      onChange={handleInputChange}
                      placeholder="Please provide details"
                      className="w-full border border-gray-400 bg-transparent p-1"
                    />
                  )}
                </div>

                {/* Disability */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label>Any Disability?</label>
                    <select
                      name="anyDisability"
                      value={formData.anyDisability}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {formData.anyDisability === 'yes' && (
                    <input
                      type="text"
                      name="anyDisabilityDescription"
                      value={formData.anyDisabilityDescription}
                      onChange={handleInputChange}
                      placeholder="Please provide details"
                      className="w-full border border-gray-400 bg-transparent p-1"
                    />
                  )}
                </div>

                {/* Political Affiliation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label>Political Affiliation?</label>
                    <select
                      name="politicalAffiliation"
                      value={formData.politicalAffiliation}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {formData.politicalAffiliation === 'yes' && (
                    <input
                      type="text"
                      name="politicalAffiliationDescription"
                      value={formData.politicalAffiliationDescription}
                      onChange={handleInputChange}
                      placeholder="Please provide details"
                      className="w-full border border-gray-400 bg-transparent p-1"
                    />
                  )}
                </div>

                {/* NGO */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label>NGO Affiliation?</label>
                    <select
                      name="NGO"
                      value={formData.NGO}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-transparent p-1"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {formData.NGO === 'yes' && (
                    <input
                      type="text"
                      name="NGODescription"
                      value={formData.NGODescription}
                      onChange={handleInputChange}
                      placeholder="Please provide details"
                      className="w-full border border-gray-400 bg-transparent p-1"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* CNIC Images Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-2 md:p-4">
              {/* Front CNIC */}
              <div>
                <label className="block mb-2">CNIC Front Image</label>
                <div className="border-2 border-dashed border-gray-400 h-48 relative mb-2">
                  {cnicFrontPreview ? (
                    <img src={cnicFrontPreview} alt="CNIC Front" className="w-full h-full object-contain"/>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Upload CNIC Front</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cnicFrontPic')}
                    className="hidden"
                    id="cnicFrontUpload"
                  />
                  <label 
                    htmlFor="cnicFrontUpload"
                    className="bg-[#3B82F6] text-white px-6 py-1.5 rounded text-sm cursor-pointer"
                  >
                    Upload CNIC Front
                  </label>
                </div>
              </div>

              {/* Back CNIC */}
              <div>
                <label className="block mb-2">CNIC Back Image</label>
                <div className="border-2 border-dashed border-gray-400 h-48 relative mb-2">
                  {cnicBackPreview ? (
                    <img src={cnicBackPreview} alt="CNIC Back" className="w-full h-full object-contain"/>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Upload CNIC Back</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cnicBackPic')}
                    className="hidden"
                    id="cnicBackUpload"
                  />
                  <label 
                    htmlFor="cnicBackUpload"
                    className="bg-[#3B82F6] text-white px-6 py-1.5 rounded text-sm cursor-pointer"
                  >
                    Upload CNIC Back
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center md:justify-end p-2 md:p-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600 font-semibold w-full md:w-auto"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default MemberPage;