import { Code, Database, Brain, MessageSquare, Server, Layout, Cpu, BarChart, GitBranch, Workflow } from "lucide-react"
import type React from "react"

export interface Skill {
  name: string
  icon: React.ReactNode
  description: string
  level: number
  tags: string[]
  category: string
}

export const skills: Skill[] = [
  {
    name: "Python",
    icon: <Code className="h-8 w-8 text-blue-400" />,
    description:
      "Proficient in Python programming with experience in backend development, data analysis, and machine learning applications.",
    level: 95,
    tags: ["Django", "FastAPI", "NumPy", "Pandas", "Matplotlib"],
    category: "languages",
  },
  {
    name: "TypeScript",
    icon: <Code className="h-8 w-8 text-blue-500" />,
    description:
      "Experienced in TypeScript for building type-safe applications, particularly in frontend and Node.js environments.",
    level: 85,
    tags: ["React", "Next.js", "Node.js", "Type Safety", "JavaScript"],
    category: "languages",
  },
  {
    name: "Go",
    icon: <Code className="h-8 w-8 text-cyan-500" />,
    description: "Working knowledge of Go for building efficient, concurrent backend services and microservices.",
    level: 75,
    tags: ["Concurrency", "Microservices", "API Development", "Performance", "Backend"],
    category: "languages",
  },
  {
    name: "Machine Learning",
    icon: <Brain className="h-8 w-8 text-green-400" />,
    description:
      "Experience in developing machine learning models for classification, regression, and computer vision tasks.",
    level: 90,
    tags: ["Scikit-learn", "TensorFlow", "PyTorch", "Feature Engineering", "Model Evaluation"],
    category: "ai",
  },
  {
    name: "Natural Language Processing",
    icon: <MessageSquare className="h-8 w-8 text-cyan-400" />,
    description: "Specialized in NLP techniques with a focus on AI-generated content detection and text analysis.",
    level: 85,
    tags: ["Text Classification", "Content Detection", "Transformers", "BERT", "Sentiment Analysis"],
    category: "ai",
  },
  {
    name: "Backend Development",
    icon: <Server className="h-8 w-8 text-blue-400" />,
    description: "Experienced in designing and implementing RESTful APIs and backend services.",
    level: 90,
    tags: ["Django", "FastAPI", "RESTful APIs", "PostgreSQL", "Microservices"],
    category: "development",
  },
  {
    name: "Database Management",
    icon: <Database className="h-8 w-8 text-green-400" />,
    description: "Experienced in designing, optimizing, and managing relational databases.",
    level: 85,
    tags: ["PostgreSQL", "MySQL", "Database Optimization", "SQL", "BigQuery"],
    category: "data",
  },
  {
    name: "Frontend Development",
    icon: <Layout className="h-8 w-8 text-teal-400" />,
    description: "Skilled in building responsive and interactive user interfaces with modern frameworks.",
    level: 80,
    tags: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
    category: "development",
  },
  {
    name: "DevOps & Cloud",
    icon: <Cpu className="h-8 w-8 text-cyan-400" />,
    description: "Knowledge of containerization, version control, and cloud services for application deployment.",
    level: 75,
    tags: ["Docker", "GitHub", "AWS", "Linux", "Postman"],
    category: "development",
  },
  {
    name: "Data Engineering",
    icon: <BarChart className="h-8 w-8 text-blue-400" />,
    description: "Skilled in data processing, transformation, and building efficient data pipelines.",
    level: 80,
    tags: ["Data Processing", "ETL", "Data Visualization", "BigQuery", "Data Analysis"],
    category: "data",
  },
  {
    name: "Version Control",
    icon: <GitBranch className="h-8 w-8 text-purple-400" />,
    description: "Experienced with version control systems and collaborative development workflows.",
    level: 85,
    tags: ["Git", "GitHub", "Branching Strategies", "Pull Requests", "Code Reviews"],
    category: "development",
  },
  {
    name: "Software Engineering Practices",
    icon: <Workflow className="h-8 w-8 text-rose-400" />,
    description: "Experienced in applying software engineering best practices and methodologies.",
    level: 80,
    tags: ["Agile", "Waterfall", "CI/CD", "Test-Driven Development", "Code Quality"],
    category: "development",
  },
]

// Category configuration with colors and icons
export const categoryConfig = {
  languages: {
    color: "from-blue-500 to-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  ai: {
    color: "from-green-500 to-emerald-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  development: {
    color: "from-cyan-500 to-teal-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  data: {
    color: "from-purple-500 to-indigo-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
}
