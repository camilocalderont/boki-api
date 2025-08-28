import { DataSource } from 'typeorm';
import { CompanyBlockedTimeEntity } from '../../../modules/company/entities/companyBlockedTime.entity';

export const companyBlockedTimeSeed = async (dataSource: DataSource): Promise<void> => {
    const companyBlockedTimeRepository = dataSource.getRepository(CompanyBlockedTimeEntity);

    const existingBlockedTimes = await companyBlockedTimeRepository.find();
    if (existingBlockedTimes.length > 0) {
        return;
    }

    const blockedTimes = [
        {
            CompanyId: 1,
            DtInitDate: "2025-05-01T08:00:00.000Z",
            DtEndDate: "2025-05-01T18:00:00.000Z",
            VcMessage: "Horario bloqueado por mantenimiento"
        }
    ];
    await companyBlockedTimeRepository.insert(blockedTimes);
};