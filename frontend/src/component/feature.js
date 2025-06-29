"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const Feature = () => {
    return (<section id="features" className="bg-gradient-feature py-[8rem] px-[5%]">
      <div className="max-w-[1200px] mx-auto animate-fadeInUp">
      <div className="text-center mb-6">
        <h2 className="text-5xl bg-gradient-to-r from-[#58a6ff] to-[#a855f7] bg-clip-text text-transparent mb-4 md:text-7xl font-bold">Why Choose ChatFlow?</h2>
        <p className="text-base text-secondary md:text-lg mt-2 max-w-xl mx-auto">
          Discover the features that make ChatFlow the ultimate messaging experience for modern communication.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16">
        {[
            { icon: "💬", title: "Instant Messaging", description: "Send messages instantly with real-time delivery, typing indicators, and read receipts. Stay connected with lightning-fast communication." },
            { icon: "👥", title: "Group Chats", description: "Create unlimited group conversations with friends, family, or colleagues. Collaborate seamlessly with powerful group management tools." },
            { icon: "📱", title: "Stories & Media", description: "Share your moments with disappearing stories, send photos, videos, and voice messages. Express yourself with rich media sharing." },
            { icon: "🔒", title: "End-to-End Security", description: "Your conversations are protected with military-grade encryption. Chat with confidence knowing your privacy is our priority." },
            { icon: "🌙", title: "Beautiful Design", description: "Enjoy a modern, dark-themed interface that's easy on the eyes. Customizable themes and smooth animations enhance your experience." },
            { icon: "📞", title: "Voice & Video Calls", description: "Crystal-clear voice and HD video calls with your contacts. Connect face-to-face from anywhere in the world." },
        ].map(({ icon, title, description }, index) => (<div key={index} className="feature-card animate text-center border border-primary rounded-lg p-4 flex flex-col space-y-2 bg-card-bg text-text-primary hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-[#58a6ff] transition duration-300 ">
            <div className="bg-gradient-icon w-20 h-20 mb-6 mx-auto rounded-full flex items-center justify-center text-4xl">{icon}</div>
            <h3 className="text-[1.5rem] font-bold mb-4 ">{title}</h3>
            <p className="leading-[1.7] text-secondary ">{description}</p>
          </div>))}
      </div>
    </div>
    </section>);
};
exports.default = Feature;
