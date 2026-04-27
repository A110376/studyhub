import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import PastPapers from "./pages/PastPapers";
import Quiz from "./pages/Quiz";
import QuizPage from "./pages/QuizPage"; 
import CurrentAffairs from "./pages/CurrentAffairs";
import Result from "./pages/Result";
import AuthPage from "./pages/Register";
import CurrentAffairsSubject from "./pages/CurrentAffairsSubject";
import Footer from "./components/Footer";

import TestStart from './pages/TestStart'
import TestPage from './pages/TestPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/past-papers" element={<PastPapers />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:subject" element={<QuizPage />} /> 
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/current-affairs/:subject" element={<CurrentAffairsSubject />} />
           <Route path="/mock-test" element={<TestStart />} />
<Route path="/mock-test/:slug" element={<TestStart />} />
        <Route path='/mock-test/:slug/attempt/:attemptId' element={<TestPage/>} />
          <Route path="/result" element={<Result />} />
          <Route path="/register" element={<AuthPage />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
