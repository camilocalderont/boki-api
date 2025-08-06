import { FlowConfigInterface, LLMConfigInterface, FlowStepDto, FlowConditionDto, FlowToolDto } from './flowComponents.dto';

// DTO PARA ACTUALIZACIÓN DE FLUJO
export class UpdateFlowDto {
  vc_flow_name?: string;
  vc_display_name?: string;
  vc_description?: string;
  tx_system_prompt?: string;
  tx_user_prompt_template?: string;
  json_flow_config?: FlowConfigInterface;
  json_llm_config?: LLMConfigInterface;
  b_is_active?: boolean;

  // Componentes del flujo (opcional, reemplaza completamente si se envía)
  steps?: FlowStepDto[];
  conditions?: FlowConditionDto[];
  tools?: FlowToolDto[];
}


// DTO PARA ACTUALIZACIÓN DE COMPONENTES INDIVIDUALES
export class UpdateStepDto {
  vc_step_key?: string;
  vc_step_name?: string;
  i_step_order?: number;
  tx_execution_condition?: string;
  tx_step_output?: string;
  json_expected_data?: any;
  json_step_config?: any;
  b_is_active?: boolean;
}

export class UpdateConditionDto {
  vc_condition_key?: string;
  vc_condition_name?: string;
  tx_condition_expression?: string;
  vc_condition_type?: string;
  b_is_active?: boolean;
}

export class UpdateToolDto {
  vc_tool_type?: string;
  vc_tool_name?: string;
  json_tool_config?: any;
  tx_usage_condition?: string;
  b_is_active?: boolean;
}