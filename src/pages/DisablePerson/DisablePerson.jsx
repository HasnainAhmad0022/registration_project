import React, { useRef } from 'react';
import backgroundlogo from '../../images/backgroundlogo.png';

const DisablePerson = () => {
  // Create refs for each box
  const dateRefs = Array(8).fill(0).map(() => useRef(null));
  const cnicRefs = Array(13).fill(0).map(() => useRef(null));

  const handleDateInput = (e, index) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = '';
      return;
    }
    if (value.length === 1 && index < 7) {
      dateRefs[index + 1].current.focus();
    }
  };

  const handleCnicInput = (e, index) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = '';
      return;
    }
    if (value.length === 1 && index < 12) {
      cnicRefs[index + 1].current.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, refs, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  return (
    <div className="p-3 rounded-lg bg-white">
      <div className="max-w-5xl mx-auto p-6 bg-gray-100 relative border border-gray-300">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <img 
            src={backgroundlogo} 
            alt="Watermark" 
            className="w-[700px] h-[700px] object-contain"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-full flex justify-between items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center">
              <img src={backgroundlogo} alt="Emblem" className="w-12 h-12" />
            </div>
            <div className='text-center'>
              <h1 className="text-3xl font-bold">GOVERNMENT OF KHYBER PAKHTUNKHWA</h1>
              <p className="text-xl">(PROVINCIAL COUNCIL FOR THE REHABILITATION OF DISABLED PERSON)</p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center">
              <img src={backgroundlogo} alt="Emblem" className="w-12 h-12" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-6 mt-10">APPLICATION FORM FOR DISABILITY CERTIFICATE</h2>

        <form className="space-y-4 relative z-10">
          {/* Date and Registration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[10px]">Date</label>
              <div className="flex items-center gap-1">
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
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Registration No DO/SW/CHD</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
          </div>

          {/* Name and Father Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Name</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Father Name</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
          </div>

          {/* Marital Status and Spouse */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Married / Unmarried</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Spouse</label>
              <div className="w-full">
                <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                <span className="text-xs text-gray-500">(Please write wife name or husband name)</span>
              </div>
            </div>
          </div>

          {/* CNIC and Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[20px]">CNIC</label>
              <div className="flex items-center gap-1">
                {[...Array(13)].map((_, i) => (
                  <React.Fragment key={`cnic-${i}`}>
                    <input 
                      type="text" 
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
            <div className="flex items-center gap-4 ml-10">
              <label className="block text-sm whitespace-nowrap min-w-[100px]">Date of Birth</label>
              <div className="w-full">
                <input type="date" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                <span className="text-xs text-gray-500">(Please attach Birth Certificate or Form-B photocopy)</span>
              </div>
            </div>
          </div>
                    {/* Qualification and Type of Disability */}
                    <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Qualification</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Type of Disability</label>
              <div className="w-full">
                <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                <span className="text-xs text-gray-500">Physically / Visually / Deaf-mute / Mentally</span>
              </div>
            </div>
          </div>

          {/* Name and Cause of Disability */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Name of Disability</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Cause of Disability</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
          </div>

          {/* Job and Income */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Type of Job can do</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Source of Income</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
          </div>

          {/* Applied for and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Applied for</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Phone Number</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
          </div>

          {/* Address fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Present Address</label>
              <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm whitespace-nowrap min-w-[150px]">Permanent Address</label>
              <div className="w-full">
                <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                <span className="text-xs text-gray-500 block mt-1">
                  (If address is not in CNIC please submit an affidavit on stamp paper that Disabled Certificate is not gain in any other district/province)
                </span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-8">
            <div className="text-right">
              <div className="h-20 w-48 border-b border-gray-400 mb-2 ml-auto"></div>
              <p className="text-sm">Signature of Applicant</p>
            </div>
          </div>

          {/* Assessment Board Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold">RECOMMENDATION OF THE ASSESSMENT BOARD</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">Applicant is declared</label>
                <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" placeholder="Disabled/Not disabled" />
              </div>

              <div className="flex items-center gap-4">
                <label className="block text-sm whitespace-nowrap min-w-[150px]">Disability / Impairment</label>
                <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="block text-sm whitespace-nowrap min-w-[150px]">Fit to work/not fit to work</label>
                  <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="block text-sm whitespace-nowrap min-w-[150px]">Type of Advised (Optional)</label>
                  <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="block text-sm whitespace-nowrap min-w-[150px]">Referred to</label>
                  <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="block text-sm whitespace-nowrap min-w-[150px]">Recommendation</label>
                  <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="block text-sm whitespace-nowrap min-w-[50px]">1.</label>
                  <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="block text-sm whitespace-nowrap min-w-[50px]">2.</label>
                  <input type="text" className="w-full h-8 border border-gray-400 px-2 bg-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Board Signatures Section */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">SIGNATURE OF THE MEMBERS OF THE BOARD</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="h-20 border-b border-gray-400 mb-2"></div>
                <p className="font-bold">MEDICAL SUPERINTENDENT/CHAIRMAN</p>
                <p className="text-sm">DISTRICT ASSESSMENT BOARD</p>
                <p className="text-xs text-gray-600">DISTRICT HEADQUARTER HOSPITAL CHARSADDA</p>
              </div>
              <div className="text-center">
                <div className="h-20 border-b border-gray-400 mb-2"></div>
                <p className="font-bold">DISTRICT OFFICER/SECRETARY</p>
                <p className="text-sm">DISTRICT ASSESSMENT BOARD</p>
                <p className="text-xs text-gray-600">SOCIAL WELFARE DEPARTMENT CHARSADDA</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="h-20 border-b border-gray-400 mb-2"></div>
                <p className="font-bold">MANAGER</p>
                <p className="text-sm">Employment Exchange Charsadda / Member</p>
              </div>
              <div className="text-center">
                <div className="h-20 border-b border-gray-400 mb-2"></div>
                <p className="font-bold">Concerned Specialist</p>
                <p className="text-sm">Member</p>
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
    </div>
  );
};

export default DisablePerson;