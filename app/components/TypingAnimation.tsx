'use client';

import { useState, useEffect } from 'react';

interface TypingAnimationProps {
    words: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
    cursorClassName?: string;
}

export default function TypingAnimation({
    words,
    typingSpeed = 150,
    deletingSpeed = 100,
    pauseDuration = 2000,
    className = "",
    cursorClassName = "text-blue-500"
}: TypingAnimationProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = words[currentWordIndex];
        let timeout: NodeJS.Timeout;

        if (isDeleting) {
            timeout = setTimeout(() => {
                setCurrentText(word.substring(0, currentText.length - 1));
            }, deletingSpeed);
        } else {
            timeout = setTimeout(() => {
                setCurrentText(word.substring(0, currentText.length + 1));
            }, typingSpeed);
        }

        if (!isDeleting && currentText === word) {
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        } else if (isDeleting && currentText === '') {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {currentText}
            <span className={`animate-pulse ml-1 ${cursorClassName}`}>|</span>
        </span>
    );
}
