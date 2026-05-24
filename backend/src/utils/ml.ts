// Simple ML Logic for Content-Based Filtering (Cosine Similarity)

/**
 * Calculate Cosine Similarity between two arrays of strings (tags)
 */
export function calculateCosineSimilarity(tagsA: string[], tagsB: string[]): number {
  if (tagsA.length === 0 || tagsB.length === 0) return 0;

  // Create a unified dictionary of all unique tags
  const uniqueTags = Array.from(new Set([...tagsA, ...tagsB]));

  // Create vectors
  const vectorA: number[] = uniqueTags.map(tag => tagsA.includes(tag) ? 1 : 0);
  const vectorB: number[] = uniqueTags.map(tag => tagsB.includes(tag) ? 1 : 0);

  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < uniqueTags.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
  }

  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Recommend events based on user's past registered event tags
 */
export function getRecommendedEvents(
  userRegisteredEvents: { tags: string[] }[],
  allUpcomingEvents: { id: string; tags: string[] }[],
  topN = 3
) {
  // Aggregate all tags the user has interacted with
  const userInterestTags = userRegisteredEvents.flatMap(e => e.tags);
  
  if (userInterestTags.length === 0) {
    // If user has no history, return random/latest events
    return allUpcomingEvents.slice(0, topN);
  }

  // Score each upcoming event
  const scoredEvents = allUpcomingEvents.map(event => {
    const score = calculateCosineSimilarity(userInterestTags, event.tags);
    return { ...event, score };
  });

  // Sort by highest similarity score
  scoredEvents.sort((a, b) => b.score - a.score);

  // Return the top N recommendations (filter out zero scores if possible, though low scores are okay)
  return scoredEvents.slice(0, topN);
}
