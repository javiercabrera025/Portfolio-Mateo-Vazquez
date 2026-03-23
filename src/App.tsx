import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Projects } from './components/Projects';
import { AllProjects } from './components/AllProjects';
import { ProjectDetails } from './components/ProjectDetails';
import { AboutPage } from './components/AboutPage';
import { ContactForm } from './components/ContactForm';

function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-white antialiased flex flex-col'>
        <Header />
        <main className='flex-1 bg-black'>
          <Routes>
            <Route
              path='/'
              element={
                <>
                  <Hero />
                  <Projects />
                </>
              }
            />
            <Route path='/trabajos' element={<AllProjects />} />
            <Route path='/trabajos/:slug' element={<ProjectDetails />} />
            <Route path='/sobre-mi' element={<AboutPage />} />
            <Route path='/contacto' element={<ContactForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
