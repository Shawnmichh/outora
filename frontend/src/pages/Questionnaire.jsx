import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import QuestionnaireForm from '../components/questionnaire/QuestionnaireForm';
import { ROUTES } from '../routes/paths';

function Questionnaire() {
  return (
    <AppLayout>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-lg -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]"
          aria-hidden="true"
        />

        {/* Header */}
        <header className="relative mb-12 text-center sm:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-zinc-400">Step 2 · Questionnaire</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Plan your perfect outing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Answer a few questions and we&apos;ll craft a personalized itinerary for you.
          </p>
        </header>

        <QuestionnaireForm />

        <div className="mt-8 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default Questionnaire;
