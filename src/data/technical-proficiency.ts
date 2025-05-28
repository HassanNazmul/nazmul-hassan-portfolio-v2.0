export interface TechnicalCategory {
  title: string
  color: string
  skills: string[]
}

export const technicalProficiencyData: TechnicalCategory[] = [
  {
    title: "Programming",
    color: "blue",
    skills: ["Python", "TypeScript/JavaScript", "SQL", "Go (Learning)"],
  },
  {
    title: "Backend & APIs",
    color: "cyan",
    skills: ["Django", "FastAPI", "RESTful APIs", "PostgreSQL/MySQL"],
  },
  {
    title: "AI & Data Science",
    color: "green",
    skills: ["NLP", "Machine Learning", "TensorFlow", "NumPy/Pandas"],
  },
  {
    title: "Tools & Platforms",
    color: "teal",
    skills: ["Git/GitHub", "React/Next.js", "AWS", "Docker"],
  },
]
