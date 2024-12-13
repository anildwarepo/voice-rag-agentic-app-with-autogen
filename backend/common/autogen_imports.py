from autogen_core.components.tool_agent import ToolAgent, tool_agent_caller_loop
from autogen_core.components.tools import FunctionTool, Tool, ToolSchema
from dataclasses import dataclass

from typing import List
from pydantic import BaseModel
from autogen_core.components.models import (
    AssistantMessage,
    ChatCompletionClient,
    AzureOpenAIChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
    FunctionExecutionResult
)
from autogen_core.components import RoutedAgent, message_handler
from autogen_core.base import AgentId, MessageContext
from autogen_core.components import (
    DefaultTopicId,
    RoutedAgent,
    default_subscription,
    message_handler,
    type_subscription,
    Image
)
from typing import Optional
from autogen_core.application import SingleThreadedAgentRuntime

import asyncio