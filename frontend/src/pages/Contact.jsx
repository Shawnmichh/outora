import AppLayout from '../layouts/AppLayout';

function Contact() {
  return (
    <AppLayout>
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
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
              <span className="text-sm font-medium text-zinc-400">Get in Touch</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Have questions, feedback, or need support? We're here to help.
          </p>
        </header>

        {/* Contact Options */}
        <div className="relative space-y-6">
          {/* Email Support */}
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 backdrop-blur-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">Email Support</h2>
                <p className="mt-3 text-base leading-relaxed text-zinc-400">
                  For general inquiries, support requests, or feedback, reach out to us at:
                </p>
                <a
                  href="mailto:support@outora.com"
                  className="mt-4 inline-flex items-center gap-2 text-lg font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  support@outora.com
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Response Time</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Suggestion */}
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-amber-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Before You Email</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Check if your question is answered in our documentation or try regenerating your itinerary
                  if you're experiencing issues.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Welcome */}
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-violet-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Feedback Welcome</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  We value your input and are constantly working to improve Outora. Share your ideas,
                  suggestions, or feature requests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="relative mt-16 text-center">
          <p className="text-sm leading-relaxed text-zinc-500">
            Thank you for being part of the Outora community.
            <br />
            We're committed to making your exploration experiences exceptional.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

export default Contact;
