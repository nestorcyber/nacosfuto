import { useState, useEffect } from 'react';
import { FiX, FiDownload, FiImage, FiFileText, FiUpload } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const MaterialsModal = ({ course, onClose }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchMaterials();
    }
  }, [isLoggedIn, navigate, course.code]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/materials/${course.code}`
      );
      setMaterials(response.data.materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load materials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;
  
    try {
      setIsLoading(true);
      
      const uploadPromises = selectedFiles.map(async (file) => {
        const fileType = getFileType(file.name);
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/materials`, {
          course_code: course.code,
          file_url: URL.createObjectURL(file),
          file_name: file.name,
          file_type: fileType
        });
      });

      await Promise.all(uploadPromises);
      toast.success('Files uploaded successfully!');
      setSelectedFiles([]);
      fetchMaterials();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'other';
  };

  const downloadFile = (fileUrl, fileName) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold dark:text-white">
            <FiFileText className="inline mr-2 text-green-600" />
            Materials for {course.code}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Documents Section */}
          <div>
            <h4 className="text-lg font-medium mb-3 dark:text-gray-200 flex items-center">
              <FiDownload className="mr-2 text-green-500" />
              Documents
            </h4>
            {isLoading ? (
              <div className="animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                Loading materials...
              </div>
            ) : (
              <div className="space-y-2">
                {materials.filter(m => m.file_type !== 'image').map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <button
                      onClick={() => downloadFile(doc.file_url, doc.file_name)}
                      className="text-gray-700 dark:text-gray-300 hover:underline flex items-center"
                    >
                      <FiDownload className="mr-2" />
                      {doc.file_name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images Section */}
          <div>
            <h4 className="text-lg font-medium mb-3 dark:text-gray-200 flex items-center">
              <FiImage className="mr-2 text-green-500" />
              Study Images
            </h4>
            {isLoading ? (
              <div className="animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                Loading materials...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {materials.filter(m => m.file_type === 'image').map(img => (
                  <div key={img.id} className="group relative block rounded-lg overflow-hidden shadow-sm bg-white">
                    <div className="relative h-48 w-full">
                      <img
                        src={img.file_url}
                        alt={img.file_name}
                        className="absolute h-full w-full object-contain p-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100');
                        }}
                      />
                      <button
                        onClick={() => downloadFile(img.file_url, img.file_name)}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <FiDownload className="text-white text-2xl" />
                      </button>
                    </div>
                    <div className="p-2 truncate text-sm text-gray-700 dark:text-gray-300">
                      {img.file_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Section */}
          {user?.isStaff && (
            <div className="pt-6 border-t dark:border-gray-700">
              <h4 className="text-lg font-medium mb-3 dark:text-gray-200 flex items-center">
                <FiUpload className="mr-2 text-green-500" />
                Upload New Material
              </h4>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-800 dark:file:text-green-100 dark:hover:file:bg-green-700"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  multiple
                  disabled={isLoading}
                />
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Selected files:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button 
                  onClick={uploadFiles}
                  disabled={isLoading || selectedFiles.length === 0}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                    isLoading || selectedFiles.length === 0
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;