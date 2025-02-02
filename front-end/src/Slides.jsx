import { useState, useEffect } from "react";

export default function SlidesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      heading: "What are Projects?",
      content:
        "A project is a series of tasks that need to be completed within a specified time, in order to achieve the planned outcome. The planning, scheduling, tracking, and collaboration are overseen by one or many project managers, depending on how complex the project is. Project management is the process of piloting teams towards their predefined goals within the specified time through planning, tracking, and execution, usually under the guidance of a project manager — an online project management tool assists with getting the best outcome.",
    },
    {
      heading: "How does Project Management Work?",
      content:
        "Project management gives your project purpose, a framework, and a ground-plan, through planning, tracking, collaboration, and execution of tasks that are assigned to resources. With project management, you can streamline all the processes required to attain your goals, keep everyone in the loop through continuous communication, track every phase of the project closely and move past hiccups. It helps your teams stay organized, stay on the same page, and stay accountable!",
    },
    {
      heading: "Why do Businesses Need Project Management Platforms?",
      content:
        "Project management allows businesses to plan efficiently, without straying from the big picture. When everyone knows what they're working on, a positive working environment is fostered. Moreover, with project management, teams can allocate each member with an optimum amount of work that they are accountable for, laying the foundation for proper resource utilization. It also helps with consistent tracking so that your teams know where your project stands at every juncture, leading to increased productivity.",
    },
    {
      heading: "Project Management Decoded",
      content:
        "Project management is a crucial element for guiding your teams, ensuring transparency, and driving your projects toward success. It helps in prioritizing tasks, breaking them down into actionable steps, and assigning responsibility, while keeping track of progress. Whether you're working on small-scale tasks or large, complex projects, project management frameworks ensure you remain organized and efficient.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FFF8F8] py-10 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mt-0">
          <div className="w-full h-70 p-6 rounded-md">
            <h3 className="text-2xl font-bold bg-[#f4f4fa] inline-block">
              {slides[currentSlide].heading}
            </h3>
            <p className="text-lg text-gray-600 mt-4">
              {slides[currentSlide].content}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 ">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full bg-black cursor-pointer ${
              currentSlide === index ? "bg-red-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
}