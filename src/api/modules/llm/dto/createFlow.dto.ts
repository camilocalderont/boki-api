import { FlowConfigInterface, LLMConfigInterface, FlowStepDto, FlowConditionDto, FlowToolDto } from './flowComponents.dto';

export class CreateFlowDto {
  vc_flow_name: string;
  vc_display_name: string;
  vc_description?: string;
  tx_system_prompt: string;
  tx_user_prompt_template: string;
  json_flow_config: FlowConfigInterface;
  json_llm_config: LLMConfigInterface;
  b_is_active?: boolean;

  // Componentes del flujo (opcional)
  steps?: FlowStepDto[];
  conditions?: FlowConditionDto[];
  tools?: FlowToolDto[];
}