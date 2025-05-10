import { DataSource } from 'typeorm';
import { statesSeed } from './state.seed';
import { categoryServiceSeed } from './category-service.seed';
import { tagsSeed } from './tags.seed';
import { serviceSeed } from './service.seed';
import { companyBranchRoomSeed } from './companyBranchRoom.seed';
import { professionalSeed } from './professional.seed';
import { companyBlockedTimeSeed } from './companyBlockedTime.seed';
import { companySeed } from './company.seed';
import { appointmentSeed } from './appointment.seed';
import { clientSeed } from './client.seed';
import { faqsTagsSeed } from './faqstags.seed';
import { faqsSeed } from './faqs.seed';

export const runSeeds = async (dataSource: DataSource): Promise<void> => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    // eslint-disable-next-line no-useless-catch
    try {
        await statesSeed(dataSource);
        await categoryServiceSeed(dataSource);
        await tagsSeed(dataSource);
        await clientSeed(dataSource);
        await companySeed(dataSource);
        await serviceSeed(dataSource);
        await companyBranchRoomSeed(dataSource);
        await companyBlockedTimeSeed(dataSource);
        await professionalSeed(dataSource);
        await faqsSeed(dataSource);
        await faqsTagsSeed(dataSource);
        await appointmentSeed(dataSource);
    } catch (error) {
        throw error;
    }
};
