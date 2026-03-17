import { motion } from "framer-motion";

export default function Loader({ type }) {

  if (type === "disease") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="origin-bottom text-6xl"
        >
          🌱
        </motion.div>

        <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200">
          Plant is growing... Detecting disease 🌿
        </p>
      </div>
    );
  }

  if (type === "weather") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl"
        >
          🌧
        </motion.div>
        <p className="mt-6 text-lg">Analyzing weather patterns...</p>
      </div>
    );
  }

  if (type === "market") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ x: [-40, 40, -40] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          🚜
        </motion.div>
        <p className="mt-6 text-lg">Fetching market prices...</p>
      </div>
    );
  }

  if (type === "fertilizer") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          👨‍🌾
        </motion.div>
        <p className="mt-6 text-lg">Preparing fertilizer recommendation...</p>
      </div>
    );
  }

  return null;
}