import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import backgroundlogo from "../../images/backgroundlogo.png";
import userRequest from "../../utils/userRequest/userRequest";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { Images } from "../../utils/ImagesConfig";

const DisablePerson = () => {
  // Create refs for each box
  const dateRefs = Array(8)
  .fill(0)
  .map(() => useRef(null));
  const cnicRefs = Array(13)
    .fill(0)
    .map(() => useRef(null));
    const applicantSignatureRef = useRef();
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    // console.log(userData);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
  const [cnicBackPreview, setCnicBackPreview] = useState(null);

  const initialFormState = {
    submittionDate: '',
    registrationNo: '',
    childName: '',
    fatherName: '',
    status: '',
    spouse: '',
    cnicNo: '',
    dateOfBirth: '',
    qulafication: '',
    typeOfDisability: '',
    nameOfDisability: '',
    causeOfDisability: '',
    TypeOfJob: '',
    sourceOfIncome: '',
    appliedFor: '',
    phoneNo: '',
    presentAddress: '',
    permanentAddress: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const dobRefs = Array(8).fill(0).map(() => useRef(null));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 7) {
      dateRefs[index + 1].current.focus();
    }

    // Update submittionDate in formData
    const allDateInputs = dateRefs.map((ref) => ref.current.value);
    allDateInputs[index] = value;
    const dateString = `${allDateInputs[0]}${allDateInputs[1]}-${allDateInputs[2]}${allDateInputs[3]}-${allDateInputs[4]}${allDateInputs[5]}${allDateInputs[6]}${allDateInputs[7]}`;
    setFormData((prev) => ({ ...prev, submittionDate: dateString }));
  };

  const handleCnicInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 12) {
      cnicRefs[index + 1].current.focus();
    }

    // Update CNIC in formData
    const allCnicInputs = cnicRefs.map((ref) => ref.current.value);
    allCnicInputs[index] = value;
    // Format CNIC with hyphens: XXXXX-XXXXXXX-X
    const cnicString = `${allCnicInputs.slice(0, 5).join("")}-${allCnicInputs
      .slice(5, 12)
      .join("")}-${allCnicInputs[12] || ""}`;
    setFormData((prev) => ({ ...prev, cnicNo: cnicString }));
  };

  const handleKeyDown = (e, refs, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const clearSignature = () => {
    applicantSignatureRef.current.clear();
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        switch(field) {
          case 'cnicFrontPic':
            setCnicFrontPreview(reader.result);
            setCnicFrontFile(file);
            break;
          case 'cnicBackPic':
            setCnicBackPreview(reader.result);
            setCnicBackFile(file);
            break;
          default:
            break;
        }
      };
      reader.readAsDataURL(file);
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
      setFormData(prev => ({ ...prev, dateOfBirth: dateString }));
    }
  };

  const handleDobKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      dobRefs[index - 1].current.focus();
    }
  };

  // Update handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Handle applicant signature
      if (applicantSignatureRef.current && !applicantSignatureRef.current.isEmpty()) {
        const signatureDataURL = applicantSignatureRef.current.toDataURL();
        const response = await fetch(signatureDataURL);
        const blob = await response.blob();
        const signatureFile = new File([blob], "signatureApplicant.png", {
          type: "image/png",
        });
        submitData.append("signatureApplicant", signatureFile);
      }

      // Append CNIC images
      if (cnicFrontFile) {
        submitData.append("cnicFrontPic", cnicFrontFile);
      }
      if (cnicBackFile) {
        submitData.append("cnicBackPic", cnicBackFile);
      }

      // Add userId
      submitData.append("userId", userData?.data?.user?._id);

      // Submit the form
      const response = await userRequest.post(
        "/disable/add-new-disable",
        submitData
      );
      // console.log("Success:", response.data);
      toast.success(
        response?.data?.message || "Application submitted successfully"
      );

      // Clear the form
      setFormData(initialFormState);

      // Clear the signature
      if (applicantSignatureRef.current) {
        applicantSignatureRef.current.clear();
      }

      // Clear date inputs
      dateRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });

      // Clear CNIC inputs
      cnicRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });

      setLoading(false);
      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/home-page');
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Application submission failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loader />}
      <Navbar />
      <div className="rounded-lg bg-gray-100">
        <div className="max-w-6xl mx-auto p-2 md:p-6 bg-white relative border border-gray-300">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src={Images.logo}
              alt="Watermark"
              className="w-[700px] h-[700px] object-contain"
            />
          </div>

          {/* Header Banner */}
          <div className="rounded-lg p-1 bg-white">
            <div className="relative">
              {/* Green banner with curved edges */}
              <div className="bg-[#004F25] text-white relative">
                {/* Light green accent on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#90CE5F] rounded-r-lg"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#90CE5F] rounded-l-lg"></div>

                <div className="flex items-center justify-between px-8 py-0">
                  {/* Left logo */}
                  <div className="w-32 h-24 bg-white p-2 rounded-lg">
                    <img
                      src={Images.logo}
                      alt="Help System Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Center text */}
                  <div className="text-center space-y-1">
                    <h1 className="text-4xl font-extrabold">HELP SYSTEM</h1>
                    <h2 className="text-2xl font-bold">KHYBER PUKHTUNKHWA</h2>
                    <p className="text-xl font-semibold">
                      Voluntary Social Welfare Organization
                    </p>
                    <p className="text-xl font-semibold">
                      Health Education Livelihood & Peace for All
                    </p>
                  </div>

                  {/* Right QR code */}
                  <div className="w-32 h-24 bg-white p-2 rounded-lg">
                    <img
                      src={Images.logo2}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Membership Form Button */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Green pill background */}
                  <div className="absolute inset-0 bg-[#90CE5F] rounded-full -z-10 transform scale-x-125"></div>
                  <div className="bg-[#004F25] text-white px-12 py-2 rounded-lg font-bold text-xl">
                    Disable Person Form
                  </div>
                </div>
              </div>
            </div>

            {/* Membership ID */}
            <div className="text-right mt-16 mr-4 font-semibold">
              DISABLE PERSON ID: _____________
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-6 mt-10">
            APPLICATION FORM FOR DISABLE PERSON
          </h2>

          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            {/* Date and Registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[10px]">
                  Date
                </label>
                <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto">
                  {[...Array(8)].map((_, i) => (
                    <React.Fragment key={`date-${i}`}>
                      <input
                        type="text"
                        className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                        maxLength="1"
                        ref={dateRefs[i]}
                        onChange={(e) => handleDateInput(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, dateRefs, i)}
                      />
                      {(i === 1 || i === 3) && <span>-</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap">
                  Registration No DO/SW/CHD
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                  name="registrationNo"
                />
              </div>
            </div>

            {/* Name and Father Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap ">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.childName}
                  onChange={handleInputChange}
                  name="childName"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Father Name
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  name="fatherName"
                />
              </div>
            </div>

            {/* Marital Status and Spouse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Marital Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="married"
                      checked={formData.status === "married"}
                      onChange={handleInputChange}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-sm">Married</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="unmarried"
                      checked={formData.status === "unmarried"}
                      onChange={handleInputChange}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-sm">Unmarried</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Spouse
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                    value={formData.spouse}
                    onChange={handleInputChange}
                    name="spouse"
                  />
                  <span className="text-xs text-gray-500">
                    (Please write wife name or husband name)
                  </span>
                </div>
              </div>
            </div>

            {/* CNIC and Date of Birth */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[20px]">
               Person CNIC
              </label>
              <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {[...Array(13)].map((_, i) => (
                  <React.Fragment key={`cnic-${i}`}>
                    <input
                      type="number"
                      className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                      maxLength="1"
                      ref={cnicRefs[i]}
                      onChange={(e) => handleCnicInput(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, cnicRefs, i)}
                    />
                    {(i === 4 || i === 11) && <span>-</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[100px]">
                Date of Birth
              </label>
              <div className="flex gap-1 items-center">
                {/* Day */}
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={`dob-day-${i}`}>
                    <input
                      type="text"
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
                      type="text"
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
                      type="text"
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
            {/* Qualification and Type of Disability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Qualification
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.qulafication}
                  onChange={handleInputChange}
                  name="qulafication"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Type of Disability
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                    value={formData.typeOfDisability}
                    onChange={handleInputChange}
                    name="typeOfDisability"
                  />
                  <span className="text-xs text-gray-500">
                    Physically / Visually / Deaf-mute / Mentally
                  </span>
                </div>
              </div>
            </div>

            {/* Name and Cause of Disability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Name of Disability
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.nameOfDisability}
                  onChange={handleInputChange}
                  name="nameOfDisability"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Cause of Disability
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.causeOfDisability}
                  onChange={handleInputChange}
                  name="causeOfDisability"
                />
              </div>
            </div>

            {/* Job and Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Type of Job can do
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.TypeOfJob}
                  onChange={handleInputChange}
                  name="TypeOfJob"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Source of Income
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.sourceOfIncome}
                  onChange={handleInputChange}
                  name="sourceOfIncome"
                />
              </div>
            </div>

            {/* Applied for and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Applied for
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.appliedFor}
                  onChange={handleInputChange}
                  name="appliedFor"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  name="phoneNo"
                />
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Present Address
                </label>
                <input
                  type="text"
                  className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                  value={formData.presentAddress}
                  onChange={handleInputChange}
                  name="presentAddress"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">
                  Permanent Address
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full h-8 border border-gray-400 px-2 bg-transparent"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    name="permanentAddress"
                  />
                  <span className="text-xs text-gray-500 block mt-1">
                    (If address is not in CNIC please submit an affidavit on
                    stamp paper that Disabled Certificate is not gain in any
                    other district/province)
                  </span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="p-4">
              <label className="block mb-2">Applicant Signature</label>
              <div className="w-full md:w-1/2 border-2 border-dashed border-gray-400 h-24">
                <SignaturePad
                  ref={applicantSignatureRef}
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

            

            {/* CNIC Images Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Front CNIC */}
              <div className="w-full">
                <label className="block mb-2">Disable Person CNIC Front Image</label>
                <div className="border-2 border-dashed border-gray-400 h-48 relative mb-2 w-full">
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
              <div className="w-full">
                <label className="block mb-2">Disable Person CNIC Back Image</label>
                <div className="border-2 border-dashed border-gray-400 h-48 relative mb-2 w-full">
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
            <div className="mt-8 flex justify-center md:justify-end px-4">
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

export default DisablePerson;
