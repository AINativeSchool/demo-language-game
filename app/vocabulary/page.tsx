// Vocabulary page: shows all words the learner has collected while chatting.

import VocabList from "@/components/VocabList";

export default function VocabularyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg text-accent-800 pixel-title sm:text-xl">
          Word Chest 📦
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Every new word you mine in a quest gets stashed here as loot.
        </p>
      </div>
      <VocabList />
    </div>
  );
}
