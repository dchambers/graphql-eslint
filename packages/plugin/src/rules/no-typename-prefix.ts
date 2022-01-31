import {
  InterfaceTypeDefinitionNode,
  InterfaceTypeExtensionNode,
  NameNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql';
import { GraphQLESTreeNode } from '../estree-parser';
import { GraphQLESLintRule } from '../types';
import { getLocation } from '../utils';

const NO_TYPENAME_PREFIX = 'NO_TYPENAME_PREFIX';

const rule: GraphQLESLintRule = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Schema',
      description: 'Enforces users to avoid using the type name in a field name while defining your schema.',
      recommended: true,
      url: 'https://github.com/dotansimha/graphql-eslint/blob/master/docs/rules/no-typename-prefix.md',
      examples: [
        {
          title: 'Incorrect',
          code: /* GraphQL */ `
            type User {
              userId: ID!
            }
          `,
        },
        {
          title: 'Correct',
          code: /* GraphQL */ `
            type User {
              id: ID!
            }
          `,
        },
      ],
    },
    messages: {
      [NO_TYPENAME_PREFIX]: `Field "{{ fieldName }}" starts with the name of the parent type "{{ typeName }}"`,
    },
    schema: [],
  },
  create(context) {
    return {
      'ObjectTypeDefinition, ObjectTypeExtension, InterfaceTypeDefinition, InterfaceTypeExtension'(
        node: GraphQLESTreeNode<
          ObjectTypeDefinitionNode | ObjectTypeExtensionNode | InterfaceTypeDefinitionNode | InterfaceTypeExtensionNode
        >
      ) {
        const typeName = node.name.value;
        const lowerTypeName = typeName.toLowerCase();

        for (const field of node.fields) {
          const xxx: GraphQLESTreeNode<NameNode> = field.name;
          const fieldName = field.name.value;

          if (fieldName.toLowerCase().startsWith(lowerTypeName)) {
            context.report({
              data: {
                fieldName,
                typeName,
              },
              messageId: NO_TYPENAME_PREFIX,
              loc: getLocation(field.name, lowerTypeName),
            });
          }
        }
      },
    };
  },
};

export default rule;
