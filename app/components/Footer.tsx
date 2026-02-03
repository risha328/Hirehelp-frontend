import Link from 'next/link';
import { 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram,
  Facebook,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Users,
  Award,
  Building
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ];

  const productLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'API Docs', href: '/api-docs' },
    { name: 'Status', href: '/status' },
    { name: 'Updates', href: '/updates' },
  ];

  const resourceLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Guides', href: '/guides' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Partners', href: '/partners' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'CCPA', href: '/ccpa' },
  ];

  const solutions = [
    { name: 'Enterprise', href: '/solutions/enterprise' },
    { name: 'Startups', href: '/solutions/startups' },
    { name: 'Recruitment Agencies', href: '/solutions/agencies' },
    { name: 'Freelancers', href: '/solutions/freelancers' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/hireflow' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/hireflow' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/hireflow' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/hireflow' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/hireflow' },
  ];

  const certifications = [
    { name: 'SOC 2 Type II', icon: Shield },
    { name: 'ISO 27001', icon: Award },
    { name: 'GDPR Compliant', icon: CheckCircle },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    HireFlow
                  </h2>
                  <p className="text-sm text-gray-400">Intelligent Hiring Platform</p>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transforming the way companies discover, engage, and hire exceptional talent worldwide.
              </p>
              
              {/* Newsletter */}
              <div className="mb-8">
                <h3 className="font-semibold text-white mb-3">Stay Updated</h3>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">No spam, unsubscribe anytime.</p>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-white mb-3">Connect With Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors group"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Solutions */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Solutions
                </h3>
                <ul className="space-y-3">
                  {solutions.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center group"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2 group-hover:bg-blue-500 transition-colors"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product */}
              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-3">
                  {productLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-3">
                  {resourceLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      {/* <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"> */}
            
            {/* Left Section */}
            {/* <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Globe className="h-4 w-4" />
                <span>English</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>


          </div> 

          {/* Contact Info */}
          {/* <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              <a href="mailto:hello@hireflow.com" className="flex items-center hover:text-white transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                hello@hireflow.com
              </a>
              <a href="tel:+11234567890" className="flex items-center hover:text-white transition-colors">
                <Phone className="h-4 w-4 mr-2" />
                +1 (123) 456-7890
              </a>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                San Francisco, CA
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Trusted by 5,000+ companies worldwide</span>
            </div>
          </div> */}
        {/* </div>
      </div> */}
      {/* </div> */}
    </footer>
    
  );
}