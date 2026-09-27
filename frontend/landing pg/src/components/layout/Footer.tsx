import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Info */}
          <div className="col-span-2">
            <span className="text-3xl font-black tracking-tighter mb-6 block text-white">
              MatterMind
            </span>
            <p className="text-slate-400 mb-8 max-w-xs leading-relaxed text-sm">
              Setting the global standard for industrial material intelligence and circular traceability.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.1c-.33.09-.677.137-1.035.137-.253 0-.499-.025-.739-.07a4.188 4.188 0 0 0 3.91 2.903 8.394 8.394 0 0 1-5.202 1.792c-.338 0-.671-.02-1-.059a11.816 11.816 0 0 0 6.417 1.88c7.697 0 11.907-6.376 11.907-11.91 0-.181-.004-.361-.013-.541a8.515 8.515 0 0 0 2.093-2.17z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Material Passports</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Simulation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Circularity Hub</a></li>
            </ul>
          </div>

          {/* Column 2: Industries */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Industries</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Aerospace</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Automotive</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Steel & Alloys</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainable Energy</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Whitepapers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Status</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
          <div>© 2026 MATTERMIND TECHNOLOGIES INC. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
