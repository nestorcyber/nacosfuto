import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Footer";

const gradePoints = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

const CGPAPlanner = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [plannedCourses, setPlannedCourses] = useState([]);

  const [formCompleted, setFormCompleted] = useState({
    course: "",
    units: "",
    grade: "A",
  });
  const [formPlanned, setFormPlanned] = useState({
    course: "",
    units: "",
    expectedGrade: "A",
  });

  const completedRef = useRef(null);
  const plannedRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto'; // force-enable scroll
  }, []);

  useEffect(() => {
    if (completedRef.current) {
      gsap.from(completedRef.current, {
        opacity: 0.7,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [completedCourses]);

  useEffect(() => {
    if (plannedRef.current) {
      gsap.from(plannedRef.current, {
        opacity: 0.7,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [plannedCourses]);

  const addCompletedCourse = (e) => {
    e.preventDefault();
    const unitsNum = parseFloat(formCompleted.units);
    if (!formCompleted.course.trim() || isNaN(unitsNum) || unitsNum <= 0) {
      alert("Please enter valid course name and positive units.");
      return;
    }
    setCompletedCourses([...completedCourses, { ...formCompleted, units: unitsNum }]);
    setFormCompleted({ course: "", units: "", grade: "A" });
  };

  const addPlannedCourse = (e) => {
    e.preventDefault();
    const unitsNum = parseFloat(formPlanned.units);
    if (!formPlanned.course.trim() || isNaN(unitsNum) || unitsNum <= 0) {
      alert("Please enter valid course name and positive units.");
      return;
    }
    setPlannedCourses([...plannedCourses, { ...formPlanned, units: unitsNum }]);
    setFormPlanned({ course: "", units: "", expectedGrade: "A" });
  };

  const calculateCGPA = (courses) => {
    if (courses.length === 0) return 0;
    let totalUnits = 0;
    let totalPoints = 0;
    for (const c of courses) {
      const gp = gradePoints[c.grade || c.expectedGrade] ?? 0;
      totalUnits += c.units;
      totalPoints += gp * c.units;
    }
    return totalUnits === 0 ? 0 : (totalPoints / totalUnits).toFixed(2);
  };

  const currentCGPA = calculateCGPA(completedCourses);
  const projectedCGPA = calculateCGPA([...completedCourses, ...plannedCourses]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">
          CGPA Planner
        </h1>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Completed Courses */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Completed Courses
            </h2>

            <form onSubmit={addCompletedCourse} className="space-y-4">
              <input
                type="text"
                placeholder="Course Name"
                value={formCompleted.course}
                onChange={(e) =>
                  setFormCompleted({ ...formCompleted, course: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="Units"
                value={formCompleted.units}
                onChange={(e) =>
                  setFormCompleted({ ...formCompleted, units: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <select
                value={formCompleted.grade}
                onChange={(e) =>
                  setFormCompleted({ ...formCompleted, grade: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {Object.keys(gradePoints).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition-colors"
              >
                Add Completed Course
              </button>
            </form>

            <div
              ref={completedRef}
              className="mt-6 max-h-64 overflow-auto border-t border-gray-300 dark:border-gray-600 pt-4"
            >
              {completedCourses.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  No completed courses added.
                </p>
              ) : (
                <ul className="space-y-2 text-gray-800 dark:text-white">
                  {completedCourses.map((c, i) => (
                    <li key={i} className="flex justify-between bg-green-50 dark:bg-gray-700 p-2 rounded">
                      <span>{c.course}</span>
                      <span>
                        {c.units} units - Grade: {c.grade}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Planned Courses */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Planned Courses
            </h2>

            <form onSubmit={addPlannedCourse} className="space-y-4">
              <input
                type="text"
                placeholder="Course Name"
                value={formPlanned.course}
                onChange={(e) =>
                  setFormPlanned({ ...formPlanned, course: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="Units"
                value={formPlanned.units}
                onChange={(e) =>
                  setFormPlanned({ ...formPlanned, units: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <select
                value={formPlanned.expectedGrade}
                onChange={(e) =>
                  setFormPlanned({ ...formPlanned, expectedGrade: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {Object.keys(gradePoints).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition-colors"
              >
                Add Planned Course
              </button>
            </form>

            <div
              ref={plannedRef}
              className="mt-6 max-h-64 overflow-auto border-t border-gray-300 dark:border-gray-600 pt-4"
            >
              {plannedCourses.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  No planned courses added.
                </p>
              ) : (
                <ul className="space-y-2 text-gray-800 dark:text-white">
                  {plannedCourses.map((c, i) => (
                    <li key={i} className="flex justify-between bg-green-50 dark:bg-gray-700 p-2 rounded">
                      <span>{c.course}</span>
                      <span>
                        {c.units} units - Expected Grade: {c.expectedGrade}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Your CGPA Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
            Current CGPA:{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {currentCGPA}
            </span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Projected CGPA (with planned courses):{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {projectedCGPA}
            </span>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CGPAPlanner;
