import { defineField, defineType } from 'sanity'

export const tournament = defineType({
  name: 'tournament',
  title: 'Tournaments',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Tournament Title', type: 'string' }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      options: { source: 'title' },
      description: 'Click Generate to create the web link for this tournament.' 
    }),
    defineField({ name: 'subtitle', title: 'Subtitle / Short Description', type: 'string' }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({ name: 'location', title: 'Location / Venue', type: 'string' }),
    
    // --- PLAYER LIST (ENTRIES) ---
    defineField({
      name: 'playerList',
      title: 'Registered Players (Entries)',
      type: 'array',
      description: 'Add players here. The WSF Generator will use these seeds to build the draw.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', title: 'Category (e.g., PSA Men, U-15)', type: 'string' },
            { name: 'playerName', title: 'Player Name', type: 'string' },
            { name: 'seed', title: 'Seed / Rank', type: 'number', description: 'e.g., 1, 2, 3... Leave blank for unseeded/random draw.' },
            { name: 'region', title: 'Club / Province / Country', type: 'string' }
          ]
        }
      ]
    }),

    // --- THE DRAW (MATCHES) ---
    defineField({
      name: 'draws',
      title: 'Tournament Draws & Matches',
      type: 'array',
      description: 'The bracket matches. (Soon to be automated by the Generator)',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', title: 'Category', type: 'string' },
            { name: 'round', title: 'Round (e.g., Round of 16, Quarter-Final)', type: 'string', options: { list: ['Round of 64', 'Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Final'] } },
            { name: 'matchNumber', title: 'Match Number', type: 'number' },
            { name: 'player1', title: 'Player 1', type: 'string' },
            { name: 'player2', title: 'Player 2', type: 'string' },
            { name: 'score', title: 'Score', type: 'string' },
            { name: 'winner', title: 'Winner', type: 'string' }
          ]
        }
      ]
    }),

    // --- MATCH REPORT & MEDIA ---
    defineField({ name: 'article', title: 'Tournament Report / Press Release', type: 'text' }),
    defineField({
      name: 'winners',
      title: 'Category Winners',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', title: 'Category', type: 'string' },
            { name: 'winner', title: 'Winner Name', type: 'string' },
            { name: 'runnerUp', title: 'Runner Up Name', type: 'string' },
          ]
        }
      ]
    }),
    defineField({
      name: 'finalDayPics',
      title: 'Final Day Pictures',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),

    // --- OFFICIALS ---
    defineField({ name: 'tournamentSecretary', title: 'Tournament Secretary', type: 'string' }),
    defineField({ name: 'tournamentReferee', title: 'Tournament Referee (Main)', type: 'string' }),
    defineField({ name: 'otherReferees', title: 'Other Referees', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'officials',
      title: 'Other Officials (Custom Roles)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', title: 'Role Title', type: 'string' },
            { name: 'name', title: 'Person Name', type: 'string' }
          ]
        }
      ]
    }),
  ],
})