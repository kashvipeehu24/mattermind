"""Prompt runner utilities for the MatterMind AI package.

This module loads prompt templates, renders them with context, and executes
LLM completions or chat flows through an LLM client.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Iterable, Optional, Union

from ai.config import PromptKey, get_prompt_path
from ai.llm.client import LLMClient


class PromptRunner:
    """Load prompt templates and execute them through an LLM client."""

    def __init__(
        self,
        client: LLMClient,
        prompt_directory: Optional[Path] = None,
    ) -> None:
        self.client = client
        self.prompt_directory = prompt_directory

    def load_prompt(self, prompt_key: Union[PromptKey, str]) -> str:
        """Load a prompt template by key from the prompts directory."""
        path = self._resolve_prompt_path(prompt_key)
        with path.open("r", encoding="utf-8") as handle:
            return handle.read()

    def render_prompt(self, prompt_template: str, variables: Dict[str, Any]) -> str:
        """Render a prompt template using Python format placeholders."""
        try:
            return prompt_template.format(**variables)
        except KeyError as exc:
            missing_key = exc.args[0]
            raise ValueError(
                f"Missing prompt variable: {missing_key}"
            ) from exc

    def run(
        self,
        prompt_key: Union[PromptKey, str],
        variables: Optional[Dict[str, Any]] = None,
        max_tokens: int = 512,
        temperature: float = 0.0,
        stop: Optional[Iterable[str]] = None,
        **kwargs: Any,
    ) -> str:
        """Execute a completion prompt and return the resulting text."""
        variables = variables or {}
        template = self.load_prompt(prompt_key)
        prompt = self.render_prompt(template, variables)
        return self.client.complete(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            stop=stop,
            **kwargs,
        )

    def run_chat(
        self,
        prompt_key: Union[PromptKey, str],
        variables: Optional[Dict[str, Any]] = None,
        system_message: str = "You are an AI assistant.",
        temperature: float = 0.0,
        max_tokens: int = 512,
        **kwargs: Any,
    ) -> str:
        """Execute a chat-style prompt using a system and user message."""
        variables = variables or {}
        template = self.load_prompt(prompt_key)
        user_prompt = self.render_prompt(template, variables)
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt},
        ]
        return self.client.chat(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs,
        )

    def _resolve_prompt_path(self, prompt_key: Union[PromptKey, str]) -> Path:
        key_value = prompt_key.value if isinstance(prompt_key, PromptKey) else prompt_key
        if self.prompt_directory is not None:
            return self.prompt_directory / f"{key_value}.txt"
        return get_prompt_path(PromptKey(key_value))
