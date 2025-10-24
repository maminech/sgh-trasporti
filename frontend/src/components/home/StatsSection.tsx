'use client';

import { motion } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaUsers, FaAward } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function StatsSection() {
  const t = useTranslations('home.stats');
  
  const stats = [
    { icon: FaTruck, value: '150+', label: t('trucks'), color: 'text-blue-600' },
    { icon: FaMapMarkerAlt, value: '500+', label: t('destinations'), color: 'text-green-600' },
    { icon: FaUsers, value: '2,000+', label: t('clients'), color: 'text-purple-600' },
    { icon: FaAward, value: '25+', label: t('experience'), color: 'text-orange-600' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 ${stat.color}`}>
                <stat.icon className="text-3xl" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
