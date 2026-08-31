import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FiBarChart2, FiPieChart, FiClock, FiAward, FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import TopNav from '../../components/TopNav';
import StaffSideNav from '../../components/StaffSidenav';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ElectionResults() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/vote/elections`);
        setElections(data);
      } catch (error) {
        console.error('Error fetching elections:', error);
        toast.error('Failed to load elections');
      } finally {
        setLoading(false);
      }
    };

    if (user?.isStaff) {
      fetchElections();
    }
  }, [user]);

  const fetchResults = async (electionId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/vote/results/${electionId}`);
      setResults(data);
      setSelectedElection(electionId);
      // Expand the first category by default
      if (data?.categories?.length > 0) {
        setExpandedCategory(data.categories[0].id);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error(error.response?.data?.error || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Generate distinct colors for charts
  const getChartColors = (count) => {
    const colors = [
      'rgba(34, 197, 94, 0.7)',  // green
      'rgba(59, 130, 246, 0.7)', // blue
      'rgba(249, 115, 22, 0.7)', // orange
      'rgba(168, 85, 247, 0.7)', // purple
      'rgba(236, 72, 153, 0.7)', // pink
      'rgba(6, 182, 212, 0.7)',  // cyan
      'rgba(234, 179, 8, 0.7)',  // yellow
    ];
    
    // If we need more colors than we have, repeat the palette
    return Array(count).fill().map((_, i) => colors[i % colors.length]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <StaffSideNav
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <TopNav 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-64'}`}>
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Election Results</h1>
            <div className="mt-2 md:mt-0 w-full md:w-auto">
              <select
                value={selectedElection || ''}
                onChange={(e) => fetchResults(e.target.value)}
                className="w-full md:w-64 border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">-- Select Election --</option>
                {elections.map(election => (
                  <option key={election.id} value={election.id}>
                    {election.title} ({new Date(election.start_time).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && selectedElection ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : results ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{results.election.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{results.election.description}</p>
                  </div>
                  <div className="mt-3 md:mt-0 flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FiClock className="mr-1" />
                      {new Date(results.election.start_time).toLocaleString()} - {new Date(results.election.end_time).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mb-6">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 rounded-lg flex items-center ${chartType === 'bar' ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    <FiBarChart2 className="mr-1" />
                    <span>Bar</span>
                  </button>
                  <button
                    onClick={() => setChartType('pie')}
                    className={`px-3 py-1 rounded-lg flex items-center ${chartType === 'pie' ? 'bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    <FiPieChart className="mr-1" />
                    <span>Pie</span>
                  </button>
                </div>

                {results.categories.map(category => (
                  <div key={category.id} className="mb-8 last:mb-0">
                    <div 
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <FiAward className="text-green-500 mr-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          ({category.totalVotes} votes)
                        </span>
                      </div>
                      {expandedCategory === category.id ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </div>

                    {expandedCategory === category.id && (
                      <div className="mt-4 pl-2">
                        <div className="h-64 mb-6">
                          {chartType === 'bar' ? (
                            <Bar
                              data={{
                                labels: category.results.map(r => r.name),
                                datasets: [{
                                  label: 'Votes',
                                  data: category.results.map(r => r.votes),
                                  backgroundColor: getChartColors(category.results.length),
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                  borderWidth: 1
                                }]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                    grid: {
                                      color: 'rgba(0, 0, 0, 0.05)'
                                    }
                                  },
                                  x: {
                                    grid: {
                                      display: false
                                    }
                                  }
                                },
                                plugins: {
                                  legend: {
                                    display: false
                                  },
                                  tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleFont: {
                                      size: 14
                                    },
                                    bodyFont: {
                                      size: 12
                                    }
                                  }
                                }
                              }}
                            />
                          ) : (
                            <Pie
                              data={{
                                labels: category.results.map(r => r.name),
                                datasets: [{
                                  data: category.results.map(r => r.votes),
                                  backgroundColor: getChartColors(category.results.length),
                                  borderWidth: 1
                                }]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    position: 'right',
                                    labels: {
                                      color: '#6B7280',
                                      font: {
                                        size: 12
                                      }
                                    }
                                  },
                                  tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleFont: {
                                      size: 14
                                    },
                                    bodyFont: {
                                      size: 12
                                    }
                                  }
                                }
                              }}
                            />
                          )}
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Candidate</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Votes</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {category.results.map((result, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      {result.image_url && (
                                        <img 
                                          src={result.image_url} 
                                          alt={result.name}
                                          className="w-8 h-8 rounded-full mr-3 object-cover"
                                        />
                                      )}
                                      <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{result.votes}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                    {category.totalVotes > 0 
                                      ? `${Math.round((result.votes / category.totalVotes) * 100)}%` 
                                      : '0%'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <FiBarChart2 className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No election selected</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">Please select an election from the dropdown to view results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}