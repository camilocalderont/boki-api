export class CreateCompanyAgentDto {
    CompanyId: number;
    VcAgentName: string;
    TxPromptTemplate: string; 
    BIsActive: boolean;

    // Configuración del modelo
    VcModelName?: string;
    VcRepoId?: string;
    VcFilename?: string;
    VcLocalName?: string;

    // Parámetros del LLM
    DcTemperature?: number;
    IMaxTokens?: number;
    DcTopP?: number;
    ITopK?: number;
    IContextLength?: number;
    TxStopTokens?: string;

    // Hardware
    IMaxMemoryMb?: number;
    INThreads?: number;
    BlsUseGpu?: boolean;
}
