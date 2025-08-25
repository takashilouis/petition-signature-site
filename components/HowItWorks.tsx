import { FileText, Mail, PenTool } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Read the Petition',
    description: 'Review the petition details and understand what you\'re supporting.',
  },
  {
    icon: Mail,
    title: 'Verify Your Email',
    description: 'Enter your details and verify your email address with a secure code.',
  },
  {
    icon: PenTool,
    title: 'Add Your Signature',
    description: 'Sign digitally or type your name to complete your signature.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50" aria-labelledby="how-it-works-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="how-it-works-title" className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Signing our petition is simple, secure, and takes just a few minutes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}