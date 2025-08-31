import {
  FileText,
  Github ,
  Linkedin
} from "lucide-react";

export default function Footer()
{
    return(
        <footer
        id="contact"
        className=" border-t border-border py-12 px-4"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">
                  Smart Resume
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Build professional resumes with AI-powered templates and land
                your dream job.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#templates"
                    className="hover:text-foreground transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Connect
              </h4>
              <div className="flex space-x-6">
                <a
                  href="https://github.com/karanprajapat824"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github />
                </a>
                <a
                  href="https://linkedin.com/in/karanprajapat824"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin />
                </a>
              </div>
            </div>
          </div>

          <div className=" pt-4 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Smart Resume Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
}