import { defineField, defineType } from 'sanity'

export const tournamentType = defineType({
  name: 'tournament',
  title: 'Tournament',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tournament Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Your Role',
      type: 'string',
      options: {
        list: ['Player', 'Organizer'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateString',
      title: 'Date (e.g., "June 8–12, 2026")',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category (e.g., "PSA Tour", "National")',
      type: 'string',
    }),
    defineField({
      name: 'resultOrDescription',
      title: 'Result or Description',
      type: 'text',
      description: 'As a player: your placement. As organizer: a brief summary.',
    }),
  ],
})