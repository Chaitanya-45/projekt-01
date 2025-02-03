import { useState, useEffect } from "react";
import axios from "axios";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ email: "", task: "", status: "In Progress" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Handle creating a new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/projects", newProject);
      setProjects([...projects, response.data]);
      setNewProject({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Handle selecting a project to view details
  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    try {
      const response = await axios.get(`http://localhost:5000/projects/${project._id}/team`);
      setTeamMembers(response.data.team);
      updateCompletionPercentage(response.data.team);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Handle adding a new team member to the selected project
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/projects/${selectedProject._id}/team`,
        newMember
      );
      setTeamMembers(response.data.team);
      setNewMember({ email: "", task: "", status: "In Progress" });
      updateCompletionPercentage(response.data.team);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  // Toggle the task status
  const toggleTaskStatus = async (memberEmail) => {
    try {
      const member = teamMembers.find(member => member.email === memberEmail);
      const newStatus = member.status === "In Progress" ? "Completed" : "In Progress";
      const response = await axios.put(
        `http://localhost:5000/projects/${selectedProject._id}/team/${memberEmail}`,
        { status: newStatus }
      );
      setTeamMembers(response.data.team);
      updateCompletionPercentage(response.data.team);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Calculate and update the completion percentage
  const updateCompletionPercentage = (team) => {
    const totalTasks = team.length;
    const completedTasks = team.filter(member => member.status === "Completed").length;
    const completionPercentage = (completedTasks / totalTasks) * 100;
    setSelectedProject(prev => ({ ...prev, completionPercentage }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F8] flex flex-col items-center p-8">
      {/* Create Project Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl w-full mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Create a New Project
        </h2>
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FE6059] focus:outline-none transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description
            </label>
            <textarea
              placeholder="Enter project description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FE6059] focus:outline-none transition duration-200"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#FE6059] text-white font-semibold py-3 rounded-xl hover:bg-[#E55650] focus:ring-2 focus:ring-[#FE6059] focus:outline-none transition duration-200"
          >
            Create Project
          </button>
        </form>
      </div>

      {/* Projects Section */}
      <div className="max-w-4xl w-full mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No projects assigned yet.
            </p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {project.description}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Team Members: {project.team.length}
                </p>
                {/* Task Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>{project.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FE6059] h-2 rounded-full"
                      style={{ width: `${project.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assigned Projects Section */}
      <div className="max-w-4xl w-full mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Assigned Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fake Assigned Projects Data */}
          {[1, 2, 3].map((project, index) => (
            <div key={index} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Assigned Project {project}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2">
                Description for assigned project {project}.
              </p>
              <p className="text-sm text-gray-500 mt-2">Team Members: 3</p>
              {/* Task Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#FE6059] h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProject.name}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 mb-4">{selectedProject.description}</p>

            <div className="max-h-[50vh] overflow-y-auto mb-4 p-2 bg-[#FFF8F8] rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Team Members
              </h3>
              <ul className="space-y-3">
                {teamMembers.map((member, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800 font-medium">{member.email}</p>
                        <p className="text-sm text-gray-500">Task: {member.task}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          member.status === "In Progress"
                            ? "bg-yellow-400 text-yellow-800"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleTaskStatus(member.email)}
                      className="mt-2 text-sm text-[#FE6059] hover:text-[#E55650] transition duration-200"
                    >
                      Toggle Status
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Member Email
                </label>
                <input
                  type="email"
                  placeholder="Enter team member's email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FE6059] focus:outline-none transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Task
                </label>
                <input
                  type="text"
                  placeholder="Enter assigned task"
                  value={newMember.task}
                  onChange={(e) =>
                    setNewMember({ ...newMember, task: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FE6059] focus:outline-none transition duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FE6059] text-white font-semibold py-2 rounded-xl hover:bg-[#E55650] focus:ring-2 focus:ring-[#FE6059] focus:outline-none transition duration-200"
              >
                Add Team Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}