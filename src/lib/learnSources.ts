export type LearnType = 'video' | 'article';

export type LearnSource = {
  title: string;
  source: string;
  type: LearnType;
  url: string;
};

// Куровані авторитетні AI-джерела. Лінки — на самі джерела/канали (стабільні,
// завжди валідні). YouTube — через пошук, щоб лендити на свіжі відео автора.
export const LEARN_SOURCES: LearnSource[] = [
  // --- Videos ---
  {
    title: 'Matt Wolfe — AI news & tools',
    source: 'YouTube',
    type: 'video',
    url: 'https://www.youtube.com/results?search_query=matt+wolfe',
  },
  {
    title: 'Andrej Karpathy — deep dives',
    source: 'YouTube',
    type: 'video',
    url: 'https://www.youtube.com/results?search_query=andrej+karpathy',
  },
  {
    title: 'Two Minute Papers — research, fast',
    source: 'YouTube',
    type: 'video',
    url: 'https://www.youtube.com/results?search_query=two+minute+papers',
  },
  {
    title: 'AI Explained — frontier models',
    source: 'YouTube',
    type: 'video',
    url: 'https://www.youtube.com/results?search_query=ai+explained',
  },
  {
    title: 'Lex Fridman — long-form interviews',
    source: 'YouTube',
    type: 'video',
    url: 'https://www.youtube.com/results?search_query=lex+fridman+ai',
  },
  // --- Articles / Newsletters ---
  {
    title: "Lenny's Newsletter — product & AI",
    source: 'Newsletter',
    type: 'article',
    url: 'https://www.lennysnewsletter.com/',
  },
  {
    title: 'One Useful Thing — Ethan Mollick',
    source: 'Substack',
    type: 'article',
    url: 'https://www.oneusefulthing.org/',
  },
  {
    title: 'Import AI — Jack Clark',
    source: 'Substack',
    type: 'article',
    url: 'https://importai.substack.com/',
  },
  {
    title: 'The Batch — DeepLearning.AI',
    source: 'Newsletter',
    type: 'article',
    url: 'https://www.deeplearning.ai/the-batch/',
  },
  {
    title: 'Simon Willison — LLMs in practice',
    source: 'Blog',
    type: 'article',
    url: 'https://simonwillison.net/',
  },
  {
    title: 'Ahead of AI — Sebastian Raschka',
    source: 'Substack',
    type: 'article',
    url: 'https://magazine.sebastianraschka.com/',
  },
  {
    title: 'Ruben — Substack',
    source: 'Substack',
    type: 'article',
    url: 'https://substack.com/@ruben',
  },
];
