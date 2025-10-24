'use client';

import { motion } from 'framer-motion';
import { FaTruck, FaSnowflake, FaBox, FaShippingFast, FaWarehouse, FaGlobe } from 'react-icons/fa';

export default function ServicesSection() {
  const services = [
    {
      icon: FaTruck,
      title: 'Trasporti Locali',
      description: 'Servizi di consegna rapidi e affidabili nella tua zona',
      color: 'bg-blue-500',
    },
    {
      icon: FaGlobe,
      title: 'Trasporti Nazionali',
      description: 'Copertura completa in tutta Italia con consegne puntuali',
      color: 'bg-green-500',
    },
    {
      icon: FaSnowflake,
      title: 'Trasporti Refrigerati',
      description: 'Trasporto a temperatura controllata per merci deperibili',
      color: 'bg-cyan-500',
    },
    {
      icon: FaBox,
      title: 'Carichi Speciali',
      description: 'Gestione di carichi fuori misura e carichi pesanti',
      color: 'bg-purple-500',
    },
    {
      icon: FaWarehouse,
      title: 'Logistica e Magazzino',
      description: 'Soluzioni complete di stoccaggio e distribuzione',
      color: 'bg-orange-500',
    },
    {
      icon: FaShippingFast,
      title: 'Consegne Express',
      description: 'Servizi urgenti con consegna garantita in 24h',
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
            I Nostri Servizi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Soluzioni di trasporto complete per ogni esigenza
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
