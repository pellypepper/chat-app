import type { Chat } from '@/types/user';


type RightdashboardProps = {
  onBack: () => void;
  chat: Chat | null;
};

const Rightdashboard: React.FC<RightdashboardProps> = ({chat, onBack}) => {


  return (
    <div className="p-4  ">
   
   <div className="flex flex-col flex-1   h-screen ">
  {/* Header */}
  <div className="p-5 border-b  border-[#30363d] flex items-center justify-between">
    <div className="flex items-center gap-3">
              <button onClick={onBack} className="md:hidden text-sm text-primary mb-4">&larr; Back</button>
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-semibold">
        A
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
      </div>
      <div>
        <h3 className="mb-1 font-semibold text-white">Alice Cooper</h3>
        <div className="text-[#7d8590] text-sm">Active now</div>
      </div>
    </div>
    <div className="flex gap-3">
      <button className="w-10 h-10 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#7d8590] hover:text-white flex items-center justify-center transition">📞</button>
      <button className="w-10 h-10 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#7d8590] hover:text-white flex items-center justify-center transition">📹</button>
      <button className="w-10 h-10 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#7d8590] hover:text-white flex items-center justify-center transition">ℹ️</button>
    </div>
  </div>

  {/* Messages */}
  <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1 scrollbar-hidden">
    {/* Message from Alice */}
    <div className="flex gap-3 max-w-[70%]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-semibold">A</div>
      <div className="bg-[#21262d] text-white px-4 py-3 rounded-xl">
        <div>Hey there! How's your day going? 😊</div>
        <div className="text-[#7d8590] text-xs mt-1">2:30 PM • Read</div>
      </div>
    </div>

    {/* Sent message */}
    <div className="flex gap-3 max-w-[70%] self-end flex-row-reverse">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-semibold">J</div>
      <div className="bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white px-4 py-3 rounded-xl">
        <div>Pretty good! Just working on some designs. What about you?</div>
        <div className="text-white/80 text-xs mt-1">2:32 PM • Read</div>
      </div>
    </div>

    {/* Message from Alice */}
    <div className="flex gap-3 max-w-[70%]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-semibold">A</div>
      <div className="bg-[#21262d] text-white px-4 py-3 rounded-xl">
        <div>Same here! Want to grab coffee later?</div>
        <div className="text-[#7d8590] text-xs mt-1">2:33 PM • Read</div>
      </div>
    </div>

    {/* Sent message */}
    <div className="flex gap-3 max-w-[70%] self-end flex-row-reverse">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-semibold">J</div>
      <div className="bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white px-4 py-3 rounded-xl">
        <div>Sounds perfect! 5 PM at the usual place?</div>
        <div className="text-white/80 text-xs mt-1">2:34 PM • Delivered</div>
      </div>
    </div>

    {/* Typing indicator */}
    <div className="flex items-center gap-2 text-[#7d8590] italic text-sm">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-semibold">A</div>
      <div className="flex items-center gap-2">
        <span>Alice is typing</span>
        <div className="flex gap-[2px]">
          <div className="w-1 h-1 bg-[#7d8590] rounded-full animate-[typing_1.4s_infinite]"></div>
          <div className="w-1 h-1 bg-[#7d8590] rounded-full animate-[typing_1.4s_infinite_0.2s]"></div>
          <div className="w-1 h-1 bg-[#7d8590] rounded-full animate-[typing_1.4s_infinite_0.4s]"></div>
        </div>
      </div>
    </div>
  </div>

  {/* Input */}
  <div className="p-5 border-t border-[#30363d]">
    <div className="flex items-center gap-3 bg-[#21262d] border border-[#30363d] rounded-full px-5 py-3">
      <div className="flex gap-2 text-[#7d8590]">
        <button className="hover:text-[#58a6ff] transition">📎</button>
        <button className="hover:text-[#58a6ff] transition">📷</button>
        <button className="hover:text-[#58a6ff] transition">🎤</button>
      </div>
      <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-white focus:outline-none text-base placeholder-[#7d8590]" />
      <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white hover:scale-110 transition">➤</button>
    </div>
  </div>
</div>

    </div>
  );
};


export default Rightdashboard;