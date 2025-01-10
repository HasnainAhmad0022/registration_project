import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import userRequest from "../../utils/userRequest/userRequest";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";

const StudentForm = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  // Create refs for CNIC inputs
  const fatherCnicRefs = Array(13).fill(0).map(() => useRef(null));
  const motherCnicRefs = Array(13).fill(0).map(() => useRef(null));
  const guardianCnicRefs = Array(13).fill(0).map(() => useRef(null));

  // Create refs for signatures
  const guardianSignatureRef = useRef();
  const applicantSignaturePerCnicRef = useRef();
  const applicantSignatureCurrentRef = useRef();
  const fswSignatureRef = useRef();
  const fsSignatureRef = useRef();
  const pdSignatureRef = useRef();
  const chairmanSignatureRef = useRef();

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
    childThumbPrint: null,
    productIds: ["6774f473c376018514985ee2"],
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    totalAge: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCnicInput = (e, index, refs, type) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 12) {
      refs[index + 1].current.focus();
    }

    const allCnicInputs = refs.map(ref => ref.current.value);
    allCnicInputs[index] = value;
    const cnicString = `${allCnicInputs.slice(0,5).join('')}-${allCnicInputs.slice(5,12).join('')}-${allCnicInputs[12] || ''}`;
    
    switch(type) {
      case 'father':
        setFormData(prev => ({ ...prev, fatherCnic: cnicString }));
        break;
      case 'mother':
        setFormData(prev => ({ ...prev, motherCnic: cnicString }));
        break;
      case 'guardian':
        setFormData(prev => ({ ...prev, guardianCnic: cnicString }));
        break;
      default:
        break;
    }
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
        if (field === 'image') {
          setPhotoPreview(reader.result);
        } else if (field === 'childThumbPrint') {
          setThumbPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const clearSignature = (ref) => {
    if (ref.current) {
      ref.current.clear();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'dataOfBirth') {
          // Ensure date is sent as a single string
          submitData.append('dataOfBirth', value.toString());
        } else if (typeof value === 'string' || Array.isArray(value)) {
          submitData.append(key, value);
        }
      });
      
      // Append files
      if (formData.image) submitData.append('image', formData.image);
      if (formData.childThumbPrint) submitData.append('childThumbPrint', formData.childThumbPrint);

      // Handle signature pads
      if (guardianSignatureRef.current && !guardianSignatureRef.current.isEmpty()) {
        const signatureDataURL = guardianSignatureRef.current.toDataURL();
        const response = await fetch(signatureDataURL);
        const blob = await response.blob();
        submitData.append('guardianSignature', new File([blob], 'guardianSignature.png', { type: 'image/png' }));
      }

      if (applicantSignaturePerCnicRef.current && !applicantSignaturePerCnicRef.current.isEmpty()) {
        const signatureDataURL = applicantSignaturePerCnicRef.current.toDataURL();
        const response = await fetch(signatureDataURL);
        const blob = await response.blob();
        submitData.append('applicationSignaturePerCnic', new File([blob], 'applicationSignaturePerCnic.png', { type: 'image/png' }));
      }

      if (applicantSignatureCurrentRef.current && !applicantSignatureCurrentRef.current.isEmpty()) {
        const signatureDataURL = applicantSignatureCurrentRef.current.toDataURL();
        const response = await fetch(signatureDataURL);
        const blob = await response.blob();
        submitData.append('applicationSignatureCurrent', new File([blob], 'applicationSignatureCurrent.png', { type: 'image/png' }));
      }

      // Add userId
      submitData.append('userId', userData?.data?.user?._id);

      const response = await userRequest.post("/school/addnewschool", submitData);
      toast.success(response?.data?.message || "Student added successfully");

      // Clear form and signatures
      setFormData(initialFormState);
      setPhotoPreview(null);
      setThumbPreview(null);
      clearSignature(guardianSignatureRef);
      clearSignature(applicantSignaturePerCnicRef);
      clearSignature(applicantSignatureCurrentRef);

      // Navigate after success
      setTimeout(() => {
        navigate('/home-page');
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      toast.error(err?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg mt-3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 3. Orphans/Child Labor School Admission Form */}
          <div className="space-y-4">
            <div className="bg-green-800 text-white px-2 py-1">
              <h4>3. Orphans/Child Labor School Admission Form</h4>
            </div>

            <div className="grid grid-cols-[1fr_200px] gap-8 p-4">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">Child Name</label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      className="border border-gray-400 flex-1 p-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">Father Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="border border-gray-400 flex-1 p-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">CNIC</label>
                    <div className="flex gap-1">
                      {[...Array(13)].map((_, i) => (
                        <React.Fragment key={`father-cnic-${i}`}>
                          <input
                            type="text"
                            className="w-8 h-8 border border-gray-400 text-center"
                            maxLength="1"
                            ref={fatherCnicRefs[i]}
                            onChange={(e) => handleCnicInput(e, i, fatherCnicRefs, 'father')}
                            onKeyDown={(e) => handleKeyDown(e, fatherCnicRefs, i)}
                          />
                          {(i === 4 || i === 11) && <span>-</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">Mother Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="border border-gray-400 flex-1 p-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">Mother CNIC</label>
                    <div className="flex gap-1">
                      {[...Array(13)].map((_, i) => (
                        <React.Fragment key={`mother-cnic-${i}`}>
                          <input
                            type="text"
                            className="w-8 h-8 border border-gray-400 text-center"
                            maxLength="1"
                            ref={motherCnicRefs[i]}
                            onChange={(e) => handleCnicInput(e, i, motherCnicRefs, 'mother')}
                            onKeyDown={(e) => handleKeyDown(e, motherCnicRefs, i)}
                          />
                          {(i === 4 || i === 11) && <span>-</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">Date of Birth</label>
                    <input
                      type="date"
                      name="dataOfBirth"
                      value={formData.dataOfBirth}
                      onChange={handleInputChange}
                      className="border border-gray-400 p-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="min-w-[100px]">Total Age</label>
                    <input
                      type="text"
                      name="totalAge"
                      value={formData.totalAge}
                      onChange={handleInputChange}
                      className="border border-gray-400 w-20 p-1"
                      required
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2 items-center">
                    <label>Blood Group</label>
                    <input
                      type="text"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="border border-gray-400 w-20 p-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label>Position</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="border border-gray-400 p-1"
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
              </div>

              {/* Right Column - Photo Upload */}
              <div>
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-48 relative mb-2">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Child" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-[#B91C1C] text-sm text-center">
                          Paste one recent picture of the
                        </p>
                        <p className="text-[#B91C1C] text-sm text-center">
                          child
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

            {/* School Details */}
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex gap-2 items-center">
                <label>School Admitted in</label>
                <input
                  type="text"
                  name="schoolAdmittedIn"
                  value={formData.schoolAdmittedIn}
                  onChange={handleInputChange}
                  className="border border-gray-400 flex-1 p-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2 items-center">
                  <label>Class</label>
                  <input
                    type="text"
                    name="schoolclass"
                    value={formData.schoolclass}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-20 p-1"
                    required
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label>Date of Admission</label>
                  <input
                    type="date"
                    name="DateOfAdmission"
                    value={formData.DateOfAdmission}
                    onChange={handleInputChange}
                    className="border border-gray-400 flex-1 p-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Guardian Details */}
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex gap-2 items-center">
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  className="border border-gray-400 flex-1 p-1"
                  required
                />
              </div>
              <div className="flex gap-2 items-center">
                <label>CNIC</label>
                <div className="flex gap-1">
                  {[...Array(13)].map((_, i) => (
                    <React.Fragment key={`guardian-cnic-${i}`}>
                      <input
                        type="text"
                        className="w-8 h-8 border border-gray-400 text-center"
                        maxLength="1"
                        ref={guardianCnicRefs[i]}
                        onChange={(e) => handleCnicInput(e, i, guardianCnicRefs, 'guardian')}
                        onKeyDown={(e) => handleKeyDown(e, guardianCnicRefs, i)}
                      />
                      {(i === 4 || i === 11) && <span>-</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex gap-2 items-center">
                <label>Relation with Child</label>
                <input
                  type="text"
                  name="relationWithChild"
                  value={formData.relationWithChild}
                  onChange={handleInputChange}
                  className="border border-gray-400 flex-1 p-1"
                  required
                />
              </div>
              <div className="flex gap-2 items-center">
                <label>Contact</label>
                <input
                  type="text"
                  name="relationContact"
                  value={formData.relationContact}
                  onChange={handleInputChange}
                  className="border border-gray-400 flex-1 p-1"
                  required
                />
              </div>
            </div>

            {/* Guardian Address */}
            <div className="px-4 pb-4">
              <div className="flex gap-2 items-center">
                <label>Guardian Address</label>
                <input
                  type="text"
                  name="guardianAddress"
                  value={formData.guardianAddress}
                  onChange={handleInputChange}
                  className="border border-gray-400 flex-1 p-1"
                  required
                />
              </div>
            </div>

            {/* Signatures Section */}
            <div className="grid grid-cols-2 gap-8 p-4">
              <div>
                <label>Child Thumb Expression</label>
                <div className="border-2 border-dashed border-gray-400 h-24 mt-2 relative">
                  {thumbPreview ? (
                    <img 
                      src={thumbPreview} 
                      alt="Thumb Expression" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'childThumbPrint')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                      >
                        Upload Thumb Expression
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label>Guardian Signature</label>
                <div className="border-2 border-dashed border-gray-400 h-24">
                  <SignaturePad
                    ref={guardianSignatureRef}
                    canvasProps={{
                      className: "w-full h-full"
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-500"
                  onClick={() => clearSignature(guardianSignatureRef)}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* 4. Declaration */}
          <div className="space-y-4 mt-8">
            <div className="bg-green-800 text-white px-2 py-1">
              <h4>4. Declaration</h4>
            </div>
            
            <div className="p-4">
              <p className="text-sm mb-8">
                It is acknowledged that the details/informations in this membership/application form are correct, complete and 
                accurate to the best of knowledge and any information has not been withheld pretending to the save.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-24">
                    <SignaturePad
                      ref={applicantSignaturePerCnicRef}
                      canvasProps={{
                        className: "w-full h-full"
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={() => clearSignature(applicantSignaturePerCnicRef)}
                  >
                    Clear
                  </button>
                  <p className="text-center mt-2">Applicant Signature (as per CNIC)</p>
                </div>
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-24">
                    <SignaturePad
                      ref={applicantSignatureCurrentRef}
                      canvasProps={{
                        className: "w-full h-full"
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={() => clearSignature(applicantSignatureCurrentRef)}
                  >
                    Clear
                  </button>
                  <p className="text-center mt-2">Applicant Signature (Current)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Official Use */}
          <div className="space-y-4 mt-8">
            <div className="bg-green-800 text-white px-2 py-1">
              <h4>5. Official Use</h4>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-24">
                    <SignaturePad
                      ref={fswSignatureRef}
                      canvasProps={{
                        className: "w-full h-full"
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={() => clearSignature(fswSignatureRef)}
                  >
                    Clear
                  </button>
                  <p className="font-semibold mt-2">Signature</p>
                  <p>Field Survey Worker (FSW)</p>
                  <p>HELP System Khyber Pukhtunkhwa</p>
                </div>
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-24">
                    <SignaturePad
                      ref={fsSignatureRef}
                      canvasProps={{
                        className: "w-full h-full"
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={() => clearSignature(fsSignatureRef)}
                  >
                    Clear
                  </button>
                  <p className="font-semibold mt-2">Signature</p>
                  <p>Field Supervisor (FS)</p>
                  <p>HELP System Khyber Pukhtunkhwa</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-24">
                    <SignaturePad
                      ref={pdSignatureRef}
                      canvasProps={{
                        className: "w-full h-full"
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={() => clearSignature(pdSignatureRef)}
                  >
                    Clear
                  </button>
                  <p className="font-semibold mt-2">Signature</p>
                  <p>GS/Project Director (PD)</p>
                  <p>HELP System Khyber Pukhtunkhwa</p>
                </div>
                <div>
                  <div className="border-2 border-dashed border-gray-400 h-24">
                    <SignaturePad
                      ref={chairmanSignatureRef}
                      canvasProps={{
                        className: "w-full h-full"
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={() => clearSignature(chairmanSignatureRef)}
                  >
                    Clear
                  </button>
                  <p className="font-semibold mt-2">Signature</p>
                  <p>Chairman</p>
                  <p>HELP System Khyber Pukhtunkhwa</p>
                  <div className="flex items-center gap-2 mt-2">
                    <label>Date</label>
                    <input
                      type="date"
                      name="chairmanDate"
                      value={formData.chairmanDate}
                      onChange={handleInputChange}
                      className="border border-gray-400 w-32 p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600 font-semibold"
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