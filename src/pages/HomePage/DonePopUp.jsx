import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import userRequest from '../../utils/userRequest/userRequest';
import toast, { Toaster } from 'react-hot-toast';

const DonePopUp = ({ isOpen, onClose, rowData, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProofImage(file);
    }
  };

  const startCamera = () => {
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          setProofImage(file);
          setShowCamera(false);
        });
    }
  };

  const handleSubmit = async () => {
    if (!proofImage) {
      toast.error("Please upload or capture an image first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('isProof', proofImage);

    try {
     const res = await userRequest.put(
        `/disable/done-product/?id=${rowData._id}&userId=${rowData.userId}`,
        formData
      );
      toast.success(res.data.message || "Successfully uploaded!");
      fetchData();
      onClose();
    } catch (err) {
      toast.error(err.response.data.error || err.response.data.message || "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="h-[90%] bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Verification Details</h2>
            <button 
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* User Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Name</p>
              <p className="font-semibold">{rowData.childName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">CNIC</p>
              <p className="font-semibold">{rowData.cnicNo}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Contact</p>
              <p className="font-semibold">{rowData.contactNumber}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Products</p>
              <p className="font-semibold">{rowData.productIds.map(product => product.productName).join(', ')}</p>
            </div>
          </div>

          {/* Camera/Upload Section */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
            {showCamera ? (
              <div className="relative">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button
                    onClick={capturePhoto}
                    className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    Close Camera
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {proofImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(proofImage)}
                      alt="Preview"
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setProofImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                    <div className="flex gap-4">
                      <button
                        onClick={startCamera}
                        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Open Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Image
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex justify-end gap-4">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!proofImage || isLoading}
            className={`px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex items-center gap-2
              ${(!proofImage || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default DonePopUp;