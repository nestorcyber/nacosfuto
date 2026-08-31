import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { FiCheckCircle, FiClock, FiAward } from "react-icons/fi";
import TopNav from "../components/TopNav";
import SideNav from "../components/Sidenav";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Nav/Navbar";

export default function VotePage() {
  const { user } = useAuth();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto"; // force-enable scroll
  }, []);

  useEffect(() => {
    const fetchActiveElection = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/vote/active`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.active) {
          setElection(data.election);
        }
      } catch (error) {
        console.error("Error fetching election:", error);
        toast.error("Failed to load election data");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveElection();
  }, []);

  const handleVote = (categoryId, candidateId) => {
    setSelectedCandidates((prev) => ({ ...prev, [categoryId]: candidateId }));
  };

  const submitVotes = async () => {
    try {
      for (const [categoryId, candidateId] of Object.entries(
        selectedCandidates
      )) {
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/vote/votes`,
          {
            election_id: election.id,
            category_id: categoryId,
            candidate_id: candidateId,
            voter_id: 9999, // Use dummy voter ID if user.id is null
          },
          {
            withCredentials: true, // Ensure cookies are sent
          }
        );
      }

      toast.success("Your votes have been submitted successfully!");
      navigate("/announcements");
    } catch (error) {
      console.error("Error submitting votes:", error);
      toast.error(error.response?.data?.error || "Failed to submit votes");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {user?.isStudent && (
        <SideNav
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <ToastContainer position="top-right" autoClose={3000} />

      <div
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-64"
        }`}
      >
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : !election ? (
            <div className="text-center py-10 dark:text-white">
              <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold">
                No active election at this time
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Please check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {election.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {election.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="mr-2" />
                  <span>
                    {new Date(election.start_time).toLocaleString()} -{" "}
                    {new Date(election.end_time).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                {election.categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center mb-4">
                      <FiAward className="text-green-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {category.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedCandidates[category.id] === candidate.id
                              ? "border-green-500 bg-green-50 dark:bg-gray-700 shadow-md"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleVote(category.id, candidate.id)}
                        >
                          <div className="flex items-center space-x-4">
                            {candidate.image_url ? (
                              <img
                                src={candidate.image_url}
                                alt={candidate.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/150"; // Fallback image
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400 text-lg">
                                  {candidate.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {candidate.bio}
                              </p>
                              {selectedCandidates[category.id] ===
                                candidate.id && (
                                <div className="flex items-center mt-2 text-green-500">
                                  <FiCheckCircle className="mr-1" />
                                  <span className="text-sm">Selected</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(selectedCandidates).length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={submitVotes}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
                  >
                    <FiCheckCircle className="mr-2" />
                    Submit Votes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
