
import BatchActions from "@/components/BatchActions";
import SpaceOverview from "@/components/SpaceOverview";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex-1 overflow-auto pb-16">
        <SpaceOverview />
      </div>
      <div className="w-full md:w-80 p-6 flex-shrink-0">
        <BatchActions />
      </div>
    </div>
  );
};

export default Dashboard;
