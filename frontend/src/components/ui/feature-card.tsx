"use client"

import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}


export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateY = ((x - midX) / midX) * 10; // max 10deg
        const rotateX = -((y - midY) / midY) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        }
    };

    return (
        <div className="group perspective-1000 ">
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="bg-white/30 dark:bg-white/5 h-full backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-lg transition-transform duration-200 ease-out"
            >
                <div className="bg-primary/20 dark:bg-primary/30 rounded-full p-3 w-fit mb-4 transition-transform duration-200">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-gray-700 dark:text-white/60">
                    {description}
                </p>
            </div>
        </div>
    );
}
