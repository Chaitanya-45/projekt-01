import hero2 from "./assets/hero2.png-removebg-preview.png";

export default function CampaignSection() {
  return (
    <section className="bg-[#FFF8F8] py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 flex justify-center">
          <img src={hero2} alt="Campaign" className="rounded-lg" />
        </div>
        <div className="md:w-1/2 text-left mt-6 md:mt-0 md:pl-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Meet Campaign Goals
          </h2>
          <div className="text-lg text-gray-600 mt-4 space-y-4">
            <div className="flex items-center">
              <span className="text-black text-xl mr-3">✔️</span>
              <p>Drive clarity to focus on shifting business needs</p>
            </div>
            <div className="flex items-center">
              <span className="text-black text-xl mr-3">✔️</span>
              <p>Maximize launch results</p>
            </div>
            <div className="flex items-center">
              <span className="text-black text-xl mr-3">✔️</span>
              <p>Automate and scale processes for approvals</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button className="px-7 py-3 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}