import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a1f44] text-white text-center py-4 mt-auto shadow-inner">
      <p className="text-sm">
        © {new Date().getFullYear()} KSCSIRS. All rights reserved.
      </p>
      <div className="flex justify-center gap-6 mt-2 text-xs">
        <Link to="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact Us
        </Link>
      </div>
    </footer>
  );
}
