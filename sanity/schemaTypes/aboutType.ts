import {defineType, defineField} from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'Sobre Mi',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})
