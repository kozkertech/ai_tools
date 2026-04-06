"use client";
import { motion } from "framer-motion";
import { ArrowRight, Box, Settings, Zap, CheckCircle } from "lucide-react";

export function WorkflowChart() {
  const steps = [
    { id: 1, icon: <Box className="w-8 h-8" />, title: "Data Ingestion", desc: "Connect any pipeline" },
    { id: 2, icon: <Settings className="w-8 h-8" />, title: "AI Processing", desc: "Intelligent analytics" },
    { id: 3, icon: <Zap className="w-8 h-8" />, title: "Automation", desc: "Execute strategies" },
    { id: 4, icon: <CheckCircle className="w-8 h-8" />, title: "Growth", desc: "Scale securely" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col md:flex-row items-center gap-4 w-full">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 30 }} 
              whileInView={{ scale: 1, opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center p-8 bg-background border border-border/50 rounded-2xl shadow-sm w-full relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-[1.5] transition-transform duration-500 ease-out"></div>
              
              <div className="p-4 bg-primary/10 text-primary rounded-xl mb-5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 shadow-sm transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.1, duration: 0.6, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="hidden md:flex flex-col justify-center text-muted-foreground/30 px-2 flex-grow"
              >
                <div className="h-[2px] w-full bg-gradient-to-r from-border to-primary/30 relative">
                   <ArrowRight className="absolute -right-3 -top-3 w-6 h-6 text-primary/50" />
                </div>
              </motion.div>
            )}
            
            {index < steps.length - 1 && (
              <div className="md:hidden py-4 text-border">
                <ArrowRight className="w-6 h-6 rotate-90 text-primary/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
