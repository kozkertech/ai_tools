import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="KozkerTech Logo" className="h-8 w-auto" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">KozkerTech</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              KozkerTech is an AI-powered business execution platform helping founders, teams, and enterprises launch, grow, and scale using intelligent tools.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tool Suites */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Tool Suites</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/launchpad"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  LaunchPad
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">AI Launch Toolkit</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/growthsuite"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  GrowthSuite
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">AI Growth Automation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intelligence"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Intelligence
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">AI Decision Platform</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Free AI Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Free AI Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  Explore All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/domain-name-generator"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Domain Name Genie
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ai-business-plan-generator"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Business Plan Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/proposal-draft-generator"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Proposal Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/power-bi-measure"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  Power BI Measure Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <Link
                  href="mailto:info@kozkertech.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  info@kozkertech.com
                </Link>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <Link
                  href="tel:+91 7306261147"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                >
                  +91 73062-61147 
                </Link>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  11/927,1st Floor Adithya Shopping Complex
                  <br />
                  Kochupally Road , Thoppumpady
                  <br/>
                  Kochi, Kerala, India, PO. 682005
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start Using AI to Build Your Business Today
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All tools are free. No credit card required.
              </p>
            </div>
            <Button asChild className="flex-shrink-0">
              <Link href="/tools">
                Explore Our Free AI Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">© 2024 KozkerTech. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
