import { DataSource } from 'typeorm';
import { statesSeed } from './state.seed';

export const runSeeds = async (dataSource: DataSource): Promise<void> => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    try {
        await statesSeed(dataSource);
    } catch (error) {
        throw error;
    }
};
