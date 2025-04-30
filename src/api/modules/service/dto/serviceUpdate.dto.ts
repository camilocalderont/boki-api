import { UpdateServiceStageDto } from "./serviceStageUpdate.dto";

export class UpdateServiceDto {
    VcName?: string;
    VcDescription?: string;
    IMinimalPrice?: number;
    IMaximalPrice?: number;
    IRegularPrice?: number;
    DTaxes?: number;
    VcTime?: string;
    CompanyId?: number;
    CategoryId?: number;
    TxPicture?: string;
    ServiceStages?: UpdateServiceStageDto[];
}
