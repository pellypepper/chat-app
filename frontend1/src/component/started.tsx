"use client";

const Started = () => {
  return (
  <section className="py-32 px-[5%] text-center bg-gradient-started">
  <div className="animate-fadeInUp">
    <h2 className="text-[3rem] font-bold mb-6 bg-gradient-to-br from-[#58a6ff] to-[#a855f7] bg-clip-text text-transparent">
      Ready to Get Started?
    </h2>
    <p className="text-1xl text-secondary mb-10 max-w-[600px] mx-auto">
      Join millions of users who trust ChatFlow for their daily communication. Sign up today and experience the future of messaging.
    </p>
    <div className="flex justify-center gap-4 flex-wrap">
      <button className="w-[150px] rounded animate bg-gradient-purple font-medium text-sm">
        Create Account
      </button>
      <button  className="p-4 w-[150px] rounded animate border font-medium text-sm">
        Sign In
      </button>
    </div>
  </div>
</section>

  )
}

export default Started
