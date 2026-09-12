import { useState } from 'react';
import { Mail, Send, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import Message from '../components/Message';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo form - in production, connect to Formspree/Getform/etc.
    setSubmitted(true);
    setMessage({ type: 'success', text: t.contact.success });
  };

  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-light mb-4">
            <Mail className="w-7 h-7 text-blue" />
          </div>
          <h1 className="section-title">{t.contact.title}</h1>
          <p className="section-subtitle mx-auto">{t.contact.subtitle}</p>
        </div>

        {message && (
          <div className="mb-6">
            <Message type={message.type} message={message.text} onClose={() => setMessage(null)} autoClose />
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="input-label">{t.contact.name}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="email" className="input-label">{t.contact.email}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="input-label">{t.contact.subject}</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="message" className="input-label">{t.contact.message}</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="input resize-none"
              />
            </div>

            <button type="submit" className="btn-primary btn-lg w-full">
              <Send className="w-5 h-5" />
              {t.contact.sendBtn}
            </button>

            <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-light/50 border border-blue-200 text-sm text-secondary">
              <Info className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />
              <span>{t.contact.demo}</span>
            </div>
          </form>
        ) : (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Message Sent!</h3>
            <p className="text-secondary mb-6">{t.contact.success}</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', subject: '', message: '' });
              }}
              className="btn-secondary"
            >
              {t.contact.sendBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
