import { SchemaTypeDefinition } from 'sanity'
import { siteSettings } from './siteSettings'
import { post } from './post'
import tournament from './tournament'
import { aboutProfile } from './aboutProfile'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, post, tournament, aboutProfile],
}