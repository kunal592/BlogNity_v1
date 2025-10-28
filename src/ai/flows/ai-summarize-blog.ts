'use server';

/**
 * @fileOverview A blog post summarization AI agent.
 *
 * - aiSummarizeBlog - A function that summarizes a blog post.
 * - AiSummarizeBlogInput - The input type for the aiSummarizeBlog function.
 * - AiSummarizeBlogOutput - The return type for the aiSummarizeBlog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSummarizeBlogInputSchema = z.object({
  blogContent: z.string().describe('The content of the blog post to summarize.'),
});
export type AiSummarizeBlogInput = z.infer<typeof AiSummarizeBlogInputSchema>;

const AiSummarizeBlogOutputSchema = z.object({
  summary: z.string().describe('A short summary of the blog post.'),
});
export type AiSummarizeBlogOutput = z.infer<typeof AiSummarizeBlogOutputSchema>;

export async function aiSummarizeBlog(input: AiSummarizeBlogInput): Promise<AiSummarizeBlogOutput> {
  return aiSummarizeBlogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSummarizeBlogPrompt',
  input: {schema: AiSummarizeBlogInputSchema},
  output: {schema: AiSummarizeBlogOutputSchema},
  prompt: `You are an expert summarizer. Please provide a concise summary of the following blog post content:\n\n{{{blogContent}}}`, 
});

const aiSummarizeBlogFlow = ai.defineFlow(
  {
    name: 'aiSummarizeBlogFlow',
    inputSchema: AiSummarizeBlogInputSchema,
    outputSchema: AiSummarizeBlogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
