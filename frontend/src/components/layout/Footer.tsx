import Link from 'next/link';
import { FaTruck, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaTruck className="text-primary-400 text-3xl" />
              <span className="text-2xl font-bold">SGH Trasporti</span>
            </div>
            <p className="text-gray-400 mb-4">
              Soluzioni professionali di trasporto e logistica per le tue esigenze aziendali.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Rapidi</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">Chi Siamo</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-primary-400 transition-colors">Servizi</Link></li>
              <li><Link href="/fleet" className="text-gray-400 hover:text-primary-400 transition-colors">Flotta</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-primary-400 transition-colors">Lavora con Noi</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contatti</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servizi</h3>
            <ul className="space-y-2">
              <li><Link href="/services#local" className="text-gray-400 hover:text-primary-400 transition-colors">Trasporti Locali</Link></li>
              <li><Link href="/services#national" className="text-gray-400 hover:text-primary-400 transition-colors">Trasporti Nazionali</Link></li>
              <li><Link href="/services#refrigerated" className="text-gray-400 hover:text-primary-400 transition-colors">Trasporti Refrigerati</Link></li>
              <li><Link href="/services#oversized" className="text-gray-400 hover:text-primary-400 transition-colors">Carichi Speciali</Link></li>
              <li><Link href="/tracking" className="text-gray-400 hover:text-primary-400 transition-colors">Tracking</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                <span className="text-gray-400">Via Esempio 123, 00100 Roma, Italia</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-400" />
                <a href="tel:+39123456789" className="text-gray-400 hover:text-primary-400">+39 123 456 789</a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400" />
                <a href="mailto:info@sghtrasporti.com" className="text-gray-400 hover:text-primary-400">info@sghtrasporti.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SGH Trasporti. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
