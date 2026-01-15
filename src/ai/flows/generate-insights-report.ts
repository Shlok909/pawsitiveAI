'use server';

/**
 * @fileOverview Analyzes a dog's video or image and generates an insights report.
 *
 * - generateInsightsReport - A function that handles the analysis and report generation process.
 * - GenerateInsightsReportInput - The input type for the generateInsightsReport function.
 * - GenerateInsightsReportOutput - The return type for the generateInsightsReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsReportInputSchema = z.object({
  mediaUrl: z
    .string()
    .url()
    .describe(
      "A public URL to a video or image of a dog."
    ),
  breed: z.string().describe('The breed of the dog.'),
  age: z.number().describe('The age of the dog in years.'),
});
export type GenerateInsightsReportInput = z.infer<typeof GenerateInsightsReportInputSchema>;

const GenerateInsightsReportOutputSchema = z.object({
  emotion: z.enum([
    'happy',
    'anxious',
    'fear',
    'aggressive',
    'pain',
    'neutral',
  ]).describe('The detected emotion of the dog.'),
  confidence: z.number().describe('The confidence level of the emotion detection (0-100).'),
  translation: z.string().describe('A human-readable translation of the dog\'s emotion.'),
  bodyLanguage: z.object({
    tail: z.enum(['high_wag', 'low', 'still', 'tucked']).describe('The position and movement of the dog\'s tail.'),
    ears: z.enum(['forward', 'flat', 'back', 'perked']).describe('The position of the dog\'s ears.'),
    posture: z.enum(['relaxed', 'tense', 'crouched', 'play_bow']).describe('The dog\'s overall posture.'),
    eyes: z.enum(['soft', 'hard', 'whale_eye']).describe('The appearance of the dog\'s eyes.'),
    mouth: z.enum(['relaxed', 'pant', 'lip_lick', 'snarl']).describe('The state of the dog\'s mouth.'),
  }).describe('A breakdown of the dog\'s body language.'),
  health: z.object({
    gait: z.enum(['normal', 'limping', 'stiff']).describe('The dog\'s gait analysis.'),
    eyes: z.enum(['clear', 'red', 'cloudy']).describe('The clarity of the dog\'s eyes.'),
    breathing: z.enum(['normal', 'heavy', 'labored']).describe('The dog\'s breathing rate and effort.'),
    skin: z.enum(['healthy', 'irritated']).describe('The condition of the dog\'s skin.'),
    urgency: z.enum(['green', 'yellow', 'red']).describe('An urgency meter indicating the severity of any health concerns.'),
  }).describe('A check of the dog\'s health and vital signs.'),
  tips: z.array(z.string()).describe('Actionable tips for the user based on the analysis.'),
});
export type GenerateInsightsReportOutput = z.infer<typeof GenerateInsightsReportOutputSchema>;

export async function generateInsightsReport(
  input: GenerateInsightsReportInput
): Promise<GenerateInsightsReportOutput> {
  return generateInsightsReportFlow(input);
}

const generateInsightsReportPrompt = ai.definePrompt({
  name: 'generateInsightsReportPrompt',
  input: {schema: GenerateInsightsReportInputSchema},
  output: {schema: GenerateInsightsReportOutputSchema},
  prompt: `Analyze this dog video/image as veterinary behaviorist. Dog details: BREED: {{{breed}}}, AGE: {{{age}}}.\n\nMedia: {{media url=mediaUrl}}\n\nReturn JSON only:\n{\n  "emotion": "happy|anxious|fear|aggressive|pain|neutral",
  "confidence": 87,
  "translation": "Human readable message",
  "body_language": {\n    "tail": "high_wag|low|still|tucked",
    "ears": "forward|flat|back|perked",
    "posture": "relaxed|tense|crouched|play_bow",
    "eyes": "soft|hard|whale_eye",
    "mouth": "relaxed|pant|lip_lick|snarl"\n  },\n  "health": {\n    "gait": "normal|limping|stiff",
    "eyes": "clear|red|cloudy",
    "breathing": "normal|heavy|labored",
    "skin": "healthy|irritated",
    "urgency": "green|yellow|red"\n  },\n  "tips": ["Walk now", "Monitor ears", "Try calming treats"]\n}`,
});

const generateInsightsReportFlow = ai.defineFlow(
  {
    name: 'generateInsightsReportFlow',
    inputSchema: GenerateInsightsReportInputSchema,
    outputSchema: GenerateInsightsReportOutputSchema,
  },
  async input => {
    const {output} = await generateInsightsReportPrompt(input);
    return output!;
  }
);
