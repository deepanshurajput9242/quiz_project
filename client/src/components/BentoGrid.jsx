import { motion } from 'framer-motion';
import { CheckCircle2, BarChart3, Users, Zap, Globe, Lock } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to excel</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed for modern education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {/* Large Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="md:col-span-2 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden group"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="p-3 bg-white/10 backdrop-blur rounded-xl w-fit mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-purple-100 max-w-md">
                Get detailed insights into student performance with interactive charts and real-time data tracking.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mt-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-[75%]" />
                </div>
                <span className="font-mono font-bold">75%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[45%]" />
                </div>
                <span className="font-mono font-bold">45%</span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mb-16" />
        </motion.div>

        {/* Tall Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="md:row-span-2 rounded-3xl bg-white border border-gray-100 shadow-xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-50 via-transparent to-transparent" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Classroom Management</h3>
            <p className="text-muted-foreground mb-8">
              Easily manage students, assign quizzes, and track progress for entire classes or individual students.
            </p>
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-2 w-16 bg-gray-100 rounded" />
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Small Card 1 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-3xl bg-white border border-gray-100 shadow-lg p-8 flex flex-col justify-between"
        >
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Instant Grading</h3>
            <p className="text-muted-foreground text-sm">Save time with automated grading for all question types.</p>
          </div>
        </motion.div>

        {/* Small Card 2 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-3xl bg-gray-900 text-white p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="p-3 bg-white/10 backdrop-blur rounded-xl w-fit relative z-10">
            <Lock className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Secure Testing</h3>
            <p className="text-gray-400 text-sm">Anti-cheat measures and secure environment.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
