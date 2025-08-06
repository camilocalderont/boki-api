import { DataSource } from 'typeorm';
import { CompanyFlowDefinitionEntity } from '../../modules/llm/entities/companyFlowDefinition.entity';
import { CompanyFlowStepEntity } from '../../modules/llm/entities/companyFlowStep.entity';
import { CompanyFlowConditionEntity } from '../../modules/llm/entities/companyFlowCondition.entity';
import { CompanyFlowToolEntity } from '../../modules/llm/entities/companyFlowTool.entity';

export const companyFlowSeed = async (dataSource: DataSource): Promise<void> => {
    const flowDefinitionRepository = dataSource.getRepository(CompanyFlowDefinitionEntity);
    const flowStepRepository = dataSource.getRepository(CompanyFlowStepEntity);
    const flowConditionRepository = dataSource.getRepository(CompanyFlowConditionEntity);
    const flowToolRepository = dataSource.getRepository(CompanyFlowToolEntity);
    
    // Verificar si ya existen datos
    const existingFlowDefinitions = await flowDefinitionRepository.find();
    if (existingFlowDefinitions.length > 0) {
        return;
    }

    // ====================================
    // 1. SEED COMPANY FLOW DEFINITIONS
    // ====================================
    
    const flowDefinitions = [
        {
            CompanyId: 1,
            VcFlowName: 'ai_appointment',
            VcDisplayName: 'Agendamiento con IA',
            VcDescription: 'Flujo inteligente de agendamiento usando LLM para guiar la conversación de forma natural',
            TxSystemPrompt: 'Eres un asistente virtual especializado en el agendamiento de citas para una clínica de belleza. Tu objetivo es recopilar de forma natural y amigable: 1) Servicio deseado, 2) Profesional (opcional), 3) Fecha preferida, 4) Hora disponible. Usa un tono profesional pero cálido, haz preguntas de seguimiento inteligentes y ofrece alternativas cuando sea necesario.',
            TxUserPromptTemplate: 'Paso {{current_step}}: {{#if (eq current_step "initial")}}¡Hola! 😊 Soy tu asistente virtual. Te ayudo a agendar tu cita de belleza. ¿Qué servicio te gustaría reservar?{{else if (eq current_step "waiting_service")}}Perfecto, necesito saber qué servicio específico necesitas. Ofrecemos: {{available_services}}{{else if (eq current_step "waiting_professional")}}¡Excelente elección! ¿Tienes preferencia por algún profesional específico? Nuestros especialistas disponibles son: {{available_professionals}}{{else if (eq current_step "waiting_date")}}Perfecto. ¿Qué fecha te viene mejor? Puedo mostrarte disponibilidad para los próximos días.{{else if (eq current_step "waiting_time")}}Genial. Para {{selected_date}} con {{selected_professional}}, tengo estos horarios disponibles: {{available_slots}}{{else}}Te confirmo tu cita: {{confirmation_summary}}. ¿Está todo correcto?{{/if}}',
            JsonFlowConfig: JSON.stringify({
                max_steps: 6,
                timeout_minutes: 30,
                fallback_enabled: true,
                auto_advance: true,
                required_fields: ["ServiceId", "ProfessionalId", "DtDate", "TStartTime"]
            }),
            JsonLLMConfig: JSON.stringify({
                model: "gpt-4-turbo",
                temperature: 0.4,
                max_tokens: 400,
                top_p: 0.9,
                personality: "professional_friendly",
                language: "es-CO",
                custom_instructions: "Usar muletillas colombianas ocasionales como pues, entonces. Ser cálido pero profesional."
            }),
            BIsActive: true
        },
        {
            CompanyId: 1,
            VcFlowName: 'manual_appointment',
            VcDisplayName: 'Agendamiento Manual',
            VcDescription: 'Flujo tradicional paso a paso para agendamiento sin IA',
            TxSystemPrompt: 'Flujo manual para recopilar datos de agendamiento paso a paso.',
            TxUserPromptTemplate: 'Bienvenido al sistema de agendamiento. {{current_step_message}}',
            JsonFlowConfig: {
                max_steps: 8,
                timeout_minutes: 45,
                fallback_enabled: false,
                auto_advance: false,
                required_fields: ["ServiceId", "ProfessionalId", "DtDate", "TStartTime"]
            },
            JsonLLMConfig: {
                model: "none",
                temperature: 0,
                max_tokens: 0,
                personality: "neutral",
                language: "es"
            },
            BIsActive: true
        }
    ];

    const savedFlowDefinitions = await flowDefinitionRepository.insert(flowDefinitions as any);

    // ====================================
    // 2. SEED COMPANY FLOW STEPS
    // ====================================
    
    const flowSteps = [
        {
            FlowDefinitionId: 1,
            VcStepKey: 'initial',
            VcStepName: 'Inicialización del Flujo',
            IStepOrder: 1,
            TxExecutionCondition: '$flowInfo.currentStep === "initial" || $flowInfo.currentStep === ""',
            TxStepOutput: '🤖 ¡Hola! Soy tu asistente virtual para agendar citas. ✨ Ofrecemos servicios como: {{services_text}} y más. 💬 ¿Qué servicio te gustaría agendar? 😊',
            JsonExpectedData: JSON.stringify({
                extract_fields: ["client_name", "intent"],
                required_fields: [],
                validation_rules: {}
            }),
            JsonStepConfig: JSON.stringify({
                use_ai_generation: true,
                show_service_suggestions: true,
                next_step_on_success: "waiting_service",
                fallback_message: "¡Hola! ¿En qué puedo ayudarte con tu cita?"
            }),
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcStepKey: 'waiting_service',
            VcStepName: 'Selección de Servicio',
            IStepOrder: 2,
            TxExecutionCondition: '$flowInfo.currentData.ServiceId == null',
            TxStepOutput: 'Perfecto, ¿qué servicio específico necesitas? 💅 Tenemos disponibles: {{#each available_services}}• {{this.name}} - ${{this.price}}{{/each}} ¿Cuál te interesa?',
            JsonExpectedData: JSON.stringify({
                extract_fields: ["ServiceId", "service_name", "service_category"],
                required_fields: ["ServiceId"],
                validation_rules: {
                    ServiceId: "required|integer|exists:services",
                    service_name: "string|max:100"
                }
            }),
            JsonStepConfig: JSON.stringify({
                use_ai_generation: true,
                show_service_list: true,
                auto_advance_when_complete: true,
                next_step_on_success: "waiting_professional",
                max_suggestions: 6
            }),
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcStepKey: 'waiting_professional',
            VcStepName: 'Selección de Profesional',
            IStepOrder: 3,
            TxExecutionCondition: '$flowInfo.currentData.ServiceId != null && $flowInfo.currentData.ProfessionalId == null',
            TxStepOutput: '¡Excelente elección! 👩‍💼 ¿Tienes preferencia por algún profesional específico? Nuestros especialistas en {{selected_service}} son: {{#each available_professionals}}• {{this.name}} - {{this.experience}}{{/each}} ¿Cuál prefieres o te da igual?',
            JsonExpectedData: {
                extract_fields: ["ProfessionalId", "professional_name", "professional_preference"],
                required_fields: ["ProfessionalId"],
                validation_rules: {
                    ProfessionalId: "required|integer|exists:professionals",
                    professional_preference: "string|in:any,specific"
                }
            },
            JsonStepConfig: {
                use_ai_generation: true,
                show_professional_list: true,
                allow_any_professional: true,
                auto_advance_when_complete: true,
                next_step_on_success: "waiting_date"
            },
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcStepKey: 'waiting_date',
            VcStepName: 'Selección de Fecha',
            IStepOrder: 4,
            TxExecutionCondition: '$flowInfo.currentData.ServiceId != null && $flowInfo.currentData.ProfessionalId != null && $flowInfo.currentData.DtDate == null',
            TxStepOutput: 'Perfecto. 📅 ¿Qué fecha te viene mejor? Tengo disponibilidad para los próximos días: {{#each available_dates}}• {{this.date}} - {{this.slots_available}} horarios disponibles{{/each}} ¿Cuál fecha prefieres?',
            JsonExpectedData: {
                extract_fields: ["DtDate", "date_preference", "date_flexibility"],
                required_fields: ["DtDate"],
                validation_rules: {
                    DtDate: "required|date|after:today|before:+30days",
                    date_preference: "string|in:morning,afternoon,evening,flexible"
                }
            },
            JsonStepConfig: {
                use_ai_generation: true,
                show_calendar: true,
                max_days_ahead: 30,
                exclude_weekends: false,
                auto_advance_when_complete: true,
                next_step_on_success: "waiting_time"
            },
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcStepKey: 'waiting_time',
            VcStepName: 'Selección de Hora',
            IStepOrder: 5,
            TxExecutionCondition: '$flowInfo.currentData.ServiceId != null && $flowInfo.currentData.ProfessionalId != null && $flowInfo.currentData.DtDate != null && $flowInfo.currentData.TStartTime == null',
            TxStepOutput: '¡Genial! 🕐 Para el {{selected_date}} con {{selected_professional}}, Tengo estos horarios disponibles: {{#each available_slots}}• {{this.time}} - {{this.duration}} min{{/each}} ¿Cuál hora te conviene más?',
            JsonExpectedData: {
                extract_fields: ["TStartTime", "time_preference", "duration_minutes"],
                required_fields: ["TStartTime"],
                validation_rules: {
                    TStartTime: "required|time|available_slot",
                    duration_minutes: "integer|min:30|max:240"
                }
            },
            JsonStepConfig: {
                use_ai_generation: true,
                show_available_slots: true,
                slots_per_day: 8,
                format_time_12h: true,
                auto_advance_when_complete: true,
                next_step_on_success: "waiting_confirmation"
            },
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcStepKey: 'waiting_confirmation',
            VcStepName: 'Confirmación Final',
            IStepOrder: 6,
            TxExecutionCondition: '$flowInfo.allDataComplete && $flowInfo.currentStep !== "completed"',
            TxStepOutput: '✅ ¡Perfecto! Te confirmo tu cita: 🗓️ Fecha: {{selected_date}} ⏰ Hora: {{selected_time}} 💅 Servicio: {{selected_service}} 👩‍💼 Profesional: {{selected_professional}} 💰 Precio: ${{service_price}} ¿Confirmas tu cita?',
            JsonExpectedData: {
                extract_fields: ["confirmation", "additional_notes", "contact_preference"],
                required_fields: ["confirmation"],
                validation_rules: {
                    confirmation: "required|boolean",
                    additional_notes: "string|max:200",
                    contact_preference: "string|in:whatsapp,call,email"
                }
            },
            JsonStepConfig: {
                use_ai_generation: true,
                show_whatsapp_buttons: true,
                buttons: [
                    { id: "confirm_yes", title: "✅ Sí, confirmar" },
                    { id: "confirm_no", title: "❌ Modificar" }
                ],
                create_appointment_on_confirm: true,
                send_confirmation_message: true
            },
            BIsActive: true
        }
    ];

    await flowStepRepository.insert(flowSteps as any);

    // ====================================
    // 3. SEED COMPANY FLOW CONDITIONS
    // ====================================
    
    const flowConditions = [
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'hasServiceId',
            VcConditionName: 'Servicio Seleccionado',
            TxConditionExpression: '$flowInfo.currentData.ServiceId != null && $flowInfo.currentData.ServiceId > 0',
            VcConditionType: 'data_validation',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'hasProfessionalId',
            VcConditionName: 'Profesional Seleccionado',
            TxConditionExpression: '$flowInfo.currentData.ProfessionalId != null && $flowInfo.currentData.ProfessionalId > 0',
            VcConditionType: 'data_validation',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'hasValidDate',
            VcConditionName: 'Fecha Válida',
            TxConditionExpression: '$flowInfo.currentData.DtDate != null && $flowInfo.currentData.DtDate > $today',
            VcConditionType: 'data_validation',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'hasValidTime',
            VcConditionName: 'Hora Válida',
            TxConditionExpression: '$flowInfo.currentData.TStartTime != null && $flowInfo.isValidTimeSlot',
            VcConditionType: 'data_validation',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'allDataComplete',
            VcConditionName: 'Todos los Datos Completos',
            TxConditionExpression: '$conditions.hasServiceId && $conditions.hasProfessionalId && $conditions.hasValidDate && $conditions.hasValidTime',
            VcConditionType: 'completion_check',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'canAdvanceToNext',
            VcConditionName: 'Puede Avanzar al Siguiente Paso',
            TxConditionExpression: '$flowInfo.currentStepComplete && !$flowInfo.isBlocked && $flowInfo.retryCount < 3',
            VcConditionType: 'flow_control',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcConditionKey: 'needsFallback',
            VcConditionName: 'Necesita Fallback Manual',
            TxConditionExpression: '$flowInfo.retryCount >= 3 || $flowInfo.llmError || $flowInfo.timeout',
            VcConditionType: 'error_handling',
            BIsActive: true
        }
    ];

    await flowConditionRepository.insert(flowConditions as any);

    // ====================================
    // 4. SEED COMPANY FLOW TOOLS
    // ====================================
    
    const flowTools = [
        {
            FlowDefinitionId: 1,
            VcToolType: 'llm_generation',
            VcToolName: 'Generate Initial Message',
            JsonToolConfig: JSON.stringify({
                method: "generate_response",
                prompt_template: "Crea un saludo inicial amigable para agendamiento de citas en una clínica de belleza. Incluye: servicios disponibles {{services_list}}, horarios {{business_hours}}, tono profesional pero cálido.",
                max_tokens: 200,
                temperature: 0.7,
                include_context: ["services_list", "business_hours", "company_name"]
            }),
            TxUsageCondition: '$flowInfo.currentStep === "initial"',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcToolType: 'llm_generation',
            VcToolName: 'Generate Service Selection',
            JsonToolConfig: JSON.stringify({
                method: "generate_response",
                prompt_template: "El usuario dijo: {{user_input}}. Ayúdale a seleccionar un servicio de esta lista: {{available_services}}. Si no es claro, haz preguntas de aclaración amigables.",
                max_tokens: 250,
                temperature: 0.5,
                include_context: ["available_services", "user_input", "previous_messages"],
                extraction_rules: {
                    service_id: "integer",
                    service_name: "string",
                    confidence_level: "float"
                }
            }),
            TxUsageCondition: '$flowInfo.currentStep === "waiting_service"',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcToolType: 'api_call',
            VcToolName: 'Get Available Services',
            JsonToolConfig: JSON.stringify({
                method: "GET",
                endpoint: "/api/services",
                params: {
                    company_id: "{{company_id}}",
                    active_only: true,
                    include_pricing: false
                },
                cache_duration: 300,
                response_mapping: {
                    services: "data.services",
                    services_text: "data.services[].name.join(\", \")"
                }
            }),
            TxUsageCondition: '$flowInfo.currentStep === "initial" || $flowInfo.currentStep === "waiting_service"',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcToolType: 'api_call',
            VcToolName: 'Get Available Professionals',
            JsonToolConfig: JSON.stringify({
                method: "GET",
                endpoint: "/api/professionals",
                params: {
                    company_id: "{{company_id}}",
                    service_id: "{{collected_data.ServiceId}}",
                    active_only: true
                },
                cache_duration: 300,
                response_mapping: {
                    professionals: "data.professionals",
                    professional_names: "data.professionals[].name"
                }
            }),
            TxUsageCondition: '$flowInfo.currentStep === "waiting_professional" && $flowInfo.currentData.ServiceId != null',
            BIsActive: true
        },
        {
            FlowDefinitionId: 1,
            VcToolType: 'api_call',
            VcToolName: 'Create Appointment',
            JsonToolConfig: JSON.stringify({
                method: "POST",
                endpoint: "/api/appointments",
                payload: {
                    company_id: "{{company_id}}",
                    service_id: "{{collected_data.ServiceId}}",
                    professional_id: "{{collected_data.ProfessionalId}}",
                    client_id: "{{collected_data.ClientId}}",
                    appointment_date: "{{collected_data.DtDate}}",
                    start_time: "{{collected_data.TStartTime}}",
                    notes: "{{collected_data.additional_notes}}",
                    contact_method: "whatsapp",
                    flow_execution_id: "{{flow_execution_id}}"
                },
                success_message: "¡Cita creada exitosamente! Te hemos enviado la confirmación.",
                error_fallback: "Hubo un problema creando la cita. Un agente te contactará pronto."
            }),
            TxUsageCondition: '$flowInfo.currentStep === "waiting_confirmation" && $flowInfo.currentData.confirmation === true',
            BIsActive: true
        }
    ];

    await flowToolRepository.insert(flowTools as any);
};