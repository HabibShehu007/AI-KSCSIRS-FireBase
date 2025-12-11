import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUserPlus, FiLogIn } from "react-icons/fi";

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute w-full h-full object-cover"
      >
        <source src="/landing-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a1f44]/50 z-10" />

      {/* Hero Content */}
      <div
        id="top"
        className="relative z-20 flex flex-col items-center justify-center h-screen text-white text-center px-4 md:px-12 lg:px-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }} // ultra fast
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight"
        >
          Welcome To AI-KSCSIRS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="text-base sm:text-lg md:text-2xl lg:text-3xl max-w-3xl md:max-w-5xl mb-6 md:mb-10 leading-relaxed"
        >
          <span className="block font-bold mb-2">
            AI-powered Katsina State Community Security and Incident Reporting
            System
          </span>
          <span className="block font-bold">
            Empowering citizens to report incidents, track resolutions, and
            collaborate with public safety departments in real time.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-12"
        >
          <Link
            to="/user/auth/signup"
            className="bg-white text-[#0a1f44] px-6 py-3 md:px-8 md:py-4 rounded font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-200 transition inline-flex items-center gap-2"
          >
            <FiUserPlus className="text-lg md:text-xl" />
            Register
          </Link>
          <Link
            to="/user/auth/login"
            className="relative overflow-hidden border border-white px-6 py-3 md:px-8 md:py-4 rounded font-semibold text-sm sm:text-base md:text-lg inline-flex items-center gap-2 group"
          >
            {/* liquid fill layer */}
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out"></span>

            {/* content stays above the liquid */}
            <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-[#0a1f44] transition-colors duration-200 ease-out">
              <FiLogIn className="text-lg md:text-xl" />
              Login
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
