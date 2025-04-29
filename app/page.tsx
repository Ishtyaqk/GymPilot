import { FitnessForm } from "@/components/fitness-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden">
      {/* Glossy/Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-700/30 via-transparent to-transparent opacity-40" />
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent opacity-30" />
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-10" />
      </div>
      <div className="container max-w-4xl px-4 py-8 mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            AI Fitness Routine Generator
          </h1>
          <p className="mt-4 text-lg text-zinc-300 drop-shadow">
            Get a personalized workout plan powered by Gemini AI
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/80 shadow-2xl ring-1 ring-zinc-800 backdrop-blur-md p-6 md:p-10">
          <FitnessForm />
        </div>
      </div>
    </div>
  )
}
