import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import userRequest from "../../utils/userRequest/userRequest";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";

const StudentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  // Create refs for CNIC inputs
  const fatherCnicRefs = Array(13).fill(0).map(() => useRef(null));
  const motherCnicRefs = Array(13).fill(0).map(() => useRef(null));
  const guardianCnicRefs = Array(13).fill(0).map(() => useRef(null));

  // Create ref for guardian signature
  const guardianSignatureRef = useRef();

  // Create refs for date of birth
  const dobRefs = Array(8).fill(0).map(() => useRef(null));

  // Create refs for admission date
  const admissionDateRefs = Array(8).fill(0).map(() => useRef(null));

  const initialFormState = {
    childName: "",
    fatherName: "",
    fatherCnic: "",
    motherName: "",
    motherCnic: "",
    dataOfBirth: "",
    totalAge: "",
    bloodGroup: "",
    position: "poor",
    childDisable: "",
    childDisableDesc: "",
    previewsSchool: "",
    previewsSchoolDesc: "",
    schoolAdmittedIn: "",
    schoolclass: "",
    DateOfAdmission: "",
    guardianName: "",
    guardianCnic: "",
    relationWithChild: "",
    relationContact: "",
    guardianAddress: "",
    image: null,
    cnicFrontPic: null,
    cnicBackPic: null,
    productIds: ["6774f473c376018514985ee2"]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
  const [cnicBackPreview, setCnicBackPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCnicInput = (e, index, refs, type) => {
    let value = e.target.value;
    if (value.length > 1) {
      value = value[value.length - 1];
    }    
    if (!/^\d*$/.test(value)) {
      e.target.value = '';
      return;
    }
    e.target.value = value;

    // Auto-focus next input if a digit was entered
    if (value && index < 12) {
      refs[index + 1].current.focus();
    }

    const allCnicInputs = refs.map(ref => ref.current.value);
    allCnicInputs[index] = value;
    const cnicString = `${allCnicInputs.slice(0,5).join('')}-${allCnicInputs.slice(5,12).join('')}-${allCnicInputs[12] || ''}`;
    
    const cnicMap = {
      'father': 'fatherCnic',
      'mother': 'motherCnic',
      'guardian': 'guardianCnic'
    };
    
    setFormData(prev => ({ 
      ...prev, 
      [cnicMap[type]]: cnicString 
    }));
  };

  const handleKeyDown = (e, refs, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        switch(field) {
          case 'image':
            setPhotoPreview(reader.result);
            break;
          case 'cnicFrontPic':
            setCnicFrontPreview(reader.result);
            break;
          case 'cnicBackPic':
            setCnicBackPreview(reader.result);
            break;
          default:
            break;
        }
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const clearSignature = () => {
    if (guardianSignatureRef.current) {
      guardianSignatureRef.current.clear();
    }
  };

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
      setFormData(prev => ({ ...prev, dataOfBirth: dateString }));
    }
  };

  const handleDobKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      dobRefs[index - 1].current.focus();
    }
  };

  const handleAdmissionDateInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 7) {
      admissionDateRefs[index + 1].current.focus();
    }

    // Update Date of Admission in formData
    const allDateInputs = admissionDateRefs.map(ref => ref.current.value);
    // Format as YYYY-MM-DD directly for API compatibility
    const year = allDateInputs.slice(4,8).join('');
    const month = allDateInputs.slice(2,4).join('');
    const day = allDateInputs.slice(0,2).join('');
    
    if (day && month && year) {
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, DateOfAdmission: dateString }));
    }
  };

  const handleAdmissionDateKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      admissionDateRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && key !== 'cnicFrontPic' && key !== 'cnicBackPic') {
          submitData.append(key, value);
        }
      });
      
      // Append files
      if (formData.image) submitData.append('image', formData.image);
      if (formData.cnicFrontPic) submitData.append('cnicFrontPic', formData.cnicFrontPic);
      if (formData.cnicBackPic) submitData.append('cnicBackPic', formData.cnicBackPic);

      // Handle guardian signature
      if (guardianSignatureRef.current && !guardianSignatureRef.current.isEmpty()) {
        const signatureDataURL = guardianSignatureRef.current.toDataURL();
        const response = await fetch(signatureDataURL);
        const blob = await response.blob();
        submitData.append('guardianSignature', new File([blob], 'guardianSignature.png', { type: 'image/png' }));
      }

      // Add userId
      submitData.append('userId', userData?.data?.user?._id);

      const response = await userRequest.post("/school/addnewschool", submitData);
      toast.success(response?.data?.message || "Student added successfully");

      // Reset form
      setFormData(initialFormState);
      setPhotoPreview(null);
      setCnicFrontPreview(null);
      setCnicBackPreview(null);
      clearSignature();

      // Clear DOB and Admission Date inputs after successful submission
      dobRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      admissionDateRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });

      setLoading(false);
      // Navigate after success
      setTimeout(() => {
        navigate('/home-page');
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      toast.error(err?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {loading && <Loader />}
      <Navbar />
      <div className="max-w-6xl mx-auto p-2 md:p-6 bg-white rounded-lg mt-3">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Form Header */}
          <div className="bg-green-800 text-white px-2 py-1">
            <h4 className="text-sm md:text-base">3. Orphans/Child Labor School Admission Form</h4>
          </div>

          {/* Main Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 md:gap-8 p-2 md:p-4">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Basic Information Fields */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">Child Name</label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">Father Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">CNIC</label>
                  <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                    {[...Array(13)].map((_, i) => (
                      <React.Fragment key={`father-cnic-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center flex-shrink-0"
                          maxLength="1"
                          ref={fatherCnicRefs[i]}
                          onChange={(e) => handleCnicInput(e, i, fatherCnicRefs, 'father')}
                          onKeyDown={(e) => handleKeyDown(e, fatherCnicRefs, i)}
                        />
                        {(i === 4 || i === 11) && <span className="flex-shrink-0">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">Mother Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">Mother CNIC</label>
                  <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                    {[...Array(13)].map((_, i) => (
                      <React.Fragment key={`mother-cnic-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center flex-shrink-0"
                          maxLength="1"
                          ref={motherCnicRefs[i]}
                          onChange={(e) => handleCnicInput(e, i, motherCnicRefs, 'mother')}
                          onKeyDown={(e) => handleKeyDown(e, motherCnicRefs, i)}
                        />
                        {(i === 4 || i === 11) && <span className="flex-shrink-0">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">Date of Birth</label>
                  <div className="flex gap-1 items-center">
                    {/* Day */}
                    {[...Array(2)].map((_, i) => (
                      <React.Fragment key={`dob-day-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={dobRefs[i]}
                          onChange={(e) => handleDobInput(e, i)}
                          onKeyDown={(e) => handleDobKeyDown(e, i)}
                          required
                        />
                      </React.Fragment>
                    ))}
                    <span className="flex-shrink-0">-</span>
                    {/* Month */}
                    {[...Array(2)].map((_, i) => (
                      <React.Fragment key={`dob-month-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={dobRefs[i + 2]}
                          onChange={(e) => handleDobInput(e, i + 2)}
                          onKeyDown={(e) => handleDobKeyDown(e, i + 2)}
                          required
                        />
                      </React.Fragment>
                    ))}
                    <span className="flex-shrink-0">-</span>
                    {/* Year */}
                    {[...Array(4)].map((_, i) => (
                      <React.Fragment key={`dob-year-${i}`}>
                        <input
                          type="number"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={dobRefs[i + 4]}
                          onChange={(e) => handleDobInput(e, i + 4)}
                          onKeyDown={(e) => handleDobKeyDown(e, i + 4)}
                          required
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[100px]">Total Age</label>
                  <input
                    type="text"
                    name="totalAge"
                    value={formData.totalAge}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>
              </div>

              {/* School Information Fields */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">School Admitted In</label>
                  <input
                    type="text"
                    name="schoolAdmittedIn"
                    value={formData.schoolAdmittedIn}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">School Class</label>
                  <input
                    type="text"
                    name="schoolclass"
                    value={formData.schoolclass}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">Date of Admission</label>
                  <div className="flex gap-1 items-center">
                    {/* Day */}
                    {[...Array(2)].map((_, i) => (
                      <React.Fragment key={`admission-day-${i}`}>
                        <input
                          type="text"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={admissionDateRefs[i]}
                          onChange={(e) => handleAdmissionDateInput(e, i)}
                          onKeyDown={(e) => handleAdmissionDateKeyDown(e, i)}
                          required
                        />
                      </React.Fragment>
                    ))}
                    <span className="flex-shrink-0">-</span>
                    {/* Month */}
                    {[...Array(2)].map((_, i) => (
                      <React.Fragment key={`admission-month-${i}`}>
                        <input
                          type="text"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={admissionDateRefs[i + 2]}
                          onChange={(e) => handleAdmissionDateInput(e, i + 2)}
                          onKeyDown={(e) => handleAdmissionDateKeyDown(e, i + 2)}
                          required
                        />
                      </React.Fragment>
                    ))}
                    <span className="flex-shrink-0">-</span>
                    {/* Year */}
                    {[...Array(4)].map((_, i) => (
                      <React.Fragment key={`admission-year-${i}`}>
                        <input
                          type="text"
                          className="w-8 h-8 border border-gray-400 text-center bg-transparent flex-shrink-0"
                          maxLength="1"
                          ref={admissionDateRefs[i + 4]}
                          onChange={(e) => handleAdmissionDateInput(e, i + 4)}
                          onKeyDown={(e) => handleAdmissionDateKeyDown(e, i + 4)}
                          required
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label>Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  >
                    <option value="orphan">Orphan</option>
                    <option value="poor">Poor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Child Disability */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label>Child Disability</label>
                  <select
                    name="childDisable"
                    value={formData.childDisable}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-1"
                    required
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.childDisable === 'yes' && (
                  <input
                    type="text"
                    name="childDisableDesc"
                    value={formData.childDisableDesc}
                    onChange={handleInputChange}
                    placeholder="Please provide details"
                    className="w-full border border-gray-400 p-1"
                  />
                )}
              </div>

              {/* Previous School */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label>Previous School</label>
                  <select
                    name="previewsSchool"
                    value={formData.previewsSchool}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-1"
                    required
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.previewsSchool === 'yes' && (
                  <input
                    type="text"
                    name="previewsSchoolDesc"
                    value={formData.previewsSchoolDesc}
                    onChange={handleInputChange}
                    placeholder="Please provide school details"
                    className="w-full border border-gray-400 p-1"
                  />
                )}
              </div>

              {/* Guardian Information Fields */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">Guardian CNIC</label>
                  <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                    {[...Array(13)].map((_, i) => (
                      <React.Fragment key={`guardian-cnic-${i}`}>
                        <input
                          type="text"
                          className="w-8 h-8 border border-gray-400 text-center flex-shrink-0"
                          maxLength="1"
                          ref={guardianCnicRefs[i]}
                          onChange={(e) => handleCnicInput(e, i, guardianCnicRefs, 'guardian')}
                          onKeyDown={(e) => handleKeyDown(e, guardianCnicRefs, i)}
                        />
                        {(i === 4 || i === 11) && <span className="flex-shrink-0">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">Relation with Child</label>
                  <input
                    type="text"
                    name="relationWithChild"
                    value={formData.relationWithChild}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">Contact Number</label>
                  <input
                    type="text"
                    name="relationContact"
                    value={formData.relationContact}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="min-w-[150px]">Guardian Address</label>
                  <input
                    type="text"
                    name="guardianAddress"
                    value={formData.guardianAddress}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full md:flex-1 p-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Photo Upload */}
            <div className="space-y-4">
              <div>
                <div className="border-2 border-dashed border-gray-400 h-48 relative mb-2">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Child" className="w-full h-full object-contain"/>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-[#B91C1C] text-sm text-center px-2">
                        Paste one recent picture of the child
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                    id="photoUpload"
                  />
                  <label 
                    htmlFor="photoUpload"
                    className="bg-[#3B82F6] text-white px-6 py-1.5 rounded text-sm cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
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

          {/* Guardian Signature */}
          <div className="p-2 md:p-4">
            <label className="block mb-2">Guardian Signature</label>
            <div className="w-full md:w-1/2 border-2 border-dashed border-gray-400 h-24">
              <SignaturePad
                ref={guardianSignatureRef}
                canvasProps={{
                  className: "w-full h-full"
                }}
              />
            </div>
            <button
              type="button"
              className="text-sm text-blue-500 mt-2"
              onClick={clearSignature}
            >
              Clear
            </button>
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
        <Toaster />
      </div>
    </div>
  );
};

export default StudentForm;