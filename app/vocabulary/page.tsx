// Vocabulary page: shows all words the learner has collected while chatting.

import VocabList from "@/components/VocabList";

export default function VocabularyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-accent-800 pixel-shadow">
          My Word Chest 📚
        </h1>
        <p className="text-sm text-slate-500">
          Every new word you meet in a conversation is saved here.
        </p>
      </div>
      <VocabList />
    </div>
  );
}
