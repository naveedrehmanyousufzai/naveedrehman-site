import { type SchemaTypeDefinition } from 'sanity'
import { tournamentType } from './tournament'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [tournamentType],
}