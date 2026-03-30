import HeroPost from './components/HeroPost';
import ClockTreeNav from './components/ClockTreeNav';

import SynthesisFlow from './components/SynthesisFlow';
import FloorplanGallery from './components/FloorplanGallery';
import WaveformTimeline from './components/WaveformTimeline';
import InteractiveGame from './components/InteractiveGame';
import AiAccelerator from './components/AiAccelerator';
import RegisterMapContact from './components/RegisterMapContact';

export default function App() {
    return (
        <div className="min-h-screen bg-eda-bg font-mono">
            {/* CTS Nav floats over the full-width page */}
            <ClockTreeNav />

            {/* Sections are full-width; each section adds pl-[220px] so content clears the nav */}
            <main>
                <HeroPost />

                <SynthesisFlow />
                <FloorplanGallery />
                <WaveformTimeline />
                <InteractiveGame />
                <AiAccelerator />
                <RegisterMapContact />
            </main>
        </div>
    );
}
