import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundlogo from "../../images/backgroundlogo.png";
import Navbar from "../../components/Navbar/Navbar";
import userRequest from "../../utils/userRequest/userRequest";
import toast, { Toaster } from "react-hot-toast";

const MemberPage = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  // Create refs for CNIC inputs
  const cnicRefs = Array(13).fill(0).map(() => useRef(null));
  const fatherCnicRefs = Array(13).fill(0).map(() => useRef(null));

  const initialFormState = {
    childName: "",
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
    NGODescription: ""
  };

  const [formData, setFormData] = useState(initialFormState);

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
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 12) {
      refs[index + 1].current.focus();
    }

    // Update CNIC in formData
    const allCnicInputs = refs.map(ref => ref.current.value);
    allCnicInputs[index] = value;
    const cnicString = `${allCnicInputs.slice(0,5).join('')}-${allCnicInputs.slice(5,12).join('')}-${allCnicInputs[12] || ''}`;
    
    if (type === 'primary') {
      setFormData(prev => ({ ...prev, cnicNo: cnicString }));
    } else {
      setFormData(prev => ({ ...prev, relationCnic: cnicString }));
    }
  };

  const handleKeyDown = (e, refs, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        userId: userData?.data?.user?._id
      };

      const response = await userRequest.post("/member/addnewmember", submitData);
      
      toast.success(response?.data?.message || "Member added successfully");
      
      // Clear form
      setFormData(initialFormState);
      
      // Clear CNIC inputs
      cnicRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      fatherCnicRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });

      // Navigate to home page after delay
      setTimeout(() => {
        navigate('/home-page');
      }, 1500);

    } catch (err) {
      console.error("Error:", err);
      toast.error(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to add member"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-3 rounded-lg bg-gray-100">
        <div className="max-w-6xl mx-auto p-6 relative bg-white">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src={backgroundlogo}
              alt="Watermark"
              className="w-[700px] h-[700px] object-contain"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Details */}
            <div className="space-y-4">
              <h4 className="font-bold">1. Personal Details</h4>

              {/* Name and CNIC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                {/* CNIC Input */}
                <div className="flex items-center gap-1">
                  <label>CNIC</label>
                  {[...Array(13)].map((_, i) => (
                    <React.Fragment key={`cnic-${i}`}>
                      <input
                        type="text"
                        className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                        maxLength="1"
                        ref={cnicRefs[i]}
                        onChange={(e) => handleCnicInput(e, i, cnicRefs, 'primary')}
                        onKeyDown={(e) => handleKeyDown(e, cnicRefs, i)}
                        required
                      />
                      {(i === 4 || i === 11) && <span>-</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Father/Husband and CNIC */}
              <div className="grid grid-cols-2 gap-4">
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
                </div>
                {/* Father/Relation CNIC Input */}
                <div className="flex items-center gap-1">
                  <label>CNIC</label>
                  {[...Array(13)].map((_, i) => (
                    <React.Fragment key={`father-cnic-${i}`}>
                      <input
                        type="text"
                        className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                        maxLength="1"
                        ref={fatherCnicRefs[i]}
                        onChange={(e) => handleCnicInput(e, i, fatherCnicRefs, 'relation')}
                        onKeyDown={(e) => handleKeyDown(e, fatherCnicRefs, i)}
                        required
                      />
                      {(i === 4 || i === 11) && <span>-</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Date of Birth and Gender */}
              <div className="flex items-center gap-4">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="border border-gray-400 bg-transparent p-1"
                  required
                />
                <label>Gender</label>
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

              {/* Marital Status */}
              <div className="flex items-center gap-4">
                <label>Marital Status</label>
                <div className="flex gap-4">
                  {["single", "married", "divorced", "widow"].map((status) => (
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

              {/* Nationality and Religion */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label>Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
              </div>

              {/* Tehsil, District, Blood Group */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <label>Tehsil</label>
                  <input
                    type="text"
                    name="tehsil"
                    value={formData.tehsil}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
              </div>
                            {/* Qualification and Profession */}
                            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label>Current Address</label>
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Permanent Address</label>
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Alternative Contact</label>
                  <input
                    type="text"
                    name="contactNumber2"
                    value={formData.contactNumber2}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                  />
                </div>
              </div>

              {/* Accommodation and Dependents */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label>Type of Accommodation</label>
                  <select
                    name="TypeOfAccommodation"
                    value={formData.TypeOfAccommodation}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="owned">Owned</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label>Number of Dependents</label>
                  <input
                    type="number"
                    name="noOfDependents"
                    value={formData.noOfDependents}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
              </div>

              {/* Children Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label>Total Children</label>
                  <input
                    type="number"
                    name="noOfChildren"
                    value={formData.noOfChildren}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Children in School</label>
                  <input
                    type="number"
                    name="noOfChildrenInSchool"
                    value={formData.noOfChildrenInSchool}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Male Children</label>
                  <input
                    type="number"
                    name="noOfChildrenMale"
                    value={formData.noOfChildrenMale}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-400 bg-transparent p-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Female Children</label>
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
                <h4 className="font-semibold">Children's School Details</h4>
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
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default MemberPage;