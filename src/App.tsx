import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CompressImage from './pages/CompressImage';
import ResizeImage from './pages/ResizeImage';
import ConvertImage from './pages/ConvertImage';
import Tools from './pages/Tools';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/compress-image" element={<CompressImage />} />
        <Route path="/resize-image" element={<ResizeImage />} />
        <Route path="/convert-image" element={<ConvertImage />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
