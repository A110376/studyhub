import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
   <div className="pt-24"> {/* Ye padding top navbar ki height ke barabar hai */}
      <Hero />
      <section className="max-w-6xl mx-auto px-6 md:px-10 mt-20 text-center">
  <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Explore Your Preparation Paths</h2>
  <p className="text-lg text-indigo-700 leading-relaxed max-w-3xl mx-auto">
    Whether you're just starting or revising for your final round, StudyHub provides all the essential resources 
    you need — from detailed past papers to real-time mock tests and quizzes. Each category is tailored to match 
    the latest PPSC exam patterns and trends, helping you prepare smartly and confidently.
  </p>
</section>
 <Categories/>
  <HowItWorks />
    </div>
  );
}



// export default Home;