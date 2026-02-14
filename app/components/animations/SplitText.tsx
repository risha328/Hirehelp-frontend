'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    animationProps?: any;
}

export default function SplitText({
    text,
    className = '',
    delay = 0,
    animationProps = {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { type: 'spring', damping: 12, stiffness: 100 }
    }
}: SplitTextProps) {
    const words = text.split(' ');

    return (
        <span className={`inline-flex flex-wrap ${className}`}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-flex overflow-hidden mr-[0.2em]">
                    {word.split('').map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            initial={animationProps.initial}
                            animate={animationProps.animate}
                            transition={{
                                ...animationProps.transition,
                                delay: delay + (wordIndex * 0.1) + (charIndex * 0.03)
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                    {/* Add space after word if it's not the last one */}
                    {wordIndex !== words.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
            ))}
        </span>
    );
}
