'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16">
        {/* Hero Section */}
        <section className="container-custom mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('contactInfo')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <FiMapPin className="text-primary-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t('headquarters')}</h3>
                    <p className="text-gray-600">
                      {t('address')}<br />
                      {t('city')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="text-primary-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t('phone')}</h3>
                    <p className="text-gray-600">
                      +39 345 054 4226
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMail className="text-primary-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">
                      service.sgh.trasporti@hotmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiClock className="text-primary-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t('hours')}</h3>
                    <p className="text-gray-600">
                      {t('monFri')}<br />
                      {t('saturday')}<br />
                      {t('sunday')}<br />
                      <span className="text-primary-600 font-semibold">{t('emergencies')}: +39 345 054 4226</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="mt-8">
                <a
                  href="https://wa.me/393450544226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <FiMessageCircle className="mr-2" size={20} />
                  {t('whatsappContact')}
                </a>
              </div>

              {/* Google Maps */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2826.7878!2d10.1574!3d44.9253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478029c8f8f8f8f8%3A0x0!2zNDTCsDU1JzMxLjEiTiAxMMKwMDknMjYuNyJF!5e0!3m2!1sen!2sit!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SGH Trasporti Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('sendMessage')}</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <FiSend className="mx-auto text-green-600 mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">{t('messageSent')}</h3>
                  <p className="text-green-700">{t('willRespondSoon')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('fullName')} *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="input-field"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">{t('phone')}</label>
                      <input
                        type="tel"
                        className="input-field"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('subjectLabel')} *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="">{t('selectSubject')}</option>
                      <option value="quote">{t('quoteRequest')}</option>
                      <option value="booking">{t('bookingRequest')}</option>
                      <option value="info">{t('generalInfo')}</option>
                      <option value="complaint">{t('complaint')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('message')} *</label>
                    <textarea
                      required
                      rows={6}
                      className="input-field"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t('writeMessage')}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    <FiSend className="inline mr-2" />
                    {t('send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
