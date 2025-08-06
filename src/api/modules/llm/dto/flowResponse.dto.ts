import { FlowConfigInterface, LLMConfigInterface } from './flowComponents.dto';

// DTOs DE RESPUESTA BÁSICOS

/**
 * DTO para respuesta de un flujo completo
 * GET /companies/{id}/flows/{flowId}
 */
export class FlowResponseDto {
  id: number;
  company_id: number;
  vc_flow_name: string;
  vc_display_name: string;
  vc_description?: string;
  tx_system_prompt: string;
  tx_user_prompt_template: string;
  json_flow_config: FlowConfigInterface;
  json_llm_config: LLMConfigInterface;
  b_is_active: boolean;
  created_at: string;
  updated_at: string;

  // Componentes del flujo
  steps?: FlowStepResponseDto[];
  conditions?: FlowConditionResponseDto[];
  tools?: FlowToolResponseDto[];
}

/**
 * DTO para lista de flujos (sin componentes)
 * GET /companies/{id}/flows
 */
export class FlowListItemDto {
  id: number;
  vc_flow_name: string;
  vc_display_name: string;
  vc_description?: string;
  b_is_active: boolean;
  created_at: string;
  steps_count: number;
}

/**
 * DTO para respuesta de lista de flujos
 */
export class FlowListResponseDto {
  flows: FlowListItemDto[];
  total: number;
}

// DTOs DE COMPONENTES EN RESPUESTA
export class FlowStepResponseDto {
  id: number;
  vc_step_key: string;
  vc_step_name: string;
  i_step_order: number;
  tx_execution_condition: string;
  tx_step_output: string;
  json_expected_data?: any;
  json_step_config?: any;
  b_is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class FlowConditionResponseDto {
  id: number;
  vc_condition_key: string;
  vc_condition_name: string;
  tx_condition_expression: string;
  vc_condition_type: string;
  b_is_active: boolean;
  created_at: string;
}

export class FlowToolResponseDto {
  id: number;
  vc_tool_type: string;
  vc_tool_name: string;
  json_tool_config: any;
  tx_usage_condition?: string;
  b_is_active: boolean;
  created_at: string;
}