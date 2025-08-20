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
import { companyFlowSeed } from './companyFlow.seed';
import { userSeed } from './users.seed';

export const runSeeds = async (dataSource: DataSource): Promise<void> => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    // eslint-disable-next-line no-useless-catch
    try {
        await userSeed(dataSource); 
        await statesSeed(dataSource);
        await tagsSeed(dataSource);
        await companySeed(dataSource);
        await categoryServiceSeed(dataSource);
        await clientSeed(dataSource);
        await serviceSeed(dataSource);
        await companyBranchRoomSeed(dataSource);
        await companyBlockedTimeSeed(dataSource);
        await professionalSeed(dataSource);
        await faqsSeed(dataSource);
        await faqsTagsSeed(dataSource);
        await appointmentSeed(dataSource);
        await companyFlowSeed(dataSource);
    } catch (error) {
        throw error;
    }
};
