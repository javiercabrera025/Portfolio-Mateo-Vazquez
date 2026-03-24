import {defineField, defineType} from 'sanity'

export const tagType = defineType({
  name: 'tag',
  title: 'Categorías',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label'},
  },
})
