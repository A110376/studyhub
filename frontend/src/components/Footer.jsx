import React from "react";

const Footer = () => (
  <footer className="bg-indigo-900 text-white mt-16">
    <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

      {/* Branding */}
      <div>
        <h3 className="text-xl font-bold mb-2 text-yellow-400">StudyHub</h3>
        <p className="text-sm text-gray-300">
          Your trusted platform for PPSC preparation — notes, videos, alerts, and more.
        </p>
      </div>

      {/* Section 1: Videos */}
      <div>
        <h4 className="text-lg font-semibold mb-4">🎥 PPSC Video Guides</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="https://www.youtube.com/watch?v=QpOfEGHA-6c" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">How to attempt PPSC Paper? – Rana Aslam</a></li>
          <li><a href="https://www.youtube.com/watch?v=NGvR7hWk1Q4" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">Punjab PCS 2025 Strategy</a></li>
          <li><a href="https://www.youtube.com/watch?v=MeD71gsPlQc" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">PPSC Past Papers Solution</a></li>
          <li><a href="https://www.youtube.com/channel/UCiVpFxFHC80l6mjiYIQTWIg/videos" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">PPSC WALA Channel</a></li>
          <li><a href="https://www.youtube.com/watch?v=iZTJYMyBTow" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">Golden Rules – One Paper MCQs</a></li>
        </ul>
      </div>

      {/* Section 2: Books & Notes */}
      <div>
        <h4 className="text-lg font-semibold mb-4">📚 PPSC Books & PDFs</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="https://www.taleem360.com/categories/lecturer-ppsc-books" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">Taleem360 – PPSC Books (PDF)</a></li>
          <li><a href="https://www.scribd.com/document/787385868/PPSC-100th-Edition-by-Imtiaz-Shahid-2024-03015398780" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">Imtiaz Shahid – PPSC Model Papers</a></li>
          <li><a href="https://eduleaf.pk/ppsc-past-papers/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">EduLeaf.pk – PPSC Past Papers</a></li>
          <li><a href="https://www.ilmkidunya.com/ppsc/preparation" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">IlmKiDunya – PPSC Prep Resources</a></li>
        </ul>
      </div>

      {/* Section 3: Exam Alerts */}
      <div>
        <h4 className="text-lg font-semibold mb-4">📢 PPSC Alerts & Updates</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="https://ppsc.gop.pk/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">Official PPSC Website</a></li>
          <li><a href="https://testpointpk.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">TestPoint.pk – Job Alerts</a></li>
          <li><a href="https://jobs.com.pk/ppsc/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">Jobs.com.pk – PPSC News</a></li>
          <li><a href="https://educatorsofficial.com/ppsc-latest-updates/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">EducatorsOfficial – Updates</a></li>
        </ul>
      </div>
    </div>

    <div className="border-t border-indigo-700 mt-8">
      <p className="text-center text-xs py-4">
        &copy; {new Date().getFullYear()} <span className="text-yellow-400 font-semibold">StudyHub</span>. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
