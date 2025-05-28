export interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  github: string
  demo?: string
  category: "ml" | "web" | "data"
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Eye Disease Classifier",
    description:
      "Built deep learning models (CNN and Vision Transformer) using TensorFlow to classify 10 eye diseases from a medical image dataset. Achieved up to 87% test accuracy with comprehensive preprocessing, training, and evaluation.",
    image: "/eye-disease-classifier.png",
    tags: ["Python", "TensorFlow", "CNN", "Vision Transformer", "Medical Imaging"],
    github: "https://github.com/nazmulhassan/eye-disease-classifier",
    demo: "https://eye-disease-classifier.example.com",
    category: "ml",
    featured: true,
  },
  {
    id: 2,
    title: "Fraud Detection System",
    description:
      "Developed machine learning models (Logistic Regression, Random Forest, XGBoost, LightGBM) to detect fraudulent credit card transactions. Performed exploratory analysis and model evaluation using F1-score and AUC-ROC.",
    image: "/fraud-detection-system.png",
    tags: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "Data Analysis"],
    github: "https://github.com/nazmulhassan/fraud-detection",
    category: "ml",
    featured: true,
  },
  {
    id: 3,
    title: "Plant Disease Detection",
    description:
      "Trained a CNN model on the Plant-Village dataset to classify multiple plant diseases, achieving 100% test accuracy. Includes preprocessing, training, and deployment for real-world agricultural applications.",
    image: "/plant-disease-detection.png",
    tags: ["Python", "TensorFlow", "CNN", "Image Classification", "Agriculture"],
    github: "https://github.com/nazmulhassan/plant-disease-detection",
    demo: "https://plant-disease-detection.example.com",
    category: "ml",
    featured: true,
  },
  {
    id: 4,
    title: "Custom CRM System",
    description:
      "Designed and developed a custom CRM system for Switz Energy using Django (backend) and React (frontend). Built secure, scalable RESTful APIs for customer data, service tracking, and workflow automation.",
    image: "/crm-system.png",
    tags: ["Python", "Django", "React", "RESTful API", "PostgreSQL"],
    github: "https://github.com/nazmulhassan/crm-system",
    category: "web",
    featured: false,
  },
  {
    id: 5,
    title: "AI Content Detection",
    description:
      "Research-based project focused on developing models to detect AI-generated content through linguistic and statistical analysis. Part of MSc Artificial Intelligence research at Queen Mary University of London.",
    image: "/ai-content-detection.png",
    tags: ["Python", "NLP", "Machine Learning", "Text Analysis", "Research"],
    github: "https://github.com/nazmulhassan/ai-content-detection",
    demo: "https://ai-content-detection.example.com",
    category: "ml",
    featured: false,
  },
]
