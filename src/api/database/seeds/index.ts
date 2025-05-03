import { DataSource } from 'typeorm';
import { statesSeed } from './state.seed';
import { categoryServiceSeed } from './category-service.seed';
import { tagsSeed } from './tags.seed';
export const runSeeds = async (dataSource: DataSource): Promise<void> => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    try {
        console.log('Seeding States...');
        await statesSeed(dataSource);

        console.log('Seeding Category Service...');
        await categoryServiceSeed(dataSource);

        console.log('Seeding Tags...');
        await tagsSeed(dataSource);
    } catch (error) {
        throw error;
    }
};
