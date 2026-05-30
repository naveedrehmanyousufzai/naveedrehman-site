import { defineField, defineType } from 'sanity'

export const aboutProfile = defineType({
  name: 'aboutProfile',
  title: 'About Page Content',
  type: 'document',
  fields: [
    /* --- HERO SECTION --- */
    defineField({
      name: 'heroTitle',
      title: 'Hero Headline',
      type: 'string',
      initialValue: 'The Drive Behind the Game'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      initialValue: 'Competing at the highest levels of the PSA World Tour while laying the foundation for the next generation of squash champions in Sindh.'
    }),

    /* --- THE ATHLETE --- */
    defineField({
      name: 'athleteBio',
      title: 'Athlete Biography',
      type: 'text',
    }),
    defineField({
      name: 'worldRanking',
      title: 'Career High PSA Rank',
      type: 'string',
      description: 'e.g., 203'
    }),
    defineField({
      name: 'topMedal',
      title: 'Top Achievement',
      type: 'string',
      description: 'e.g., GOLD - 2024 Sindh Games'
    }),

    /* --- THE ADMINISTRATOR --- */
    defineField({
      name: 'adminBio',
      title: 'Administrator Biography',
      type: 'text',
    }),
    defineField({
      name: 'initiatives',
      title: 'Key Initiatives (Bullet Points)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add your current goals and projects for the Association here.'
    })
  ]
})