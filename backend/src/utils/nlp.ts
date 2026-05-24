// Simple heuristic NLP logic for extracting tags and generating summary

const COMMON_STOP_WORDS = new Set(['the', 'is', 'at', 'which', 'and', 'on', 'a', 'an', 'of', 'in', 'to', 'for', 'with', 'about', 'as', 'by', 'this', 'that', 'we', 'will', 'are', 'be', 'it', 'or', 'you', 'your', 'from']);

export function extractTags(description: string, maxTags = 4): string[] {
  // Extract words, lowercased, only alpha
  const words = description.toLowerCase().match(/\b[a-z]+\b/g) || [];
  
  // Frequency map
  const freq: Record<string, number> = {};
  for (const word of words) {
    if (word.length > 3 && !COMMON_STOP_WORDS.has(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  // Sort by frequency
  const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  
  // Take top N
  return sorted.slice(0, maxTags);
}

export function generateSummary(description: string): string {
  // First sentence or first 100 characters
  const sentences = description.split(/[.!?]/);
  let summary = sentences[0] ? sentences[0].trim() : description.trim();
  
  if (summary.length > 100) {
    summary = summary.substring(0, 97) + '...';
  } else if (!summary.endsWith('.')) {
    summary += '.';
  }
  
  return summary;
}
