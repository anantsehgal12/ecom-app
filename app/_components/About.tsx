"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

function About() {
  return (
    <motion.div
      animate={{ scale: 1 }}
      initial={{ scale: 0.5 }}
      transition={{ duration: 1.25 }}
    >
      <main className="mx-15 my-10">
        <div className="about-bg bg-cover bg-center h-100 rounded-2xl flex flex-col justify-center items-center gap-10 px-25 text-center">
          <h1 className="font-bold text-4xl">About VAM Enterprises</h1>
          <h2 className="text-2xl ">
            VAM Enterprises is a premium brand that provides you exclusive and
            premium one stop gifting solution in retail and bulk.
          </h2>
          <Button className="rounded-3xl p-8 text-md" asChild>
            <Link href="/">Learn More</Link>
          </Button>
        </div>
      </main>
    </motion.div>
  );
}

export default About;
