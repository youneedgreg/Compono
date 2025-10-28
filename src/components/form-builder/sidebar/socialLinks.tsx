import { FaLinkedin } from "react-icons/fa6";

import { FaGithub } from "react-icons/fa6";

export default function SocialLinks() {
  return (
    <div className="flex flex-row gap-4 py-3 px-2 justify-center">
    <a
      className="flex items-center gap-2 text-sm hover:text-slate-500"
      target="_blank"
      href="https://github.com/youneedgreg/Compono"
    >
      <FaGithub className="w-6 h-6" />
    </a>
    <a
      className="flex items-center gap-2 text-sm hover:text-slate-500"
      target="_blank"
      href="https://www.linkedin.com/in/youneedgreg/"
    >
      <FaLinkedin className="w-6 h-6" />
    </a>
  </div>
  );
}
