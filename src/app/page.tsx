"use client";

import { FlashCard } from "@/components/flash-card";
import { Button } from "@/components/ui/button";
import conceptsData from "@/data/concepts.json";
import { getWeightedRandomIndex } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [seenConcepts, setSeenConcepts] = useState<Record<number, number>>({});
  const [difficultConcepts, setDifficultConcepts] = useState<
    Record<number, boolean>
  >({});

  // Initialize weights for each concept
  const [weights, setWeights] = useState<number[]>(
    Array(conceptsData.length).fill(1)
  );

  const updateWeights = useCallback(
    (selectedIndex: number) => {
      setWeights((prevWeights) => {
        const newWeights = [...prevWeights];

        for (let i = 0; i < newWeights.length; i++) {
          // Recently seen gets lower weight unless difficult
          if (i === selectedIndex) {
            if (!difficultConcepts[i]) {
              newWeights[i] = Math.max(0.2, newWeights[i] * 0.6);
            }
          } else {
            // Increase weights slowly over time to bring old concepts back
            newWeights[i] = Math.min(
              3,
              newWeights[i] * (difficultConcepts[i] ? 1.08 : 1.03)
            );
          }
        }

        return newWeights;
      });
    },
    [difficultConcepts]
  );

  const selectRandomConcept = useCallback(() => {
    if (weights.length === 0) return;

    // Pass currentIndex to exclude it from being selected again immediately
    const newIndex = getWeightedRandomIndex(weights, currentIndex ?? undefined);

    setSeenConcepts((prev) => ({
      ...prev,
      [newIndex]: (prev[newIndex] || 0) + 1,
    }));

    updateWeights(newIndex);
    setCurrentIndex(newIndex);
    setIsFlipped(false);
  }, [currentIndex, updateWeights, weights]);

  useEffect(() => {
    selectRandomConcept();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsDifficult = () => {
    if (currentIndex === null) return;

    setDifficultConcepts((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));

    // Immediately increase weight for this concept
    setWeights((prevWeights) => {
      const newWeights = [...prevWeights];
      newWeights[currentIndex] = Math.min(3, newWeights[currentIndex] * 1.5);
      return newWeights;
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (currentIndex === null) return <div>Loading...</div>;

  const concept = conceptsData[currentIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8 text-purple-700">
          Concept Flashcards
        </h1>

        <div className="mb-4 text-sm text-gray-500">
          Card {currentIndex + 1} of {conceptsData.length} • Seen:{" "}
          {seenConcepts[currentIndex] || 1} times •
          {difficultConcepts[currentIndex] ? " Marked as difficult" : ""}
        </div>

        <FlashCard
          concept={concept.title}
          definition={concept.definition}
          examples={concept.examples}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={markAsDifficult}
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            disabled={difficultConcepts[currentIndex]}
          >
            It was hard
          </Button>

          <Button
            onClick={selectRandomConcept}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next concept
          </Button>
        </div>
      </div>
    </main>
  );
}
