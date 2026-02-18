'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoaderProps {
    variant?: 'full' | 'container' | 'inline';
    text?: string;
    subText?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Loader({
    variant = 'full',
    text = 'Loading...',
    subText,
    size = 'md'
}: LoaderProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-16 w-16',
        lg: 'h-24 w-24',
        xl: 'h-32 w-32',
    };

    const loaderContent = (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative mb-6">
                {/* Outer Glowing Ring */}
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className={`${sizeClasses[size]} rounded-full border-2 border-transparent border-t-blue-500 border-r-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                />

                {/* Inner Pulsing Circle */}
                <motion.div
                    animate={{
                        scale: [0.8, 1.1, 0.8],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 m-auto h-3/4 w-3/4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-[2px]"
                />

                {/* Center Point */}
                <div className="absolute inset-0 m-auto h-2 w-2 bg-white rounded-full shadow-[0_0_10px_white]" />
            </div>

            {text && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        {text}
                    </h3>
                    {subText && (
                        <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest">
                            {subText}
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    );

    if (variant === 'full' || variant === 'container') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${variant === 'full' ? 'fixed z-[9999]' : 'absolute z-30'} inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm`}
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Image
                        src="/images/logo-transparent.png"
                        alt="HireHelp"
                        width={320}
                        height={80}
                        className="h-20 w-auto min-w-[200px] object-contain brightness-110 opacity-80 sm:h-24 sm:min-w-[240px]"
                        priority
                    />
                </motion.div>

                {loaderContent}
            </motion.div>
        );
    }

    return loaderContent;
}
