'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: 'start' | 'end' | 'center';
    useOriginalCharsOnly?: boolean;
    characters?: string;
    className?: string;
    parentClassName?: string;
    animateOn?: 'view' | 'hover';
    [key: string]: any;
}

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    animateOn = 'view',
    ...props
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let iteration = 0;

        const startAnimation = () => {
            interval = setInterval(() => {
                setDisplayText((prevText) =>
                    text
                        .split('')
                        .map((char, index) => {
                            if (char === ' ') return char;
                            if (iteration > maxIterations) return text[index];
                            if (sequential && iteration > index * 2) return text[index];

                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join('')
                );

                iteration++;

                if (iteration > maxIterations + (sequential ? text.length * 2 : 0)) {
                    clearInterval(interval);
                    setDisplayText(text);
                    setIsRevealed(true);
                }
            }, speed);
        };

        if (animateOn === 'view') {
            startAnimation();
        }

        return () => clearInterval(interval);
    }, [text, speed, maxIterations, sequential, characters, animateOn]);

    return (
        <span
            className={`inline-block whitespace-pre-wrap ${parentClassName}`}
            onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
            onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
            {...props}
        >
            <span className={className}>{displayText}</span>
        </span>
    );
}
