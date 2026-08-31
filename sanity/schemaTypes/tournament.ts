import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tournament',
  title: 'Career Tournaments',
  type: 'document',
  fields: [
    defineField({
      name: 'tournament',
      title: 'Tournament',
      type: 'string',
      description: 'Official event name, e.g. "PSA World Championships" or "Sindh Open".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      description: 'Start date of the tournament (used for ordering).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      description: 'Host city, optionally with country, e.g. "Karachi, Pakistan".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          { title: 'PSA World Championship', value: 'PSA World Championship' },
          { title: 'PSA World Tour Platinum', value: 'PSA World Tour Platinum' },
          { title: 'PSA World Tour Gold', value: 'PSA World Tour Gold' },
          { title: 'PSA World Tour Silver', value: 'PSA World Tour Silver' },
          { title: 'PSA World Tour Bronze', value: 'PSA World Tour Bronze' },
          { title: 'PSA Challenger', value: 'PSA Challenger' },
          { title: 'National / Sindh Squash Association', value: 'National / Sindh Squash Association' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'string',
      options: {
        list: [
          { title: 'Champion', value: 'Champion' },
          { title: 'Runner-up', value: 'Runner-up' },
          { title: 'Semi-finalist', value: 'Semi-finalist' },
          { title: 'Quarter-finalist', value: 'Quarter-finalist' },
          { title: 'Round of 16', value: 'Round of 16' },
          { title: 'Round of 32', value: 'Round of 32' },
          { title: 'Round of 64', value: 'Round of 64' },
          { title: 'Qualifying', value: 'Qualifying' },
          { title: 'Group stage', value: 'Group stage' },
          { title: 'Withdrew', value: 'Withdrew' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'opponent',
      title: 'Opponent',
      type: 'string',
      description: 'Opponent in the final / decisive match, if applicable.',
    }),
    defineField({
      name: 'score',
      title: 'Score',
      type: 'string',
      description: 'Score line of the final / decisive match, e.g. "11-9, 8-11, 11-7, 11-6".',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Link to the official draw, report, or PSA results page.',
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'tournament',
      result: 'result',
      date: 'date',
      city: 'city',
      media: 'image',
    },
    prepare({ title, result, date, city, media }) {
      return {
        title,
        subtitle: [date, city, result].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
