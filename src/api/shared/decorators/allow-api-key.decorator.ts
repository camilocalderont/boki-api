import { SetMetadata } from '@nestjs/common';

export const API_KEY_ENDPOINTS = 'apiKeyEndpoints';

export const AllowApiKey = () => SetMetadata(API_KEY_ENDPOINTS, true);