"use client";

import { Button } from "@/components/ui/button";

interface FlashCardProps {
  concept: string;
  definition: string;
  examples?: string | string[];
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashCard({
  concept,
  definition,
  examples,
  isFlipped,
  onFlip,
}: FlashCardProps) {
  const hasExamples =
    examples && (Array.isArray(examples) ? examples.length > 0 : true);

  return (
    <div className="relative w-full h-[400px]">
      <div
        className="w-full h-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          className="w-full h-full transition-transform duration-500 relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute w-full h-full rounded-xl bg-white shadow-lg p-6 flex flex-col items-center justify-between"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-center text-purple-800">
                {concept}
              </h2>
            </div>
            <Button
              onClick={onFlip}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Show definition
            </Button>
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full rounded-xl bg-white shadow-lg p-6 flex flex-col items-center justify-between"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex-1 overflow-auto w-full">
              <p className="mb-4 text-gray-700 text-left whitespace-pre-line first-letter:uppercase">
                {definition}
              </p>
              {hasExamples && (
                <div className="mt-2 text-left">
                  <h3 className="font-semibold text-purple-700">
                    Example
                    {Array.isArray(examples) && examples.length > 1 ? "s" : ""}:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {Array.isArray(examples) ? (
                      examples.map((example, idx) => (
                        <li key={idx} className="first-letter:uppercase">
                          {example}
                        </li>
                      ))
                    ) : (
                      <li className="first-letter:uppercase">{examples}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <Button
              onClick={onFlip}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Show concept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
