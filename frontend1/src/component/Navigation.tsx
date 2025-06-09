import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type NavigationProps = {
  isOpen: boolean;
  handleClick: () => void;

};

const Navigation: React.FC<NavigationProps> = ({isOpen, handleClick }) => {
  const router = useRouter();
  const handleSigninClick = () => {
   
  router.push('/withNavpages/signin');
  };

  const handleMenuClick = () => {
 
    handleClick();
  };

 

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-navbar-bg backdrop-blur-[20px] border-b border-[#30363d] px-[5%] transition-all duration-300 ease-in-out shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <h2

          className="text-2xl font-extrabold bg-gradient-to-br from-[#58a6ff] via-[#a855f7] to-[#f97316] bg-clip-text text-transparent"
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
         <Link href="/withNavpages">  ChatApp</Link>
        </h2>

        {/* Mobile menu button */}
        <button
          className="p-2 rounded bg-transparent md:hidden hover:bg-[#21262d] transition"
          onClick={handleMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>

        {/* Desktop menu */}
        <ul className="hidden  md:flex space-x-8 items-center">
          <li>
            <a
              href="#features"
              className="text-primary font-medium text-sm hover:text-[#58a6ff] transition transform hover:-translate-y-0.5"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#pricing"
              className="text-primary font-medium text-sm hover:text-[#58a6ff] transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              Pricing
            </a>
          </li>
          <li>
            <button
              onClick={handleSigninClick}
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white font-medium text-sm hover:shadow-lg hover:shadow-[#58a6ff]/30 transition transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </li>
        </ul>

        {/* Mobile menu dropdown */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:hidden absolute left-0 right-0 top-full bg-[rgba(13,17,23,0.95)] border-t border-[#30363d] shadow-lg`}
        >
          <ul className="flex flex-col items-center p-4 space-y-4">
            <li>
              <a
                href="#home"
                className="text-primary font-medium text-sm hover:text-[#58a6ff] transition transform hover:-translate-y-0.5"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="text-primary font-medium text-sm hover:text-[#58a6ff] transition transform hover:-translate-y-0.5"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-primaryfont-medium text-sm hover:text-[#58a6ff] transition transform hover:-translate-y-0.5"
              >
                Pricing
              </a>
            </li>
            <li>
              <button
                onClick={handleSigninClick}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white font-medium text-sm hover:shadow-lg hover:shadow-[#58a6ff]/30 transition transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
