import AppLayout from '../layouts/AppLayout';

function Privacy() {
  return (
    <AppLayout>
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-lg -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]"
          aria-hidden="true"
        />

        {/* Header */}
        <header className="relative mb-16 text-center sm:mb-20">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-zinc-400">Legal</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="relative space-y-10">
          {/* Introduction */}
          <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 backdrop-blur-sm sm:p-10">
            <p className="text-base leading-relaxed text-zinc-300">
              At Outora, we respect your privacy and are committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our
              intelligent exploration platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Information We Collect</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
                <h3 className="text-lg font-semibold text-white">Account Information</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  When you create an account, we collect your username, email address, and encrypted password.
                  This information is used to provide you with access to saved itineraries and personalized features.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
                <h3 className="text-lg font-semibold text-white">Location Data</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  With your permission, we access your device's location to provide personalized itinerary
                  recommendations near you. Location data is used only during active sessions and is not stored
                  permanently. You can deny location access at any time through your browser settings.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
                <h3 className="text-lg font-semibold text-white">Itinerary Preferences</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  We collect information about your outing preferences (budget, interests, group size, timing)
                  to generate personalized itineraries. This data is associated with your account if you're
                  logged in, or stored temporarily in your browser session if you're not.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
                <h3 className="text-lg font-semibold text-white">Usage Data</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  We collect analytics data about how you interact with Outora, including pages visited,
                  features used, and session duration. This helps us improve the platform and user experience.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">How We Use Your Information</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <ul className="space-y-3 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Generate personalized itineraries based on your preferences and location</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Save and manage your itineraries across devices</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Improve our AI algorithms and recommendation engine</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Communicate important updates about the service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Analyze usage patterns to enhance platform performance</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Third-Party Services</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                Outora integrates with third-party services to provide comprehensive itinerary planning:
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong className="text-white">Google Maps API</strong> — For location data, directions, and place information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong className="text-white">Weather Services</strong> — For real-time weather data and forecasts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong className="text-white">AI Services</strong> — For generating personalized recommendations</span>
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                These services have their own privacy policies. We recommend reviewing them to understand
                how they handle your data.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Data Security</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Encrypted data transmission using HTTPS</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Secure password hashing and authentication</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span>Limited access to personal data by authorized personnel only</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Session Data */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Cookies and Session Data</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                We use cookies and browser storage to enhance your experience:
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong className="text-white">Authentication cookies</strong> — To keep you logged in</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong className="text-white">Session storage</strong> — To temporarily store your current itinerary</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong className="text-white">Preference cookies</strong> — To remember your settings</span>
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                You can control cookie settings through your browser preferences.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Your Rights</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                You have the following rights regarding your personal data:
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span><strong className="text-white">Access</strong> — Request a copy of your personal data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span><strong className="text-white">Correction</strong> — Update inaccurate or incomplete information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span><strong className="text-white">Deletion</strong> — Request deletion of your account and associated data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400">•</span>
                  <span><strong className="text-white">Opt-out</strong> — Decline location access or data collection</span>
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                To exercise these rights, contact us at{' '}
                <a href="mailto:support@outora.com" className="text-emerald-400 transition-colors hover:text-emerald-300">
                  support@outora.com
                </a>
              </p>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Changes to This Policy</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                We may update this Privacy Policy from time to time. We will notify you of significant
                changes by posting the new policy on this page and updating the "Last updated" date.
                We encourage you to review this policy periodically.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Contact Us</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                If you have questions about this Privacy Policy or how we handle your data, please contact us at:
              </p>
              <p className="mt-4 text-base font-medium text-emerald-400">
                <a href="mailto:support@outora.com" className="transition-colors hover:text-emerald-300">
                  support@outora.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default Privacy;
