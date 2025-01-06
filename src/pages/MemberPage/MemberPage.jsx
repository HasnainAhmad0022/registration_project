import React, { useRef } from "react";
import backgroundlogo from "../../images/backgroundlogo.png";

const MemberPage = () => {
  // Create refs for CNIC inputs
  const cnicRefs = Array(13)
    .fill(0)
    .map(() => useRef(null));
  const fatherCnicRefs = Array(13)
    .fill(0)
    .map(() => useRef(null));

  const handleCnicInput = (e, index, refs) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1 && index < 12) {
      refs[index + 1].current.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, refs, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  return (
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
        {/* Header Banner */}
        <div className="rounded-lg p-1 bg-white">
          <div className="relative">
            {/* Green banner with curved edges */}
            <div className="bg-[#004F25] text-white relative">
              {/* Light green accent on edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#90CE5F] rounded-l-lg"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#90CE5F] rounded-r-lg"></div>

              <div className="flex items-center justify-between px-8 py-0">
                {/* Left logo */}
                <div className="w-32 h-24 bg-white p-2 rounded-lg">
                  <img
                    src={backgroundlogo}
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
                    src={backgroundlogo}
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
                  Membership Form
                </div>
              </div>
            </div>
          </div>

          {/* Membership ID */}
          <div className="text-right mt-16 mr-4 font-semibold">
            MEMBERSHIP ID: _____________
          </div>
        </div>

        <form className="space-y-6">
          {/* 1. Personal Details */}
          <div className="space-y-4">
            <h4 className="font-bold">1. Personal Details</h4>

            {/* Name and CNIC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label>Full Name</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-1">
                <label>CNIC</label>
                {[...Array(13)].map((_, i) => (
                  <React.Fragment key={`cnic-${i}`}>
                    <input
                      type="text"
                      className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                      maxLength="1"
                      ref={cnicRefs[i]}
                      onChange={(e) => handleCnicInput(e, i, cnicRefs)}
                      onKeyDown={(e) => handleKeyDown(e, cnicRefs, i)}
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
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>CNIC</label>
                <div className="flex items-center gap-1">
                  {[...Array(13)].map((_, i) => (
                    <React.Fragment key={`father-cnic-${i}`}>
                      <input
                        type="text"
                        className="w-8 h-8 border border-gray-400 text-center bg-transparent"
                        maxLength="1"
                        ref={fatherCnicRefs[i]}
                        onChange={(e) => handleCnicInput(e, i, fatherCnicRefs)}
                        onKeyDown={(e) => handleKeyDown(e, fatherCnicRefs, i)}
                      />
                      {(i === 4 || i === 11) && <span>-</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="flex items-center gap-4">
              <label>Date of Birth</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Month"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
                <input
                  type="text"
                  placeholder="Day"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
                <input
                  type="text"
                  placeholder="Year"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <label>Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Male
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Female
                </label>
              </div>
            </div>

            {/* Marital Status */}
            <div className="flex items-center gap-4">
              <label>Marital Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Single
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Married
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Divorced
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Widow
                </label>
              </div>
            </div>

            {/* Nationality and Religion */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label>Nationality</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Pakistani
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Other
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label>Religion</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Muslim
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Other
                  </label>
                </div>
              </div>
            </div>

            {/* Tehsil, District, Blood Group */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <label>Tehsil</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>District</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>Blood Group</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
            </div>

            {/* Qualification and Profession */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label>Qualification</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>Profession</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label>Current Address</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>Permanent Address</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
            </div>

            {/* Contact Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label>Contact Number</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>Alternate Mobile Number</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-400 bg-transparent p-1"
                />
              </div>
            </div>

            {/* Type of Accommodation */}
            <div className="flex items-center gap-4">
              <label>Type of Accommodation</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Rented
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Own
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" /> Living with Others
                </label>
              </div>
            </div>
          </div>

          {/* 2. Family Details */}
          <div className="space-y-4">
            <h4 className="font-bold">2. Family Details</h4>

            {/* Numbers Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <label>1. No. of Dependents</label>
                <input
                  type="text"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>2. No. of Children</label>
                <input
                  type="text"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>3. No. of Male Children</label>
                <input
                  type="text"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>4. No. of Female Children</label>
                <input
                  type="text"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>5. No. of School going children</label>
                <input
                  type="text"
                  className="w-16 border border-gray-400 bg-transparent p-1"
                />
              </div>
            </div>

            {/* Children Details Table */}
            <div>
              <h5>6. Names & Ages of Children (studying in school)</h5>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((tableNum) => (
                  <table
                    key={tableNum}
                    className="w-full border-collapse border border-gray-400 bg-transparent"
                  >
                    <thead>
                      <tr>
                        <th className="border border-gray-400 bg-transparent p-1">
                          Name
                        </th>
                        <th className="border border-gray-400 bg-transparent p-1">
                          Age
                        </th>
                        <th className="border border-gray-400 bg-transparent p-1">
                          Class
                        </th>
                        <th className="border border-gray-400 bg-transparent p-1">
                          School
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td className="border border-gray-400 bg-transparent p-1">
                            <input type="text" className="w-full" />
                          </td>
                          <td className="border border-gray-400 bg-transparent p-1">
                            <input type="text" className="w-full" />
                          </td>
                          <td className="border border-gray-400 bg-transparent p-1">
                            <input type="text" className="w-full" />
                          </td>
                          <td className="border border-gray-400 bg-transparent p-1">
                            <input type="text" className="w-full" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            </div>

            {/* Additional Questions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label>7. Any Family Member is Drugs Addicted</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> No
                  </label>
                </div>
              </div>
              <div className="pl-4">
                <label>If yes, please mention full details</label>
                <input
                  type="text"
                  className="w-full border border-gray-400 bg-transparent p-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <label>8. Disease in family</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> No
                  </label>
                </div>
              </div>
              <div className="pl-4">
                <label>
                  If yes, please mention full details and attach the doctor's
                  reports & documents also.
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 bg-transparent p-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <label>9. Political Affiliation</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> No
                  </label>
                </div>
              </div>
              <div className="pl-4">
                <label>
                  If yes, please mention political party name and your
                  designation in it.
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 bg-transparent p-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <label>10. Registered with any other NGO/Organization</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> No
                  </label>
                </div>
              </div>
              <div className="pl-4">
                <label>
                  If yes, please mention details and reason of registration.
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 bg-transparent p-1"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#004225] text-white px-8 py-2 rounded hover:bg-[#003219]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberPage;
