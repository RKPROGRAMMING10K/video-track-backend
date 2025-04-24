export function mergeIntervals(intervals) {
    if (!intervals.length) return [];
  
    intervals.sort((a, b) => a[0] - b[0]);
  
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const [lastStart, lastEnd] = merged[merged.length - 1];
      const [currentStart, currentEnd] = intervals[i];
  
      if (currentStart <= lastEnd) {
        merged[merged.length - 1][1] = Math.max(lastEnd, currentEnd);
      } else {
        merged.push([currentStart, currentEnd]);
      }
    }
    return merged;
  }
  
  export function calculateUniqueSeconds(mergedIntervals) {
    return mergedIntervals.reduce((sum, [start, end]) => sum + (end - start), 0);
  }
  