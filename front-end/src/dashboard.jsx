import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const progress = 80;
  const tasksNeedingAttention = ["Task 1", "Task 2", "Task 3"];
  const projectsSummary = [
    { name: "Project A", progress: 70 },
    { name: "Project B", progress: 90 },
  ];
  const weeklyProgress = [30, 50, 70, 60, 80, 90, 85];
  const collaborators = ["Alice", "Bob", "Charlie"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          credentials: "include", // Include cookies in the request
        });

        const data = await response.json();

        if (data.success) {
          setUserName(data.user.name);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const pieChartData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ["#FE6059", "#FFDAB9"],
        hoverBackgroundColor: ["#FF6B6B", "#FFB366"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8F8] flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome back, {userName}!
        </h1>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6059]"
        >
          Logout
        </button>
        <p className="text-lg text-gray-600 mb-8">
          Here's an overview of your activity.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Overall Progress
            </h2>
            <div className="w-full h-48 flex items-center justify-center">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: { enabled: true },
                  },
                }}
              />
            </div>
          </div>

          {/* Tasks Needing Attention Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tasks Needing Attention
            </h2>
            <ul className="space-y-2">
              {tasksNeedingAttention.map((task, index) => (
                <li key={index} className="text-gray-600">
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* To-Do Task Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Set Tasks for Today
            </h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a new task"
                  className="flex-1 px-0 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE6059]"
                />
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600"
                >
                  Add
                </button>
              </div>
              <div className="h-40 overflow-y-auto">
                <ul className="space-y-2">
                  {tasks.map((task, index) => (
                    <li
                      key={index}
                      className="bg-gray-100 p-3 rounded-md flex justify-between items-center"
                    >
                      <span className="text-gray-700">{task}</span>
                      <button
                        onClick={() => handleDeleteTask(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700"
                      >
                        Done
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Project Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Project Summary
            </h2>
            <ul className="space-y-2">
              {projectsSummary.map((project, index) => (
                <li key={index} className="text-gray-600">
                  {project.name}: {project.progress}% completed
                </li>
              ))}
            </ul>
          </div>

          {/* Weekly Progress Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Weekly Progress
            </h2>
            <div className="w-full h-40 bg-gray-100 rounded-lg p-4 flex items-end space-x-2">
              {weeklyProgress.map((value, index) => (
                <div
                  key={index}
                  className="w-8 bg-[#FE6059] rounded-t-lg"
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Collaborators Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Worked With
            </h2>
            <ul className="space-y-2">
              {collaborators.map((person, index) => (
                <li key={index} className="text-gray-600">
                  {person}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
