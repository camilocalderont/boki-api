import { DataSource } from 'typeorm';

import { userSeed } from './users.seed';
import { companySeed } from './company.seed';
import { categoryServiceSeed } from './category-service.seed';
import { faqsSeed } from './faqs.seed';

export const runSeeds = async (dataSource: DataSource): Promise<void> => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    // eslint-disable-next-line no-useless-catch
    try {
        await userSeed(dataSource);
        await companySeed(dataSource);
        await categoryServiceSeed(dataSource);
        await faqsSeed(dataSource);
    } catch (error) {
        throw error;
    }
};
