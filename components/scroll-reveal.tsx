"use client";
import { motion } from "framer-motion";

export function ScrollReveal({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: React.ReactNode, 
  delay?: number,
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
