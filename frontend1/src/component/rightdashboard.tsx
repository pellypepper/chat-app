import type { Chat } from '@/types/user';


type RightdashboardProps = {
  onBack: () => void;
  chat: Chat | null;
};

const Rightdashboard: React.FC<RightdashboardProps> = ({chat, onBack}) => {


  return (
    <div className="p-4 w-100">
      {/* Back button visible only on mobile */}
      <button onClick={onBack} className="md:hidden text-sm text-blue-500 mb-4">&larr; Back</button>
      <h2 className="text-xl font-bold">{chat?.name || "No chat selected"}</h2>
      {/* Chat content here */}
    </div>
  );
};


export default Rightdashboard;