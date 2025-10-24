'use client';

import { useTranslations } from 'next-intl';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const homeT = useTranslations('home.testimonials');

  const testimonials = [
    {
      name: t('testimonial1.name'),
      text: t('testimonial1.text'),
      role: t('testimonial1.role'),
      rating: 5,
    },
    {
      name: t('testimonial2.name'),
      text: t('testimonial2.text'),
      role: t('testimonial2.role'),
      rating: 5,
    },
    {
      name: t('testimonial3.name'),
      text: t('testimonial3.text'),
      role: t('testimonial3.role'),
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {homeT('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {homeT('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <FaQuoteLeft className="text-primary-600 text-3xl mr-3" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
