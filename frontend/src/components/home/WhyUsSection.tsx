'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaMapMarkedAlt, FaTruck, FaHeadset } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function WhyUsSection() {
  const t = useTranslations('home.whyUs');
  
  const features = [
    {
      icon: FaCheckCircle,
      title: t('reliability'),
      description: t('reliability_desc'),
    },
    {
      icon: FaMapMarkedAlt,
      title: t('tracking'),
      description: t('tracking_desc'),
    },
    {
      icon: FaTruck,
      title: t('fleet'),
      description: t('fleet_desc'),
    },
    {
      icon: FaHeadset,
      title: t('support'),
      description: t('support_desc'),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 text-primary-600 mb-4">
                <feature.icon className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
