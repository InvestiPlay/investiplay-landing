// app.jsx — composition, demo modal state, Tweaks
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#15604a",
  "reduceMotion": false,
  "introLoader": true,
  "customCursor": true
}/*EDITMODE-END*/;

const ACCENTS = ["#15604a", "#0e7490", "#2563eb", "#7c3aed"];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [demoOpen, setDemoOpen] = useStateApp(false);
  const openDemo = () => setDemoOpen(true);

  useEffectApp(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);
  useEffectApp(() => {
    document.body.classList.toggle("no-motion", !!t.reduceMotion);
  }, [t.reduceMotion]);

  return (
    <>
      <Loader enabled={t.introLoader} />
      <ScrollProgress />
      <Cursor enabled={t.customCursor && !t.reduceMotion} />
      <Nav onDemo={openDemo} />
      <Manifesto />
      <ClimaxReveal />
      <PhysicsBand />
      <IdeaToLife />
      <FactsReel />
      <HowItWorks />
      <StockSim />
      <Curriculum />
      <Founders />
      <FinalCTA onDemo={openDemo} />
      <Footer onDemo={openDemo} />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Motion" />
        <TweakToggle label="Intro loader" value={t.introLoader} onChange={(v) => setTweak("introLoader", v)} />
        <TweakToggle label="Custom cursor" value={t.customCursor} onChange={(v) => setTweak("customCursor", v)} />
        <TweakToggle label="Reduce animation" value={t.reduceMotion} onChange={(v) => setTweak("reduceMotion", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
