import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { FiPlus, FiTrash2, FiClock, FiAward, FiSave } from 'react-icons/fi';
import TopNav from '../../components/TopNav';
import StaffSideNav from '../../components/StaffSidenav';
import { useNavigate } from 'react-router-dom';

export default function ElectionManagement() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    categories: [{ name: '', description: '', candidates: [{ name: '', bio: '', image_url: '' }] }]
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  useEffect(() => {
    const fetchElections = async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/vote/elections`);
          console.log('Elections data:', data); // Log the response
          if (data && Array.isArray(data)) {
            setElections(data);
          } else {
            console.error('Invalid data format:', data);
            setElections([]);
            toast.error('Invalid elections data format');
          }
        } catch (error) {
          console.error('Error fetching elections:', error);
          toast.error('Failed to load elections');
          setElections([]);
        } finally {
          setLoading(false);
        }
      };

    if (user?.isStaff) {
      fetchElections();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewElection(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (index, field, value) => {
    setNewElection(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories[index][field] = value;
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleCandidateChange = (categoryIndex, candidateIndex, field, value) => {
    setNewElection(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories[categoryIndex].candidates[candidateIndex][field] = value;
      return { ...prev, categories: updatedCategories };
    });
  };

  const addCategory = () => {
    setNewElection(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        { name: '', description: '', candidates: [{ name: '', bio: '', image_url: '' }] }
      ]
    }));
  };

  const removeCategory = (index) => {
    setNewElection(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories.splice(index, 1);
      return { ...prev, categories: updatedCategories };
    });
  };

  const addCandidate = (categoryIndex) => {
    setNewElection(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories[categoryIndex].candidates.push({ name: '', bio: '', image_url: '' });
      return { ...prev, categories: updatedCategories };
    });
  };

  const removeCandidate = (categoryIndex, candidateIndex) => {
    setNewElection(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories[categoryIndex].candidates.splice(candidateIndex, 1);
      return { ...prev, categories: updatedCategories };
    });
  };

  const createElection = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/vote`, {
        ...newElection,
        staff_identifier: user?.email || user?.staff_id,
      });
      toast.success('Election created successfully!');
      setElections(prev => [...prev, data.election]);
      setNewElection({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        categories: [{ name: '', description: '', candidates: [{ name: '', bio: '', image_url: '' }] }],
      });
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error(error.response?.data?.error || 'Failed to create election');
    }
  };
  

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {user?.isStaff && (
        <StaffSideNav
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      
      <TopNav 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Election Management</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Election</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newElection.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newElection.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={newElection.start_time}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={newElection.end_time}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
                {newElection.categories.map((category, catIndex) => (
                  <div key={catIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Category {catIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCategory(catIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(catIndex, 'name', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={category.description}
                        onChange={(e) => handleCategoryChange(catIndex, 'description', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                        rows="2"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Candidates</h4>
                      {category.candidates.map((candidate, candIndex) => (
                        <div key={candIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">Candidate {candIndex + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removeCandidate(catIndex, candIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                              <input
                                type="text"
                                value={candidate.name}
                                onChange={(e) => handleCandidateChange(catIndex, candIndex, 'name', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                              <input
                                type="text"
                                value={candidate.image_url}
                                onChange={(e) => handleCandidateChange(catIndex, candIndex, 'image_url', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                            <textarea
                              value={candidate.bio}
                              onChange={(e) => handleCandidateChange(catIndex, candIndex, 'bio', e.target.value)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
                              rows="2"
                            />
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addCandidate(catIndex)}
                        className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm flex items-center"
                      >
                        <FiPlus className="mr-1" />
                        Add Candidate
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addCategory}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm flex items-center"
                >
                  <FiPlus className="mr-1" />
                  Add Category
                </button>
              </div>
              
              <button
                onClick={createElection}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
              >
                <FiSave className="mr-2" />
                Create Election
              </button>
            </div>
          </div>
          
           {/* Active Elections Section */}
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Elections</h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <>
                {elections && elections.length > 0 ? (
                  <div className="space-y-4">
                    {elections.map(election => (
                      election && (
                        <div key={election.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-700/50 transition-shadow">
                          <h3 className="font-medium text-gray-900 dark:text-white">{election.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{election.description}</p>
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <FiClock className="mr-1" />
                            <span>
                              {new Date(election.start_time).toLocaleString()} to {new Date(election.end_time).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No active elections</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}