import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Footer";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TimetableGenerator = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    day: "Monday",
    start: "08:00",
    end: "09:00",
  });

  const courseRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto"; // force-enable scroll
  }, []);

  useEffect(() => {
    if (courses.length) {
      gsap.from(courseRefs.current, {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [courses]);

  const addCourse = (e) => {
    e.preventDefault();
    // Basic validation: start < end
    if (form.start >= form.end) {
      alert("Start time must be before end time.");
      return;
    }
    if (!form.name.trim()) {
      alert("Course name is required.");
      return;
    }
    setCourses([...courses, form]);
    setForm({
      name: "",
      day: "Monday",
      start: "08:00",
      end: "09:00",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">
          Timetable Generator
        </h1>

        <form
          onSubmit={addCourse}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Course Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                placeholder="e.g. Software Engineering"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Day
              </label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {days.map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Start Time
              </label>
              <input
                type="time"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                End Time
              </label>
              <input
                type="time"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full md:w-auto"
          >
            Add Course
          </button>
        </form>

        {/* Display timetable grid */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Your Timetable
          </h2>

          {courses.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No courses added yet.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full table-auto border-collapse text-gray-800 dark:text-white">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-green-600 text-white sticky top-0">
                      Day
                    </th>
                    <th className="border px-4 py-2 bg-green-600 text-white sticky top-0">
                      Course Name
                    </th>
                    <th className="border px-4 py-2 bg-green-600 text-white sticky top-0">
                      Start Time
                    </th>
                    <th className="border px-4 py-2 bg-green-600 text-white sticky top-0">
                      End Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => (
                    <tr
                      key={i}
                      ref={(el) => (courseRefs.current[i] = el)}
                      className="bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <td className="border px-4 py-2">{c.day}</td>
                      <td className="border px-4 py-2">{c.name}</td>
                      <td className="border px-4 py-2">{c.start}</td>
                      <td className="border px-4 py-2">{c.end}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TimetableGenerator;
