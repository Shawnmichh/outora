import AppLayout from '../layouts/AppLayout';

function Terms() {
  return (
    <AppLayout>
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-lg -translate-x-1/2 rounded-full bg-cyan-500/[0.03] blur-[120px]"
          aria-hidden="true"
        />

        {/* Header */}
        <header className="relative mb-16 text-center sm:mb-20">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-sm font-medium text-zinc-400">Legal</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Terms of Service
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
              Welcome to Outora. By accessing or using our intelligent exploration platform, you agree to be
              bound by these Terms of Service. Please read them carefully before using our services.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Acceptance of Terms</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                By creating an account or using Outora, you acknowledge that you have read, understood, and
                agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to
                these terms, please do not use our services.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Service Description</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                Outora is an AI-powered platform that generates personalized itineraries for exploring cities.
                Our service provides recommendations for activities, dining, and attractions based on your
                preferences, budget, and available time.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                We strive to provide accurate and helpful recommendations, but itineraries are suggestions
                and should be verified independently before making travel decisions.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">User Accounts</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
                <h3 className="text-lg font-semibold text-white">Account Creation</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  You may create an account to access additional features such as saving itineraries and
                  sharing plans. You are responsible for maintaining the confidentiality of your account
                  credentials and for all activities that occur under your account.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
                <h3 className="text-lg font-semibold text-white">Account Responsibilities</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-400">
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Provide accurate and complete information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Keep your password secure and confidential</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Notify us immediately of any unauthorized access</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>You must be at least 13 years old to create an account</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Acceptable Use</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                You agree to use Outora only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-red-400">•</span>
                  <span>Use the service for any illegal or unauthorized purpose</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400">•</span>
                  <span>Attempt to gain unauthorized access to our systems or networks</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400">•</span>
                  <span>Interfere with or disrupt the service or servers</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400">•</span>
                  <span>Use automated systems to access the service without permission</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400">•</span>
                  <span>Reproduce, duplicate, or copy any part of the service without authorization</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Itinerary Disclaimer */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Itinerary Disclaimer</h2>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <p className="text-sm leading-relaxed text-amber-200/90">
                <strong className="text-amber-100">Important:</strong> Itineraries generated by Outora are
                recommendations based on available data and AI algorithms. We do not guarantee:
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-amber-200/80">
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Accuracy of business hours, prices, or availability</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Quality or suitability of recommended locations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Safety or accessibility of suggested routes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400">•</span>
                  <span>Weather accuracy or real-time conditions</span>
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-amber-200/90">
                Always verify information independently and use your own judgment when following itineraries.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Third-Party Services</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                Outora integrates with third-party services (Google Maps, weather APIs, etc.) to provide
                comprehensive itinerary planning. These services are governed by their own terms and conditions.
                We are not responsible for the availability, accuracy, or functionality of third-party services.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Intellectual Property</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                The Outora platform, including its design, features, and content, is protected by copyright,
                trademark, and other intellectual property laws. You may not copy, modify, distribute, or
                create derivative works without our express written permission.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Itineraries you generate are yours to use, share, and modify as you wish.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Limitation of Liability</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                To the maximum extent permitted by law, Outora and its affiliates shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
                intangible losses resulting from:
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-zinc-500">•</span>
                  <span>Your use or inability to use the service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-zinc-500">•</span>
                  <span>Any conduct or content of third parties on the service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-zinc-500">•</span>
                  <span>Unauthorized access to or alteration of your data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-zinc-500">•</span>
                  <span>Errors, inaccuracies, or omissions in itinerary recommendations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Service Modifications */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Service Modifications</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                We reserve the right to modify, suspend, or discontinue any part of the service at any time
                without prior notice. We may also update these Terms of Service periodically. Continued use
                of the service after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Termination</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                We may terminate or suspend your account and access to the service immediately, without prior
                notice, for any reason, including if you breach these Terms of Service. You may also delete
                your account at any time through your account settings.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Governing Law</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                These Terms shall be governed by and construed in accordance with applicable laws, without
                regard to conflict of law provisions. Any disputes arising from these Terms or your use of
                the service shall be resolved through binding arbitration.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Contact Us</h2>
            <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-4 text-base font-medium text-cyan-400">
                <a href="mailto:support@outora.com" className="transition-colors hover:text-cyan-300">
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

export default Terms;
