import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import QuestionnaireForm from '../components/questionnaire/QuestionnaireForm';
import { ROUTES } from '../routes/paths';

function Questionnaire() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-left sm:mb-12">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Plan your outing
          </h1>

          <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
          Answer a few questions and we'll put together an itinerary for your day.
          </p>
        </header>

        <QuestionnaireForm />

        <div className="mt-8 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
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