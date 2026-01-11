import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Education from '@/components/Education';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Education />
      </main>
      <Footer />
    </>
  );
}
