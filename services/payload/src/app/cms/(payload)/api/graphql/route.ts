// Route GraphQL Payload (POST + GET pour playground en dev).
import config from '@payload-config';
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes';

export const POST = GRAPHQL_POST(config);
export const OPTIONS = REST_OPTIONS(config);
