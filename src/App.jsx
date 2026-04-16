import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SplashCursor from './components/SplashCursor';

export default function App() {
    return (
        <>
            <SplashCursor
                DENSITY_DISSIPATION={4.8}
                VELOCITY_DISSIPATION={3.5}
                SPLAT_RADIUS={0.09}
                SPLAT_FORCE={1800}
                CURL={1.8}
                COLOR_UPDATE_SPEED={4}
                overlayOpacity={0.55}
            />
            <Navbar />
            <Hero />
            <Services />
            <Portfolio />
            <Stats />
            <Contact />
            <Footer />
        </>
    );
}
