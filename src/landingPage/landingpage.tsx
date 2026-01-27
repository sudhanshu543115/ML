import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* ================= NAVBAR ================= */}
      {/* <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">
            Skill<span className="text-purple-600">Swap</span>
          </h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header> */}

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Learn New Skills  
            <br />
            <span className="text-yellow-300">By Teaching What You Know</span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            SkillSwap is a peer-to-peer platform where people exchange skills
            instead of money. Teach your expertise and learn something new
            from others.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-yellow-400 text-black rounded-xl text-lg font-semibold hover:bg-yellow-300 transition"
            >
              Start Skill Swapping
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-white rounded-xl text-lg hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHAT IT DOES ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">
            What is SkillSwap?
          </h3>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            SkillSwap connects people who want to learn with people who love
            to teach. There’s no money involved — just mutual growth,
            collaboration, and real human connection.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-8">
              <h4 className="text-xl font-semibold text-indigo-600">
                Teach Your Skills
              </h4>
              <p className="mt-3 text-gray-600">
                Share what you’re good at — coding, design, music, languages,
                or anything else.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-8">
              <h4 className="text-xl font-semibold text-indigo-600">
                Learn What You Want
              </h4>
              <p className="mt-3 text-gray-600">
                Find people who can teach you the skills you want to learn,
                based on real interests.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-8">
              <h4 className="text-xl font-semibold text-indigo-600">
                Exchange, Not Pay
              </h4>
              <p className="mt-3 text-gray-600">
                No subscriptions, no fees — just skill-for-skill exchanges
                powered by trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center">
            How It Works
          </h3>

          <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600">1</div>
              <h4 className="mt-3 font-semibold">Create Profile</h4>
              <p className="mt-2 text-gray-600">
                Sign up and add the skills you can teach and want to learn.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-indigo-600">2</div>
              <h4 className="mt-3 font-semibold">Get Matched</h4>
              <p className="mt-2 text-gray-600">
                Our system suggests users with reciprocal skill interests.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-indigo-600">3</div>
              <h4 className="mt-3 font-semibold">Connect & Chat</h4>
              <p className="mt-2 text-gray-600">
                Accept matches and chat in real time to plan your exchange.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-indigo-600">4</div>
              <h4 className="mt-3 font-semibold">Learn & Grow</h4>
              <p className="mt-2 text-gray-600">
                Teach, learn, and rate each other to build trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold">
            Ready to Exchange Skills?
          </h3>
          <p className="mt-4 text-white/90">
            Join a community where learning is collaborative, practical,
            and free.
          </p>
          <Link
            href="/register"
            className="inline-block mt-8 px-10 py-4 bg-yellow-400 text-black rounded-xl text-lg font-semibold hover:bg-yellow-300 transition"
          >
            Join SkillSwap Today
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      {/* <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        © {new Date().getFullYear()} SkillSwap · Built with MERN Stack
      </footer> */}
    </div>
  );
}
