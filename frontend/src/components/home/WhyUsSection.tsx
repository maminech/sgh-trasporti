'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaMapMarkedAlt, FaTruck, FaHeadset } from 'react-icons/fa';

export default function WhyUsSection() {
  const features = [
    {
      icon: FaCheckCircle,
      title: 'Affidabilità',
      description: 'Consegne puntuali garantite con tasso di successo del 99.5%',
    },
    {
      icon: FaMapMarkedAlt,
      title: 'Tracking in Tempo Reale',
      description: 'Monitora le tue spedizioni in ogni momento con aggiornamenti live',
    },
    {
      icon: FaTruck,
      title: 'Flotta Moderna',
      description: 'Veicoli nuovi e ben mantenuti con tecnologia GPS avanzata',
    },
    {
      icon: FaHeadset,
      title: 'Supporto 24/7',
      description: 'Assistenza clienti sempre disponibile per qualsiasi esigenza',
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
            Perché Scegliere SGH Trasporti
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Il partner ideale per tutte le tue esigenze di trasporto
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
