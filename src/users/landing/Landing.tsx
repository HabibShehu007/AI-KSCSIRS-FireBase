import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUserPlus, FiLogIn } from "react-icons/fi"; // icons for buttons

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/assets/landing-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a1f44]/40 z-10" />

      {/* Hero Content */}
      <div
        id="top"
        className="relative z-20 flex flex-col items-center justify-center h-screen text-white text-center px-6 md:px-12 lg:px-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          Welcome to AI-KSCSIRS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-2xl lg:text-3xl max-w-5xl mb-10 leading-relaxed"
        >
          <span className="block font-bold mb-2">
            AI-powered Katsina State Community Security and Incident Reporting
            System
          </span>
          <span className="block">
            Empowering citizens to report incidents, track resolutions, and
            collaborate with public safety departments in real time.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <Link
            to="/user/auth/signup"
            className="bg-white text-[#0a1f44] px-8 py-4 rounded font-semibold text-lg hover:bg-gray-200 transition inline-flex items-center gap-2"
          >
            <FiUserPlus className="text-xl" />
            Register
          </Link>
          <Link
            to="/user/auth/login"
            className="relative overflow-hidden border border-white px-8 py-4 rounded font-semibold text-lg inline-flex items-center gap-2 group"
          >
            {/* liquid fill layer */}
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out group-hover:duration-300"></span>

            {/* content stays above the liquid */}
            <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-[#0a1f44] transition-colors duration-300 ease-out">
              <FiLogIn className="text-xl" />
              Login
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
