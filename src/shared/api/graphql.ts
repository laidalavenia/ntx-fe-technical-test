import { GraphQLClient } from 'graphql-request'
import { ENV } from '@/shared/config/env'

// Single shared client instance for all GraphQL calls.
export const gqlClient = new GraphQLClient(ENV.anilistEndpoint)