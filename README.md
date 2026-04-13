# KozkerTech AI Tools Platform

## 📌 Overview
The KozkerTech AI Tools Platform is a comprehensive, free generative AI ecosystem built to help businesses, startups, and enterprises launch, grow, and scale. Designed with a premium, user-friendly interface, it provides a powerful suite of over 20+ specialized AI workflows. From generating domain names to writing sales scripts, automating content creation, and cleaning data—this platform allows users to leverage artificial intelligence to execute strategies instantly without needing custom prompt engineering.

## 🚀 Features
- **LaunchPad for Startups:** Includes tools like Domain Name Genie, AI Business Plan Generator, Tagline & Value Prop Creator, and Pricing Generator.
- **GrowthSuite for Marketing & Sales:** Includes Proposal Draft Generator, Follow-up Email Sequencer, Blog Generator, Customer Persona Generator, and SEO Keyword Analyzer.
- **Intelligence for Analytics:** Built-in Data Cleanse tools, Power BI Measure generators, and Meeting Summary Extractors to derive quick insights.
- **Modern & Responsive UI:** Built with an Apple-inspired minimalist design, featuring dark mode, glassmorphism, scroll reveals, and smooth interactive animations via Framer Motion.
- **Form Validations:** Robust client-side validation built on top of React Hook Form and Zod to ensure quality input payload processing.
- **Zero-Friction Access:** Fully free-to-use, allowing users to start generating materials in minutes.

## 🛠️ Tech Stack

**Frontend**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library:** [React 18](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Components:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

**Backend & APIs**
- **API Engine:** Next.js Serverless API routes (`/api`)
- **Data Fetching:** Next.js server components and built-in edge handlers
- **Integrations:** n8n Webhook integrations for external AI processing & Ghost Content API for potential CMS interactions.

**Tools & Utilities**
- **Language:** TypeScript
- **State/Form Management:** React Hook Form & Zod
- **Themeing:** `next-themes` for seamless light/dark mode toggling.

## 📂 Project Structure
```text
kozker_tools_new/
├── app/                  # Next.js App Router root
│   ├── api/              # Serverless API endpoints
│   ├── tools/            # Directory containing all 22+ AI generation tools
│   ├── launchpad/        # Landing page & suite for startup tools
│   ├── growthsuite/      # Landing page for scale/marketing tools
│   ├── intelligence/     # Landing page for BI and analytics tools
│   ├── layout.tsx        # Global layout configuration & theme provider
│   └── page.tsx          # Main index/landing page with hero sections
├── components/           # Reusable UI components (shadcn ui, layout elements)
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions, SEO config, schemas & matching engine
├── public/               # Static assets (images, icons)
├── scripts/              # Custom scripts for platform maintenance
├── styles/               # Global CSS & Tailwind configurations
└── package.json          # Project metadata and dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or above recommended)
- `npm` or `pnpm` (the project includes a `pnpm-lock.yaml`)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd kozker_tools_new
   ```

2. **Install dependencies:**
   Using pnpm is recommended based on the lockfile:
   ```bash
   pnpm install
   # Or using npm:
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory. Add necessary variables depending on external integrations (like Webhook URLs for n8n/make.com, Ghost API keys, or Resend API keys).
   ```env
   # Example
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   The application will start at `http://localhost:3000`.

## ▶️ Usage
- **Home Page (`/`)**: Displays the main landing page, demonstrating value propositions, AI sub-suites, and use cases.
- **Tools Dashboard (`/tools`)**: Navigate to this directory to browse the list of available generative AI tools. 
- **Tool Execution**: Click on any specific tool (e.g., Domain Name Genie), fill out the dynamic input fields, and submit to trigger the API backend or external webhooks handling the generation layer. Output results will be rendered via dynamic preview cards.

## 🔌 API Endpoints
- `POST /api/domain-genie` — Invokes generation algorithms to suggest brandable domain names and availability.
- `POST /api/form-submit` — General submission pipeline handler, routing tool inputs towards logic execution.

## 🧠 Key Learnings / Highlights
- **Dynamic Tool Matrix Engine**: The `.tsx` views under `/app/tools/...` demonstrate robust handling of structured multi-step forms utilizing Zod schemas tailored for diverse prompts.
- **Interactive Framer Components**: The usage of `ScrollReveal` and parallax tools creates a "wow" factor upon initial load—retaining the premium aesthetic of enterprise-grade software.
- **Workflow Automation Ready**: Tool payload architectures easily support forwarding inputs visually to workflow engines (like n8n) and waiting for parsed JSON results asynchronously.

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
