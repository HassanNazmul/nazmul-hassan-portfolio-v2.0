import { contactInfo, availabilityInfo } from "@/data/contact"
import { Terminal } from "lucide-react"

export default function ContactInfo() {
  return (
    <div className="tech-card h-full">
      <h3 className="text-2xl font-semibold text-white mb-6 font-orbitron">Contact Information</h3>

      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="p-3 rounded-lg bg-zinc-800/50 mr-4">
              <item.icon className={`h-6 w-6 text-${item.color}-400`} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white font-orbitron">{item.title}</h4>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-slate-400 hover:text-${item.color}-400 transition-colors font-mono`}
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-slate-400 font-mono">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-lg bg-zinc-800/30 border border-zinc-700">
        <h4 className="text-lg font-medium text-white mb-3 font-orbitron flex items-center">
          <Terminal className="h-5 w-5 mr-2 text-cyan-500" />
          Availability
        </h4>
        <p className="text-slate-400 mb-4 font-mono">{availabilityInfo.message}</p>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full ${availabilityInfo.isAvailable ? "bg-green-500" : "bg-yellow-500"} mr-2 pulse`}
          ></div>
          <span className={`${availabilityInfo.isAvailable ? "text-green-400" : "text-yellow-400"} text-sm font-mono`}>
            {availabilityInfo.status}
          </span>
        </div>
      </div>
    </div>
  )
}
