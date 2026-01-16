"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Başlangıç: Görünmez ve 20px aşağıda
      animate={{ opacity: 1, y: 0 }}  // Bitiş: Görünür ve yerinde
      transition={{ duration: 0.4, ease: "easeOut" }} // Süre: 0.4 saniye, yumuşak duruş
      className="w-full"
    >
      {children}
    </motion.div>
  );
}