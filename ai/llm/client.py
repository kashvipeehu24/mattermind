"""LLM client abstraction for MatterMind.

This module provides a lightweight wrapper around external LLM providers.
The client is responsible for provider selection, default configuration,
and basic prompt/chat completion calls.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, ClassVar, Dict, Iterable, Optional

from ai.config import DEFAULT_LLM_MODEL, DEFAULT_LLM_PROVIDER

try:
    import openai
except ImportError:  # pragma: no cover
    openai = None  # type: ignore[assignment]


class LLMProviderError(RuntimeError):
    """Raised when the configured LLM provider is not available."""


@dataclass(frozen=True)
class LLMClient:
    """Encapsulates LLM provider configuration and request handling."""

    provider: str = DEFAULT_LLM_PROVIDER
    model: str = DEFAULT_LLM_MODEL
    api_key: Optional[str] = None
    timeout: int = 30

    SUPPORTED_PROVIDERS: ClassVar[tuple[str, ...]] = ("openai",)

    @classmethod
    def from_env(cls) -> "LLMClient":
        """Create a client from environment variables."""
        return cls(
            provider=os.getenv("MATTERMIND_AI_LLM_PROVIDER", DEFAULT_LLM_PROVIDER),
            model=os.getenv("MATTERMIND_AI_LLM_MODEL", DEFAULT_LLM_MODEL),
            api_key=os.getenv("MATTERMIND_AI_LLM_API_KEY", None),
            timeout=int(os.getenv("MATTERMIND_AI_LLM_TIMEOUT", "30")),
        )

    def complete(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.0,
        stop: Optional[Iterable[str]] = None,
        **kwargs: Any,
    ) -> str:
        """Generate a text completion for a single prompt."""
        self._ensure_provider_available()

        if self.provider == "openai":
            return self._openai_complete(prompt, max_tokens, temperature, stop, **kwargs)

        raise LLMProviderError(
            f"Unsupported LLM provider: {self.provider}."
            f" Supported providers: {', '.join(self.SUPPORTED_PROVIDERS)}"
        )

    def chat(
        self,
        messages: list[dict[str, str]],
        temperature: float = 0.0,
        max_tokens: int = 512,
        **kwargs: Any,
    ) -> str:
        """Generate a chat-based completion from a list of messages."""
        self._ensure_provider_available()

        if self.provider == "openai":
            return self._openai_chat(messages, temperature, max_tokens, **kwargs)

        raise LLMProviderError(
            f"Unsupported LLM provider: {self.provider}."
            f" Supported providers: {', '.join(self.SUPPORTED_PROVIDERS)}"
        )

    def _ensure_provider_available(self) -> None:
        if self.provider == "openai" and openai is None:
            raise LLMProviderError(
                "OpenAI provider is configured but the openai package is not installed."
            )

        if self.provider not in self.SUPPORTED_PROVIDERS:
            raise LLMProviderError(
                f"LLM provider '{self.provider}' is not supported."
            )

    def _openai_complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        stop: Optional[Iterable[str]],
        **kwargs: Any,
    ) -> str:
        if self.api_key:
            openai.api_key = self.api_key

        response = openai.Completion.create(
            model=self.model,
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            stop=list(stop) if stop else None,
            **kwargs,
        )
        return self._extract_openai_text(response)

    def _openai_chat(
        self,
        messages: list[dict[str, str]],
        temperature: float,
        max_tokens: int,
        **kwargs: Any,
    ) -> str:
        if self.api_key:
            openai.api_key = self.api_key

        response = openai.ChatCompletion.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs,
        )
        return self._extract_openai_chat_text(response)

    @staticmethod
    def _extract_openai_text(response: Any) -> str:
        choices = getattr(response, "choices", None)
        if not choices:
            raise LLMProviderError("OpenAI response contained no choices.")

        text = choices[0].get("text") if isinstance(choices, list) else None
        if text is None:
            raise LLMProviderError("Unable to extract text from OpenAI completion response.")

        return text.strip()

    @staticmethod
    def _extract_openai_chat_text(response: Any) -> str:
        choices = getattr(response, "choices", None)
        if not choices:
            raise LLMProviderError("OpenAI chat response contained no choices.")

        message = choices[0].get("message") if isinstance(choices, list) else None
        if not isinstance(message, dict):
            raise LLMProviderError("Unable to extract chat message from OpenAI response.")

        content = message.get("content")
        if content is None:
            raise LLMProviderError("OpenAI chat message contains no content.")

        return content.strip()
