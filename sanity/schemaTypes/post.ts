import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'News & Media Publisher',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postType',
      title: 'Content Format',
      type: 'string',
      options: {
        list: [
          { title: '📰 News Article / Press Release', value: 'article' },
          { title: '📷 Photo Feature', value: 'photo' },
          { title: '▶️ YouTube Video', value: 'video' }
        ],
        layout: 'radio'
      },
      initialValue: 'article',
      validation: (Rule) => Rule.required(),
    }),
    
    /* --- SMART FIELDS START HERE --- */
    
    // 1. Only shows if "News Article" is selected
    defineField({
      name: 'externalLink',
      title: 'External Article Link (Optional)',
      type: 'url',
      description: 'If this news links to an outside website (like the PSA Tour or Geo News), paste it here.',
      hidden: ({ document }) => document?.postType !== 'article'
    }),

    // 2. Only shows if "YouTube Video" is selected
    defineField({
      name: 'youtubeLink',
      title: 'YouTube Video Link',
      type: 'url',
      description: 'Paste your YouTube link here.',
      hidden: ({ document }) => document?.postType !== 'video'
    }),

    // 3. Hides if "YouTube Video" is selected (Because videos use YouTube thumbnails)
    defineField({
      name: 'mainImage',
      title: 'Cover Photo',
      type: 'image',
      description: 'Upload your photo here.',
      options: { hotspot: true },
      hidden: ({ document }) => document?.postType === 'video'
    }),

    /* --- END SMART FIELDS --- */

    defineField({
      name: 'content',
      title: 'Written Content',
      type: 'text',
      description: 'Write your actual press release, event recap, or photo description directly here.'
    }),
    defineField({
      name: 'isUrgent',
      title: 'Set as Urgent Sticky Banner?',
      type: 'boolean',
      initialValue: false
    })
  ]
})