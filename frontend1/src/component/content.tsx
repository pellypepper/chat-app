import { FcGoogle } from "react-icons/fc";


type ContentProps = {

  openRegister: () => void; // Optional prop for register functionality
};

const Content: React.FC<ContentProps> = ({  openRegister }) => {


    
   const handleRegisterClick = () => {
 
   openRegister();
  };

    

  return (
  <section id="home" className="relative min-h-screen flex items-center justify-center text-center px-[5%] bg-[radial-gradient(ellipse_at_center,_rgba(88,166,255,0.1)_0%,_transparent_50%)] overflow-hidden">
  {/* Grid Overlay */}
  <div className="absolute inset-0 opacity-30 z-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cdefs%3E%3Cpattern id=%22grid%22 width=%2210%22 height=%2210%22 patternUnits=%22userSpaceOnUse%22%3E%3Cpath d=%22M 10 0 L 0 0 0 10%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%220.5%22 opacity=%220.1%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%22 height=%22100%22 fill=%22url(%23grid)%22/%3E%3C/svg%3E')]">
  </div>

  <div className="relative z-10 max-w-[800px] animate-fadeInUp">
    <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold mb-6 leading-[1.1] text-gradient-purple ">
      Connect Instantly
    </h1>

    <p className="text-[1.25rem] text-[#7d8590] mb-10 max-w-[600px] mx-auto">
      Experience the future of messaging with ChatFlow. Connect with friends, share moments, and stay in touch like never before with our modern, intuitive chat platform.
    </p>

    <div className="flex justify-center gap-4 flex-wrap">
      <a  onClick={ handleRegisterClick} className="p-2   bg-gradient-purple font-medium text-sm px-8 py-4 rounded-xl">Get Started Free</a>
      <a href="#features" className=" px-8 py-4   flex items-center gap-2 border font-medium text-sm rounded-xl"><FcGoogle size={24} />Contine with Google</a>
    </div>
  </div>
</section>
  )
}

export default Content



