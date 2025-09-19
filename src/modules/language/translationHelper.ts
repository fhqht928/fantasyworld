// src/modules/language/translationHelper.ts

export function simulateTranslation(original: string, fluency: number): string {
  if (fluency >= 90) return original;

  const words = original.split(" ");
  return words
    .map(word => {
      if (Math.random() * 100 > fluency) {
        return "??";
      }
      return word;
    })
    .join(" ");
}
