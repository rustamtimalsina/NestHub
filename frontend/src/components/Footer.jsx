import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { HiHome, HiMail } from "react-icons/hi";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
 className="bg-slate-950 text-gray-300 mt-20"
>

     <div className="max-w-4xl mx-auto px-6 py-14 text-center">

        {/* Brand */}

        <div className="flex flex-col items-center">

         <div className="flex flex-col items-center hover:scale-105 transition duration-300 cursor-pointer">

            <HiHome className="text-blue-500 text-5xl" />

<h1 className="text-4xl font-black mt-3">
  NestHub
</h1>

          </div>

          <p className="mt-5 max-w-xl text-gray-400 leading-8">
  Connecting buyers, sellers and renters across Nepal.
</p>

        </div>



       <div className="mt-10">

  <p className="mb-3">📍 Nepal</p>

  <p className="mb-3 flex justify-center items-center gap-2">
    <HiMail className="text-blue-500" />
    rustamtimalsina179@gmail.com
  </p>

  <p className="mb-6">
    ☎ +977 9848915588
  </p>

 <div className="flex justify-center gap-5 mt-8">

  {/* Facebook */}
<a
  href="https://www.facebook.com/share/1LrweWHSNE/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Facebook"
  title="Visit my Facebook"
>
  <FaFacebookF className="w-12 h-12 p-3 rounded-full bg-slate-800 hover:bg-blue-600 hover:scale-110 transition-all duration-300 cursor-pointer" />
</a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/rustam_timalsina/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    title="Visit my Instagram"
  >
    <FaInstagram className="w-12 h-12 p-3 rounded-full bg-slate-800 hover:bg-pink-600 hover:scale-110 transition-all duration-300 cursor-pointer" />
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/rustam-timalsina-76b87a313/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    title="Visit my LinkedIn"
  >
  
    <FaLinkedinIn className="w-12 h-12 p-3 rounded-full bg-slate-800 hover:bg-sky-600 hover:scale-110 transition-all duration-300 cursor-pointer" />
  </a>

  {/* GitHub */}
  <a
    href="https://github.com/rustamtimalsina"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    title="Visit my GitHub"
  >
    <FaGithub className="w-12 h-12 p-3 rounded-full bg-slate-800 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 cursor-pointer" />
  </a>
</div>

</div>
      </div>

      <div className="border-t border-gray-700 text-center py-6 text-gray-500 text-sm">

        © 2026 NestHub. All Rights Reserved.

      </div>

    </motion.footer>
  );
}

export default Footer;