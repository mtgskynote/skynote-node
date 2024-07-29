import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/appContext';
import UploadIcon from '@mui/icons-material/CloudUpload';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB in bytes

const XmlFileUploader = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null); // State to track upload errors
  const fileInputRef = useRef();
  const { getCurrentUser } = useAppContext();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadError('File size exceeds the 16MB limit.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setUploadError(null); // Clear any previous error
        readFileContent(selectedFile);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        setUploadError('File size exceeds the 16MB limit.');
        setFile(null);
      } else {
        setFile(droppedFile);
        setUploadError(null); // Clear any previous error
        readFileContent(droppedFile);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleClick = () => {
    if (!file) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    try {
      // Fetch current user to get user ID
      const result = await getCurrentUser();
      const userId = result.id;

      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      if (!userId) {
        alert('User ID is missing. Please ensure you are logged in.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      setUploadError(null); // Reset any previous error

      const response = await axios.post(`/uploadXML/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully!');

      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file.');
      setUploadProgress(0); // Reset upload progress on error
    }
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          type="file"
          accept=".xml,.musicxml,.mxl"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {!file && (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-center">
              Drag and drop an XML, MusicXML, or MXL file here, or click to
              select one.
            </p>
            <UploadIcon className="text-gray-600 sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
          </div>
        )}
        {file && (
          <div className="mt-4 text-center">
            <button
              onClick={handleUpload}
              className="bg-green-500 border-none text-white px-4 py-2 rounded"
            >
              Upload {file.name}
            </button>
            <p
              className="text-blue-500 mt-2 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              Change file
            </p>
            {uploadProgress > 0 && !uploadError && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
              </div>
            )}
            {uploadError && <p className="text-red-500 mt-4">{uploadError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default XmlFileUploader;
