import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t dark:bg-gray-900 dark:border-gray-800">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">Kozker</span>
              <span className="text-2xl font-bold dark:text-white">Tech</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We help Kochi's small businesses grow online fast and affordably, empowering local entrepreneurs to expand
              their digital presence.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/solutions#web-design"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  AI-Powered Web Design
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions#customer-support"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions#whatsapp"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  WhatsApp Automation
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions#power-bi"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Power BI Solutions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">+91-7306261147</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">hello@kozker.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">Kochi, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">© {currentYear} Kozker Tech. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Button variant="link" asChild className="text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="link" asChild className="text-sm text-gray-600 dark:text-gray-400">
              <Link href="/terms">Terms of Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
