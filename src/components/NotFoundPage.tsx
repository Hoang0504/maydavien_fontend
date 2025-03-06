import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const goHome = () => {
    if (mounted) {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for does not exist."
        />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-100"
      >
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you are looking for does not exist.
        </p>
        <button onClick={goHome} className="px-6 py-3 text-lg">
          Go Home
        </button>
      </motion.div>
    </>
  );
}
