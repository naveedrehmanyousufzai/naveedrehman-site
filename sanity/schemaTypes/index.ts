export const tournament = {
  name: 'tournament',
  title: 'Career Tournaments',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tournament Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    },
    {
      name: 'finalResult',
      title: 'Final Result',
      type: 'string',
      description: 'e.g., Winner, Runner-Up, Semi-Finalist, Round of 16',
    },
    {
      name: 'lastOpponent',
      title: 'Last Opponent',
      type: 'string',
      description: 'Who did you play your final match against?',
    },
    {
      name: 'entryListFile',
      title: 'Entry List (File or Image)',
      type: 'file',
      description: 'Upload PDF, Excel, Word, or Image of the entry list.',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,image/*',
      },
    },
    {
      name: 'drawFile',
      title: 'Official Draw (File or Image)',
      type: 'file',
      description: 'Upload PDF, Excel, Word, or Image of the official draw.',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,image/*',
      },
    },
    {
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Upload photos from the tournament here.',
    },
  ],
};// Triggering Vercel build update