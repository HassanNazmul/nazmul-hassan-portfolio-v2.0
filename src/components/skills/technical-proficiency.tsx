import { technicalProficiencyData } from "@/data/technical-proficiency"

export default function TechnicalProficiency() {
  return (
    <div className="mt-16 grid-pattern rounded-xl p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 scanlines">
      <h3 className="text-xl font-semibold mb-4 text-white font-orbitron">Technical Proficiency</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {technicalProficiencyData.map((category, index) => (
          <div key={index} className="space-y-4">
            <h4 className={`text-lg font-medium text-${category.color}-400 font-orbitron`}>{category.title}</h4>
            <ul className="space-y-2 text-slate-300 font-mono">
              {category.skills.map((skill, skillIndex) => (
                <li
                  key={skillIndex}
                  className="flex items-center transition-transform duration-200 hover:translate-x-1"
                >
                  <span className={`w-2 h-2 bg-${category.color}-500 rounded-full mr-2`}></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
