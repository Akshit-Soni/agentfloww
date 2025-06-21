import { StartNode } from './StartNode'
import { LLMNode } from './LLMNode'
import { RuleNode } from './RuleNode'
import { ConnectorNode } from './ConnectorNode'
import { EndNode } from './EndNode'
import { ToolNode } from './ToolNode'

export const CustomNodes = {
  start: StartNode,
  llm: LLMNode,
  rule: RuleNode,
  connector: ConnectorNode,
  tool: ToolNode,
  end: EndNode,
  // Add more node types as needed
  rag: LLMNode, // Reuse LLM node for now
  intent: LLMNode, // Reuse LLM node for now
  webhook: ConnectorNode, // Reuse connector node for now
  condition: RuleNode, // Reuse rule node for now
}