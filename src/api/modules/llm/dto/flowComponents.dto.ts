export interface FlowConfigInterface {
  max_steps?: number;
  timeout_minutes?: number;
  fallback_enabled?: boolean;
  auto_advance?: boolean;
  required_fields?: string[];
}

export interface LLMConfigInterface {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p?: number;
  personality?: string;
  language?: string;
  custom_instructions?: string;
}

// DTOs PARA COMPONENTES
export class FlowStepDto {
  vc_step_key: string;
  vc_step_name: string;
  i_step_order: number;
  tx_execution_condition: string;
  tx_step_output: string;
  json_expected_data?: any;
  json_step_config?: any;
  b_is_active?: boolean;
}

export class FlowConditionDto {
  vc_condition_key: string;
  vc_condition_name: string;
  tx_condition_expression: string;
  vc_condition_type?: string;
  b_is_active?: boolean;
}

export class FlowToolDto {
  vc_tool_type: string;
  vc_tool_name: string;
  json_tool_config: any;
  tx_usage_condition?: string;
  b_is_active?: boolean;
}