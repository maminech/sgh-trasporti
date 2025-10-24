'use client';

import { motion } from 'framer-motion';
import { FaTruck, FaSnowflake, FaBox, FaShippingFast, FaWarehouse, FaGlobe } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function ServicesSection() {
  const t = useTranslations('home.services');
  
  const services = [
    {
      icon: FaTruck,
      title: t('local'),
      description: t('localDesc'),
      color: 'bg-blue-500',
    },
    {
      icon: FaGlobe,
      title: t('national'),
      description: t('nationalDesc'),
      color: 'bg-green-500',
    },
    {
      icon: FaSnowflake,
      title: t('refrigerated'),
      description: t('refrigeratedDesc'),
      color: 'bg-cyan-500',
    },
    {
      icon: FaBox,
      title: t('oversized'),
      description: t('oversizedDesc'),
      color: 'bg-purple-500',
    },
    {
      icon: FaWarehouse,
      title: t('warehouse'),
      description: t('warehouseDesc'),
      color: 'bg-orange-500',
    },
    {
      icon: FaShippingFast,
      title: t('express'),
      description: t('expressDesc'),
      color: 'bg-red-500',
    },
  ];

  return (
    <section className="py-20">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
